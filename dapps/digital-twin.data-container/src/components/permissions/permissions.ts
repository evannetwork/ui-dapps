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

import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { EvanUIDigitalTwin, utils } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../dispatchers/registry';
import ContainerCache from '../../container-cache';
import UiContainer from '../../UiContainer';


interface ShareFormInterface extends EvanForm {
  subject: EvanFormControl;
}

@Component({ })
export default class PermissionsComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address
   */
  @Prop() containerAddress;

  /**
   * Is container opened in context to the digital twin
   */
  @Prop() digitalTwinAddress;

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Data container could not be loaded, e.g. no permissions.
   */
  error = false;

  /**
   * formular specific variables
   */
  shareForm: ShareFormInterface = null;

  /**
   * Watch for updates and disable current save button
   */
  sharingWatcher: Function = null;

  /**
   * Share object
   */
  share: any = {
    accountId: '',
    error: '',
    permissions: { },
  };

  /**
   * List of my contacts
   */
  contacts: Array<any> = [ ];
  myProfile: any = null;

  /**
   * Permissions for the current account
   */
  permissions = null;

  /**
   * Container instance
   */
  container: bcc.Container;

  /**
   * container description
   */
  description: any;

  /**
   * containers template definition
   */
  template: any;

  /**
   * Load the container data
   */
  async created() {
    const runtime = utils.getRuntime(this);
    this.loading = true;

    await UiContainer.watch(this, async (uiContainer: UiContainer) => {
      this.permissions = uiContainer.permissions;
      this.description = uiContainer.description;
      this.template = uiContainer.plugin.template;
      this.permissions.isOwner = uiContainer.owner === runtime.activeAccount;

      this.$set(this.$store.state, 'sharing', uiContainer.isSharing);
    });

    await this.setupAddressBook(runtime);
    this.setupSharingForm();

    // send instance to parent vue instance
    this.$emit('init', this);

    this.loading = false;
  }

  /**
   * Load runtime and map it into an array.,
   *
   * @param      {bccRuntime}  runtime  bcc runtime
   */
  async setupAddressBook(runtime: bcc.Runtime) {
    // load contacts and transform them into an array
    const addressBook = await runtime.profile.getAddressBook();
    bcc.Ipld.purgeCryptoInfo(addressBook);
    this.myProfile = addressBook.profile[runtime.activeAccount];
    this.contacts = Object
      .keys(addressBook.profile)
      .filter(address => address !== runtime.activeAccount)
      .map((address) => {
        const contact = addressBook.profile[address];
        contact.address = address;

        return contact;
      });

    // sharing requires at least one contact
    if (this.contacts.length > 0) {
      this.share.accountId = this.contacts[0].address;
    }
  }

  /**
   * Initialize share form.
   */
  async setupSharingForm() {
    // setup share form, so the user can insert a custom form
    let subject = [
      (<any>this).$t('_digitaltwins.breadcrumbs.datacontainer.digitaltwin'),
      `: ${ this.description.name }`,
    ];

    // if digital twin is opened, build subject including twin dbcp
    if (this.digitalTwinAddress) {
      const digitaltwin = EvanUIDigitalTwin.getDigitalTwin(
        utils.getRuntime(this),
        this.digitalTwinAddress
      );
      const twinDesc = await digitaltwin.getDescription();

      subject.unshift(`${ twinDesc.name }, `);
      subject.unshift(`${ (<any>this).$t('_digitaltwins.breadcrumbs.digitaltwin') }: `);
    }

    this.shareForm = (<ShareFormInterface>new EvanForm(this, {
      subject: {
        value: subject.join(''),
        validate: function(vueInstance: PermissionsComponent, form: ShareFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
    }));
  }

  /**
   * Share the data contract with others
   */
  shareDt() {
    const runtime = utils.getRuntime(this);
    const address = this.containerAddress;

    // transform the ui permission into an conainter share config
    const perm = this.share.permissions;
    const shareConfig: bcc.ContainerShareConfig = {
      accountId: this.share.accountId,
      read: Object.keys(perm).filter(entryKey => perm[entryKey] === 'read'),
      readWrite: Object.keys(perm).filter(entryKey => perm[entryKey] === 'write'),
    };

    const domainName = (<any>this).dapp.domainName;
    const bMailText = this.digitalTwinAddress ?
      '_datacontainer.share.bmail-twin' :
      '_datacontainer.share.bmail-container';
    const fullPath = [
       `/${ (<any>this).dapp.rootEns }`,
       `digitaltwins.${ domainName }`
    ];

    // if digital twin was opened, open container unter twin address when it was shared
    if (this.digitalTwinAddress) {
      fullPath.push(`digitaltwin.${ domainName }`);
      fullPath.push(this.digitalTwinAddress);
    }

    // apply container address
    fullPath.push(`datacontainer.digitaltwin.${ domainName }`);
    fullPath.push(address);

    // build bmail for invited user
    const bMailContent = {
      content: {
        from: runtime.activeAccount,
        fromAlias: this.myProfile.alias,
        title: (<any>this).$t('_datacontainer.share.bmail.title'),
        body: (<any>this).$t('_datacontainer.share.bmail.body', {
          alias: this.myProfile.alias,
          containerAddress: this.containerAddress,
          digitalTwinAddress: this.digitalTwinAddress,
          subject: this.shareForm.subject.value,
        }),
        attachments: [{
          type: 'url',
          fullPath: fullPath.join('/'),
        }],
      },
    };

    // start the dispatcher
    dispatchers.shareDispatcher.start(utils.getRuntime(this), {
      address,
      shareConfig,
      bMailContent,
    });

    (<any>this.$refs.shareModal).hide();
  }

  /**
   * Open the share dialog.
   *
   * @param      {any}  $event  click event
   */
  openShareDialog($event: any) {
    if (!this.permissions.isOwner) {
      this.share.error = 'no-permissions';
    } else if (this.contacts.length === 0) {
      this.share.error = 'no-contacts';
    } else {
      this.share.error = false;
    }

    this.$nextTick(() => (<any>this).$refs.shareModal.show());
  }
}
