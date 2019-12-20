/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/
*/

// vue imports
import Component, { mixins } from 'vue-class-component';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';

import attachmentDispatcher from '../../dispatchers/attachmentDispatcher';

@Component({ })
export default class DetailComponent extends mixins(EvanComponent) {
  /**
   * mail detail of the opened mail address
   */
  mail: any;

  /**
   * show loading symbol
   */
  loading = true;

  /**
   * Currents users contacts
   */
  addressBook: any;

  /**
   * When an attachment gets accepted, show an loading animation and disable the buttons
   */
  acceptingAttachment = false;

  /**
   * Load the mail details
   */
  async created() {
    const runtime = (<any>this).getRuntime();

    this.mail = (await runtime.mailbox
      .getMail((<any>this).$route.params.mailAddress)).content;
    this.addressBook = (await runtime.profile.getAddressBook()).profile;

    // check the attachment status
    if (this.mail.attachments) {
      await Promise.all(this.mail.attachments.map(async (attachment) => {
        let accepted;

        switch (attachment.type) {
          case 'commKey': {
            // check if the commKey was already added
            accepted = !!(await runtime.profile
              .getContactKey(this.mail.from, 'commKey'));

            break;
          }
          case 'contract': {
            accepted = !!(await runtime.profile.getBcContract(
              attachment.bc,
              attachment.storeKey || attachment.address
            ));

            break;
          }
          case 'url': {
            accepted = true;

            break;
          }
          case 'verifications': {
            // for(let key of attachment.keys) {

            // }
            // accepted = !!(await runtime.profile.getBcContract(
            //   attachment.bc,
            //   attachment.storeKey || attachment.address
            // ));

            accepted = false;

            break;
          }
          default: {
            attachment.unkown = true;
          }
        }

        attachment.status = accepted ? 'accepted' : 'new';
      }));
    }

    this.loading = false;
  }

  /**
   * Triggers the attachment dispatcher and accepts the contact / contract / ...
   */
  acceptAttachment(attachment: any, mail: any, index: number, modalRef: any) {
    const runtime = (<any>this).getRuntime();
    attachmentDispatcher.start(runtime, {
      attachment,
      mail,
    });
    this.acceptingAttachment = true;
    attachmentDispatcher.watch(($event: CustomEvent) => {
      const instance = $event.detail.instance;

      // when the synchronisation has finished, navigate to the correct entry
      if (instance.status === 'finished') {
        this.mail.attachments[index].status = 'accepted';
        this.acceptingAttachment = false;
      }
    });
    modalRef.hide();
  }

  /**
   * Checks if the attachment needs be accepted. If it's need to be accepted, show the accept modal,
   * else open the attachment
   */
  openAttachment(attachment: any, attachmentIndex: number, modalRef: any) {
    if (attachment.status === 'accepted') {
      let toOpen;

      if (attachment.fullPath) {
        toOpen = attachment.fullPath;
      } else {
        let storeKey = attachment.storeKey || attachment.address;
        if (storeKey) {
          // use storeKey as default value that should be opened
          toOpen = `/${ storeKey }`;

          // when a bc was added, open it including the bc
          if (attachment.bc) {
            toOpen = `/${ attachment.bc }${ toOpen }`;
          }
        }
      }

      // if no opener was found, check for the specific type default redirects
      if (!toOpen) {
        const domainName: string = (this as any).dapp.domainName;
        switch (attachment.type) {
          case 'commKey': {
            toOpen = [
              `/dashboard.vue.${ domainName }`,
              `profile.vue.${ domainName }`,
              `${ this.mail.from }`
            ].join('/');
            break;
          }
        }
      }

      window.location.hash = [
        `${ toOpen }?`,
        `mailId=${ (<any>this).$route.params.mailAddress }`,
        `attachment=${ attachmentIndex }`
      ].join('&');
    } else {
      modalRef.show();
    }
  }
}
