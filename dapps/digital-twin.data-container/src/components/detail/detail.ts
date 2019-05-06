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
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

import * as utils from '../../utils';
import * as dispatchers from '../../dispatchers/registry';
import ContainerCache from '../../container-cache';

interface DbcpFormInterface extends EvanForm {
  description: EvanFormControl;
  img: EvanFormControl;
  name: EvanFormControl;
}

interface ShareFormInterface extends EvanForm {
  subject: EvanFormControl;
}

@Component({ })
export default class DetailComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address (save it from routes to this variable, so all beforeDestroy
   * listeners for template-handlers will work correctly and do not uses a new address that is
   * laoding)
   */
  containerAddress = '';

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Enable the save button, when anything has changed
   */
  enableSave = false;

  /**
   * digitalTwin address, where the container should be created for
   */
  digitalTwinAddress = '';

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
   * Watch for updates, so we can enable the save button
   */
  valuesChanged: any;

  /**
   * formular specific variables
   */
  dbcpForm: DbcpFormInterface = null;
  shareForm: ShareFormInterface = null;

  /**
   * Watch for updates and disable current save button
   */
  savingWatcher: Function = null;
  sharingWatcher: Function = null;

  /**
   * Share object
   */
  share: any = {
    accountId: '',
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
   * Load the container data
   */
  async created() {
    this.containerAddress = this.$route.params.containerAddress;

    const runtime = utils.getRuntime(this);
    await this.initialize();

    this.valuesChanged = (($event) => this.enableSave = true).bind(this);
    // watch for saving updates
    this.savingWatcher = dispatchers.updateDispatcher.watch(async () => {
      const instances = await dispatchers.updateDispatcher.getInstances(runtime);
      const beforeSaving = this.$store.state.saving;

      const saving = instances
        .filter(instance => instance.data.address === this.containerAddress)
        .length > 0;

      this.$set(this.$store.state, 'saving', saving);

      // reload the data
      if (!this.$store.state.saving && beforeSaving) {
        this.enableSave = false;
        this.initialize();
      }
    });

    // watch for sharings watcher
    this.sharingWatcher = dispatchers.shareDispatcher.watch(async () => {
      const instances = await dispatchers.shareDispatcher.getInstances(runtime);
      const sharing = instances
        .filter(instance => instance.data.address === this.containerAddress)
        .length > 0;

      this.$set(this.$store.state, 'sharing', sharing);
    });

    // watch for updates
    window.addEventListener('dc-value-changed', this.valuesChanged);
  }

  /**
   * Clear watchers
   */
  beforeDestroy() {
    window.removeEventListener('dc-value-changed', this.valuesChanged);
  }

  /**
   * Load the container data and setup the dbcp update form.
   */
  async initialize() {
    const runtime = utils.getRuntime(this);
    this.loading = true;

    const splitHash = (<any>this).dapp.baseHash.split('/');
    const twinDAppIndex = splitHash.indexOf(`digitaltwin.${ (<any>this).dapp.domainName }`);
    if (twinDAppIndex !== -1) {
      this.digitalTwinAddress = splitHash[twinDAppIndex + 1];
    }

    // get the container instance and load the template including all values
    this.container = utils.getContainer(<any>runtime, this.containerAddress);
    const [ description, template, permissions, isOwner ] = await Promise.all([
      this.container.getDescription(),
      this.container.toTemplate(true),
      this.container.getContainerShareConfigForAccount(runtime.activeAccount),
      (await this.container.getOwner()) === runtime.activeAccount
    ]);
    this.description = description;
    this.template = template;
    this.permissions = permissions;
    this.permissions.isOwner = isOwner;

    // set custom translation
    const customTranslation = { };
    customTranslation[ `_datacontainer.breadcrumbs.${ this.containerAddress }`] =
      this.description.name;
    (<any>this).$i18n.add((<any>this).$i18n.locale(), customTranslation);

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
    this.share.accountId = this.contacts[0].address;

    // set dbcp form
    this.dbcpForm = (<DbcpFormInterface>new EvanForm(this, {
      name: {
        value: this.description.name,
        validate: function(vueInstance: DetailComponent, form: DbcpFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
      description: {
        value: this.description.description,
        validate: function(vueInstance: DetailComponent, form: DbcpFormInterface) {
          return true;
        }
      },
      img: {
        value: '',
      },
    }));

    // setup share form, so the user can insert a custom form
    let subject = [
      (<any>this).$t('_datacontainer.breadcrumbs.datacontainer.digitaltwin'),
      `: ${ this.description.name }`,
      this.digitalTwinAddress ? ` - ${ this.digitalTwinAddress }` : ''
    ].join('');

    this.shareForm = (<ShareFormInterface>new EvanForm(this, {
      subject: {
        value: subject,
        validate: function(vueInstance: DetailComponent, form: ShareFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
    }));

    this.loading = false;
  }

  /**
   * Trigger the digital twin save
   */
  async saveContainer() {
    if (!this.$store.state.saving && this.dbcpForm.isValid) {
      const runtime = utils.getRuntime(this);

      // hide current schema editor, so the beforeDestroy event is triggered and the data of the
      // opened ajv editor is saved
      this.loading = true;
      this.$store.state.saving = true;

      // update description backup
      this.description.name = this.dbcpForm.name.value;
      this.description.description = this.dbcpForm.description.value;

      // disable value caching within the template handler and delete the latest cache
      (<any>this.$refs.templateHandler).cacheChanges = false;
      await (new ContainerCache(runtime.activeAccount)).delete(this.containerAddress);

      // hide dbcp modal
      (<any>this.$refs.dbcpModal) && (<any>this.$refs.dbcpModal).hide();

      // wait for the template handler to saved all the data
      this.$nextTick(async () => {
        dispatchers.updateDispatcher.start(runtime, {
          address: this.containerAddress,
          description: this.dbcpForm.description.value,
          digitalTwinAddress: this.digitalTwinAddress,
          img: this.dbcpForm.img.value,
          name: this.dbcpForm.name.value,
          template: this.template,
        });

        this.loading = false;
      });
    }
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
        }]
      }
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
   * When the dbcp edit modal was canceled, restore original dbcp value
   */
  cancelDbcpModal(eventArgs: any) {
    this.$nextTick(() => {
      // don't close on backdrop
      if (eventArgs.backdrop) {
        (<any>this).$refs.dbcpModal.show();
      } else {
        this.dbcpForm.name.value = this.description.name;
        this.dbcpForm.description.value = this.description.description;
      }
    });
  }
}
