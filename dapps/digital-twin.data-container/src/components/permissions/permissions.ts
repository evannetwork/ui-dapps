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
import { utils } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../dispatchers/registry';
import ContainerCache from '../../container-cache';


interface ShareFormInterface extends EvanForm {
  subject: EvanFormControl;
}

@Component({ })
export default class PermissionsComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address (save it from routes to this variable, so all beforeDestroy
   * listeners for template-handlers will work correctly and do not uses a new address that is
   * laoding)
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
    this.containerAddress = this.$route.params.containerAddress;

    const runtime = utils.getRuntime(this);
    await this.initialize();

    // watch for sharings watcher
    this.sharingWatcher = dispatchers.shareDispatcher.watch(async () => {
      const instances = await dispatchers.shareDispatcher.getInstances(runtime);
      const sharing = instances
        .filter(instance => instance.data.address === this.containerAddress)
        .length > 0;

      this.$set(this.$store.state, 'sharing', sharing);
    });
  }

  /**
   * Clear watchers
   */
  beforeDestroy() {
    this.sharingWatcher();
  }

  /**
   * Load the container data and setup the dbcp update form.
   */
  async initialize() {
    const runtime = utils.getRuntime(this);
    this.loading = true;

    try {
      // get the container instance and load the template including all values
      this.container = utils.getContainer(<any>runtime, this.containerAddress);
      const [ plugin, permissions, isOwner ] = await Promise.all([
        this.container.toPlugin(false),
        this.container.getContainerShareConfigForAccount(runtime.activeAccount),
        (await this.container.getOwner()) === runtime.activeAccount
      ]);

      this.description = plugin.description;
      this.permissions = permissions;
      this.permissions.isOwner = isOwner;
      this.permissions.read = this.permissions.read || [ ];
      this.permissions.readWrite = this.permissions.readWrite || [ ];
      this.template = plugin.template;
    } catch (ex) {
      runtime.logger.log(`Could not load DataContainer detail: ${ ex.message }`, 'error');
      this.error = true;
      this.loading = false;

      return;
    }

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

    // setup share form, so the user can insert a custom form
    let subject = [
      (<any>this).$t('_datacontainer.breadcrumbs.datacontainer.digitaltwin'),
      `: ${ this.description.name }`,
      this.digitalTwinAddress ? ` - ${ this.digitalTwinAddress }` : ''
    ].join('');

    this.shareForm = (<ShareFormInterface>new EvanForm(this, {
      subject: {
        value: subject,
        validate: function(vueInstance: PermissionsComponent, form: ShareFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
    }));

    this.loading = false;
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
    // build bmail for invited user
    const bMailContent = {
      content: {
        from: runtime.activeAccount,
        fromAlias: this.myProfile.alias,
        title: (<any>this).$t('_datacontainer.share.bmail.title'),
        body: (<any>this).$t('_datacontainer.share.bmail.body', {
          alias: this.myProfile.alias,
          subject: this.shareForm.subject.value,
        }),
        attachments: [{
          address: address,
          bc: `datacontainer.digitaltwin.${ (<any>this).dapp.domainName }`,
          type: 'contract',
          fullPath: [
            `/${ (<any>this).dapp.rootEns }`,
            `datacontainer.digitaltwin.${ (<any>this).dapp.domainName }`,
            address,
          ].join('/'),
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

    this.$nextTick(() => {
      (<any>this).$refs.shareModal.show();
      (<any>this).$refs.containerContextMenu.hide($event);
    });
  }
}
