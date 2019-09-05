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
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { EvanUIDigitalTwink, utils } from '@evan.network/digitaltwin.lib'

import * as dispatchers from '../../../dispatchers/registry';
import * as entryUtils from '../../../entries';
import ContainerCache from '../../../container-cache';
import UiContainer from '../../../UiContainer';


interface ShareFormInterface extends EvanForm {
  title: EvanFormControl;
  body: EvanFormControl;
}

@Component({ })
export default class PluginActionsComponent extends mixins(EvanComponent) {
  /**
   * plugin that should be loaded
   */
  @Prop() pluginName;

  /**
   * Enable Digital twin Actions (edit dbcp, map to ens, favorite toggle)
   */
  @Prop() pluginActions;

  /**
   * Enable data set actions (add set)
   */
  @Prop() setActions;

  /**
   * Dropdown mode (buttons / dropdownButton / dropdownIcon / dropdownHidden)
   */
  @Prop({
    default: 'buttons'
  }) displayMode;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Used per default for normal buttons (will be overwritten within dropdown)
   */
  buttonClasses = {
    primary: 'btn btn-primary btn-circle d-flex align-items-center justify-content-center mr-1',
    secondary: 'btn btn-circle btn-outline-secondary mr-1',
    tertiar: 'btn btn-icon mr-1',
  }

  buttonTextComp = 'evan-tooltip';

  /**
   * Is a save dispatcher for this plugin running?
   */
  deleting = false;
  saving = false;
  sharing = false;

  /**
   * formular specific variables
   */
  shareForm: ShareFormInterface = null;

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
   * Show loading symbol
   */
  loading = false;

  /**
   * container description
   */
  description: any;

  /**
   * Ui container instance
   */
  uiContainer: UiContainer = null;

  /**
   * containers plugin definition
   */
  plugin: any = null;

  /**
   * Set button classes
   */
  async created() {
    if (this.displayMode !== 'buttons') {
      Object.keys(this.buttonClasses).forEach(
        type => this.buttonClasses[type] = 'dropdown-item pt-2 pb-2 pl-3 pr-3 clickable'
      );

      this.buttonTextComp = 'span';
    } else {
      // only initialize directly on startup when button view is enabled
      await this.initialize();
    }
  }

  /**
   * Load the plugin data.
   */
  async initialize() {
    this.loading = true;
    const runtime = utils.getRuntime(this);

    // watch for updates
    try {
      this.uiContainer = await UiContainer.watch(this, async (uiContainer: UiContainer) => {
        this.deleting = uiContainer.isDeleting;
        this.description = uiContainer.description;
        this.plugin = uiContainer.plugin;
        this.saving = uiContainer.isSaving;
        this.sharing = uiContainer.isSharing;
      });
    } catch (ex) {
      if (ex.message.indexOf('No container address applied!') === -1) {
        runtime.logger.log(ex.message, 'error');
      }

      return;
    }

    await this.setupAddressBook(runtime);
    this.setupSharingForm();

    this.loading = false;
  }

  /**
   * Show the actions dropdown.
   */
  showDropdown($event?: any) {
    // load data for dropdowns
    !this.loading && !this.plugin && this.initialize();

    (<any>this).$refs.dtContextMenu.show();
    $event && $event.preventDefault();
  }

  /**
   * Close the actions dropdown.
   */
  closeDropdown() {
    (<any>this).$refs.dtContextMenu && (<any>this).$refs.dtContextMenu.hide();
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
      this.shareAccount = this.contacts[0].address;
    }
  }

  /**
   * Initialize share form.
   */
  setupSharingForm() {
    // setup share form, so the user can insert a custom b-mail title, message
    this.shareForm = (<ShareFormInterface>new EvanForm(this, {
      title: {
        value: [
          (<any>this).$t('_digitaltwins.breadcrumbs.plugin'),
          `: ${ this.description.name }`,
        ].join(''),
        validate: function(vueInstance: PluginActionsComponent, form: ShareFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
      body: {
        value: (<any>this).$t('_datacontainer.plugin.bmail.body', {
          alias: this.myProfile.alias,
          name: this.description.name,
        }),
        validate: function(vueInstance: PluginActionsComponent, form: ShareFormInterface) {
          return this.value.trim().length !== 0;
        }
      }
    }));
  }

  /**
   * Trigger the digital twin save
   *
   * @param      {boolean}  onlyDbcp  save only the description
   */
  async saveDbcp() {
    const dbcpForm = this.reactiveRefs.dbcpForm;

    if (!this.saving && dbcpForm.isValid) {
      const runtime = utils.getRuntime(this);

      // hide current schema editor, so the beforeDestroy event is triggered and the data of the
      // opened ajv editor is saved
      this.loading = true;
      this.saving = true;

      // update description backup
      this.description.name = dbcpForm.name.value;
      this.description.description = dbcpForm.description.value;

      // hide dbcp modal
      (<any>this.reactiveRefs.dbcpModal) && (<any>this.reactiveRefs.dbcpModal).hide();

      // wait for the template handler to saved all the data
      this.$nextTick(async () => {
        dispatchers.pluginDispatcher.start(runtime, {
          description: {
            description: dbcpForm.description.value,
            imgSquare: dbcpForm.imgSquare.value,
            name: dbcpForm.name.value,
          },
          beforeName: this.pluginName,
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
        title: this.shareForm.title.value,
        body: this.shareForm.body.value.replace(/\n/g, '<br>'),
        attachments: [{
          fullPath: [
            `/${ (<any>this).dapp.rootEns }`,
            `digitaltwins.${ (<any>this).dapp.domainName }`,
            `my-plugins`,
          ].join('/'),
          type: 'url',
          storeValue: {
            description: {
              description: this.description.description,
              imgSquare: this.description.imgSquare,
              name: this.description.name,
            },
            template: this.plugin.template,
          },
        }],
      },
    };

    // start the dispatcher
    dispatchers.pluginShareDispatcher.start(utils.getRuntime(this), {
      address,
      shareConfig,
      bMailContent,
    });

    (<any>this.reactiveRefs.shareModal).hide();
  }

  /**
   * Executed by the `dc-new-entry` components submit event.
   *
   * @param      {any}  newEntry  dc-new-entry result obj
   */
  addNewEntry(newEntry: any) {
    const runtime = utils.getRuntime(this);
    const containerCache = new ContainerCache(runtime.activeAccount);

    // update template
    newEntry.entry.isNew = true;
    this.plugin.template.properties[newEntry.name] = newEntry.entry;
    entryUtils.ensureValues(this.pluginName, this.plugin.template.properties[newEntry.name]);

    // send event
    containerCache.put(this.pluginName, this.uiContainer.plugin);

    setTimeout(() => {
      // navigate to new entry
      const dapp: any = (<any>this).dapp;
      window.location.hash = [
        `${ dapp.rootEns }/digitaltwins.${ dapp.domainName }`,
        `datacontainer.digitaltwin.${ dapp.domainName }`,
        `${ this.pluginName }/data-set/${ newEntry.name }/entry-schema`
      ].join('/');
    });
  }

  /**
   * Starts the delete dispatcher for this plugin.
   */
  deletePlugin() {
    const dapp: any = (<any>this).dapp;

    // start remove dispatcher
    dispatchers.pluginRemoveDispatcher.start(utils.getRuntime(this), { name: this.pluginName });

    // navigate back to plugin overview
    window.location.hash = `${ dapp.rootEns }/digitaltwins.${ dapp.domainName }/my-plugins`;
    this.reactiveRefs.deleteModal.hide();
  }

  /**
   * Export the plugin as json.
   */
  exportPlugin() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(this.plugin));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href',     dataStr);
    downloadAnchorNode.setAttribute('download', this.pluginName + '.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
