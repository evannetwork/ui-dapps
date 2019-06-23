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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import * as dispatchers from '../../dispatchers/registry';

interface ContactFormInterface extends EvanForm {
  accountId: EvanFormControl;
  alias: EvanFormControl;
  email: EvanFormControl;
  tags: EvanFormControl;
}

@Component({ })
export default class ContactDetailComponent extends mixins(EvanComponent) {
  /**
   * formular specific variables
   */
  contactForm: ContactFormInterface = null;

  /**
   * status flags
   */
  loading = false;

  /**
   * Used for easier building form i18n keys
   */
  formI18nScope = '_addressbook.contact-form';

  /**
   * Last opened address
   */
  accountId = '';
  contact = null;

  /**
   * Load a specific contact and show the contact detail modal.
   *
   * @param      {string}  accountId  contact address that should be loaded
   */
  async setupContactForm(accountId: string) {
    this.loading = true;

    const runtime = (<any>this).getRuntime();
    const addressBook = await runtime.profile.getAddressBook();

    // set runtime params
    this.accountId = accountId;
    this.contact = addressBook.profile[accountId];

    // parse tags to have the correct format (move string as one entry to an new array, default
    // is an array)
    if (!Array.isArray(this.contact.tags)) {
      if (typeof this.contact.tags === 'string') {
        this.contact.tags = [ this.contact.tags ];
      } else {
        this.contact.tags = [ ];
      }
    }

    // specify contact form
    this.contactForm = (<ContactFormInterface>new EvanForm(this, {
      alias: {
        value: this.contact.alias,
        validate: function(vueInstance: ContactDetailComponent, form: ContactFormInterface) {
          return this.value.length !== 0;
        }
      },
      tags: {
        value: this.contact.tags.join(' '),
      },
      emailInvite: {
        value: this.contact.email && !this.contact.accountId,
      },
      accountId: {
        value: this.accountId,
      },
      email: {
        value: this.contact.email,
      }
    }));

    this.loading = false;
  }

  /**
   * Save the new contact using the queue.
   */
  saveContact() {
    // data that should be passed to the invite dispatcher
    const formData = {
      accountId: this.contactForm.accountId.value,
      alias: this.contactForm.alias.value,
      email: this.contactForm.email.value,
      tags: this.contactForm.tags.value.trim().replace(/\s{2,}/g, ' ').split(' '),
    };

    // start invite dispatcher
    dispatchers.updateDispatcher.start((<any>this).getRuntime(), formData);

    // hide modal
    (<any>this.$refs.contactModal) && (<any>this.$refs.contactModal).hide();
  }

  /**
   * Remove the current selected contact.
   */
  removeContact() {
    // start invite dispatcher
    dispatchers.removeDispatcher.start((<any>this).getRuntime(), {
      accountId: this.contactForm.accountId.value,
      email: this.contactForm.email.value,
    });

    // hide modal
    (<any>this.$refs.contactModal) && (<any>this.$refs.contactModal).hide();
    (<any>this.$refs.contactRemoveModal) && (<any>this.$refs.contactRemoveModal).hide();
  }

  /**
   * Opens the contacts modal.
   *
   * @param      {string}  accountId  contact address that should be loaded
   */
  show(accountId: string) {
    // load contact details
    this.setupContactForm(accountId);

    (<any>this.$refs.contactModal).show();
  }

  /**
   * Opens the contacts modal
   */
  close() {
    (<any>this.$refs.contactModal).hide();
  }
}
