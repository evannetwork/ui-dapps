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

import * as dispatchers from '../../../dispatchers/registry';
import ContainerCache from '../../../container-cache';


interface DbcpFormInterface extends EvanForm {
  description: EvanFormControl;
  img: EvanFormControl;
  name: EvanFormControl;
}

interface ShareFormInterface extends EvanForm {
  subject: EvanFormControl;
}

@Component({ })
export default class PluginComponent extends mixins(EvanComponent) {
  /**
   * Current opened plugin name (save it from routes to this variable, so all beforeDestroy
   * listeners for template-handlers will work correctly and do not uses a new address that is
   * laoding)
   */
  pluginName = '';

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Enable the save button, when anything has changed
   */
  enableSave = false;

  /**
   * Is a save dispatcher for this plugin running?
   */
  saving = false;

  /**
   * is a sharing dispatcher for this plugin running?
   */
  sharing = false;

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
  shareAccount = '';

  /**
   * List of my contacts
   */
  contacts: Array<any> = [ ];
  myProfile: any = null;

  /**
   * Empty permissions that can be passed using isOwner flag to template-handler
   */
  permissions = {
    isOwner: true,
    read: [ ],
    readWrite: [ ],
  };

  /**
   * Load the container data
   */
  async created() {
    this.pluginName = this.$route.params.plugin;

    const runtime = utils.getRuntime(this);
    await this.initialize();

    this.valuesChanged = (($event) => this.enableSave = true).bind(this);
    // watch for saving updates
    this.savingWatcher = dispatchers.pluginDispatcher.watch(async () => {
      const beforeSaving = this.saving;

      this.saving = (await dispatchers.pluginDispatcher.getInstances(runtime))
        .filter(instance => instance.data.name === this.pluginName)
        .length > 0;

      // reload the data
      if (!this.saving && beforeSaving) {
        this.enableSave = false;
        this.initialize();
      }
    });

    // watch for sharings watcher
    this.sharingWatcher = dispatchers.shareDispatcher.watch(async () => {
      this.sharing = (await dispatchers.pluginDispatcher.getInstances(runtime))
        .filter(instance => instance.data.name === this.pluginName)
        .length > 0;
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

    const loadedPlugin = await bcc.Container.getContainerPlugin(runtime.profile,
      this.pluginName);

    this.description = loadedPlugin.description;
    this.template = loadedPlugin.template;

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
      this.shareAccount = this.contacts[0].address;
    }

    // set dbcp form
    this.dbcpForm = (<DbcpFormInterface>new EvanForm(this, {
      name: {
        value: this.description.name,
        validate: function(vueInstance: PluginComponent, form: DbcpFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
      description: {
        value: this.description.description,
        validate: function(vueInstance: PluginComponent, form: DbcpFormInterface) {
          return true;
        }
      },
      img: {
        value: '',
      },
    }));

    // setup share form, so the user can insert a custom form
    let subject = [
      (<any>this).$t('_datacontainer.breadcrumbs.plugin'),
      `: ${ this.description.name }`,
      this.pluginName ? ` - ${ this.pluginName }` : ''
    ].join('');

    this.shareForm = (<ShareFormInterface>new EvanForm(this, {
      subject: {
        value: subject,
        validate: function(vueInstance: PluginComponent, form: ShareFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
    }));

    this.loading = false;
  }

  /**
   * Trigger the digital twin save
   *
   * @param      {boolean}  onlyDbcp  save only the description
   */
  async savePlugin(onlyDbcp = false) {
    if (!this.saving && this.dbcpForm.isValid) {
      // when the plugin should be saved, check if all changes have been changed
      if (!onlyDbcp) {
        const unsavedChanges = (<any>this.$refs.templateHandler).getUnsavedChanges(true);
        if (unsavedChanges.length !== 0) {
          return;
        }
      }

      const runtime = utils.getRuntime(this);

      // hide current schema editor, so the beforeDestroy event is triggered and the data of the
      // opened ajv editor is saved
      this.loading = true;
      this.saving = true;

      // update description backup
      this.description.name = this.dbcpForm.name.value;
      this.description.description = this.dbcpForm.description.value;

      // disable value caching within the template handler and delete the latest cache
      (<any>this.$refs.templateHandler).cacheChanges = false;
      await (new ContainerCache(runtime.activeAccount)).delete(this.pluginName);

      // hide dbcp modal
      (<any>this.$refs.dbcpModal) && (<any>this.$refs.dbcpModal).hide();

      // wait for the template handler to saved all the data
      this.$nextTick(async () => {
        dispatchers.pluginDispatcher.start(runtime, {
          description: {
            description: this.dbcpForm.description.value,
            imgSquare: this.dbcpForm.img.value,
            name: this.dbcpForm.name.value,
          },
          beforeName: this.pluginName,
          template: onlyDbcp ? undefined : this.template,
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
    const address = this.pluginName;

    // transform the ui permission into an conainter share config
    const shareConfig: bcc.ContainerShareConfig = { accountId: this.shareAccount, };

    // build bmail for invited user
    const bMailContent = {
      content: {
        from: runtime.activeAccount,
        fromAlias: this.myProfile.alias,
        title: (<any>this).$t('_datacontainer.plugin.bmail.title'),
        body: (<any>this).$t('_datacontainer.plugin.bmail.body', {
          alias: this.myProfile.alias,
          subject: this.shareForm.subject.value,
        }),
        attachments: [{
          address: this.pluginName,
          bc: bcc.Container.profilePluginsKey,
          fullPath: [
            `/${ (<any>this).dapp.rootEns }`,
            `digitaltwins.${ (<any>this).dapp.domainName }`,
            `datacontainer.digitaltwin.${ (<any>this).dapp.domainName }`,
            `plugin/${ this.dbcpForm.name.value }`,
          ].join('/'),
          type: 'contract',
          storeKey: this.pluginName,
          storeValue: {
            description: {
              description: this.dbcpForm.description.value,
              img: this.dbcpForm.img.value,
              name: this.dbcpForm.name.value,
            },
            template: this.template,
          },
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
