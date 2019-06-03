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
import { utils } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../dispatchers/registry';
import * as entryUtils from '../../entries';
import * as fieldUtils from '../../fields';
import ContainerCache from '../../container-cache';
import { getDtAddressFromUrl } from '../../utils';


interface CreateInterface extends EvanForm {
  description: EvanFormControl;
  imgSquare: EvanFormControl;
  name: EvanFormControl;
  plugin: EvanFormControl;
}

@Component({ })
export default class CreateComponent extends mixins(EvanComponent) {
  /**
   * Address to clone the new container / plugin from
   */
  @Prop() cloneAddress;

  /**
   * container / plugin
   */
  @Prop({
    default: 'container'
  }) mode;

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Is a datacontainer currently in creation?
   */
  creating = false;

  /**
   * formular specific variables
   */
  createForm: CreateInterface = null;

  /**
   *   digitalTwin address, where the container should be created for
   */
  digitalTwinAddress = '';

  /**
   * Available steps represented by it's titles
   */
  steps: Array<any> = [ ];

  /**
   * current active step
   */
  activeStep = 0;

  /**
   * Available plugins
   */
  plugins: Array<any> = [
    {
      description: {
        name: '_datacontainer.createForm.base-plugin',
        description: '',
      },
      template: {
        type: 'metadata',
        properties: { },
      }
    }
  ];

  /**
   * unmount dispatcher listeners
   */
  creationWatcher: Function;

  /**
   * Should the breadcrumbs be displayed? Hidden when evan-navigation tabs are visible
   */
  hideBreadcrumbs = false;

  /**
   * Empty permissions that can be passed using isOwner flag to template-handler
   */
  permissions = {
    isOwner: true,
    read: [ ],
    readWrite: [ ],
  };

  /**
   * Plugin that was selected from the plugin list. When set, will activate steppers.
   */
  activePlugin = null;

  /**
   * Map getType so it can be accessed in template
   */
  getEntryType = fieldUtils.getType;

  /**
   * Setup the form.
   */
  async created() {
    const runtime = utils.getRuntime(this);
    this.hideBreadcrumbs = document.querySelectorAll('.evan-navigation-tabs').length > 0;
    this.digitalTwinAddress = getDtAddressFromUrl((<any>this).dapp);

    // TODO: load plugins
    this.createForm = (<CreateInterface>new EvanForm(this, {
      name: {
        value: '',
        validate: function(vueInstance: CreateComponent, form: CreateInterface) {
          return this.value.trim().length !== 0;
        }
      },
      description: {
        value: ''
      },
      plugin: {
        value: 0
      },
      imgSquare: {
        value: ''
      },
    }));

    const plugins = await utils.getMyPlugins(runtime);
    Object.keys(plugins).forEach((key: string) => {
      this.plugins.push(plugins[key]);
    });

    // check if a existing container should be cloned
    if (this.cloneAddress) {
      // if a plugin is available that should used to create a container / plugin, load the
      // plugin
      if (plugins[this.cloneAddress]) {
        const plugin = await bcc.Container.getContainerPlugin(runtime.profile,
          this.cloneAddress);

        // setup plugin and description
        // this.createForm.name.value = plugin.description.name;
        this.createForm.description.value = plugin.description.description;

        // search for active plugin index
        for (let i = 0; i < this.plugins.length; i++) {
          if (this.plugins[i].description.name === this.cloneAddress) {
            this.createForm.plugin.value = i;

            break;
          }
        }
      } else if (this.cloneAddress.startsWith('0x')) {
        const container = utils.getContainer(<any>runtime, this.cloneAddress);
        const plugin = await container.toPlugin(true);

        // this.createForm.name.value = plugin.description.name;
        this.createForm.description.value = plugin.description.description;

        // apply the contract as template
        this.plugins.push(plugin);

        // set correct template index
        this.createForm.plugin.value = this.plugins.length - 1;
      }
    }

    this.loading = false;
    this.watchForCreation();
    this.$emit('init', this);
  }

  /**
   * Create the new container
   */
  async create() {
    const runtime = utils.getRuntime(this);

    if (this.mode === 'plugin') {
      dispatchers.pluginDispatcher.start(runtime, {
        description: {
          description: this.createForm.description.value,
          imgSquare: this.createForm.imgSquare.value,
          name: this.createForm.name.value,
        },
        template: this.plugins[this.createForm.plugin.value].template,
      });
    } else {
      dispatchers.createDispatcher.start(runtime, {
        digitalTwinAddress: this.digitalTwinAddress,
        description: {
          description: this.createForm.description.value,
          imgSquare: this.createForm.imgSquare.value,
          name: this.createForm.name.value,
        },
        plugin: this.plugins[this.createForm.plugin.value],
      });
    }

    (<any>this.$refs.createModal).hide();
    await (new ContainerCache(runtime.activeAccount))
      .delete(this.mode === 'plugin' ? 'plugin-create' : 'dc-create');
  }

  /**
   * Unmount dispatcher watchers
   */
  beforeDestroy() {
    this.creationWatcher && this.creationWatcher();
  }

  /**
   * Activate a plugin and calculate the steppers.
   *
   * @param      {any}      plugin    plugin that should be activated
   * @param      {boolean}  dbcpHint  hide edit dbcp hint when false
   */
  activatePlugin(plugin: any, dbcpHint = true) {
    this.saveActiveStep();
    this.activePlugin = plugin;

    // reset steps
    this.$set(this, 'steps', [ ]);

    // apply the new active plugin entries as new steps
    const customTranslation = { };
    Object.keys(plugin.template.properties).forEach((entryName: string) => {
      // add the steps
      const title = `_datacontainer.breadcrumbs.${ entryName }`;
      this.steps.push({
        title,
        entryName,
        disabled: () => false
      });
      customTranslation[title] = entryName;

      /**
       * Takes an entry and checks for type array. If it's an array, ensure, that the value array
       * and an addValue object is added. Per default, this values are not returned by the API,
       * templates does not support list entries export and must be load dynamically. The value
       * array is used to handle new arrays, that will be persisted for caching to the indexeddb
       * like the normal entries
       */
      entryUtils.ensureValues(plugin.template.properties[entryName]);
    });
    (<any>this).$i18n.add((<any>this).$i18n.locale(), customTranslation);

    if (dbcpHint) {
      // wait for rendering the dbcp-edit button and show a tooltip hint
      this.$nextTick(() => {
        const tooltip = (<any>this.$refs.editDbcphint);

        // show the tooltip
        tooltip.onMouseEnter();

        // hide the tooltip
        setTimeout(() => {
          tooltip.onMouseLeave();
        }, 5e3);
      });
    }
  }

  /**
   * Takes the response from the dc-new-entry and adds the new property
   *
   * @param      {any}  entryData  The entry data
   */
  addNewEntry(entryData: any) {
    this.activePlugin.template.properties[entryData.name] = entryData.entry;

    // navigate to the new data set
    // this.activateTab(Object.keys(this.template.properties).indexOf(trimmedName));

    utils.enableDTSave();
    this.activatePlugin(this.activePlugin, true);
  }

  /**
   * Saves current changes and navigates to next step.
   */
  nextStep() {
    this.saveActiveStep();

    // if we are on the last step, ask to finish creation
    if (this.steps.length === 0 || this.activeStep === (this.steps.length - 1)) {
      (<any>this.$refs.createModal).show();
    } else {
      // navigate to next step.
      this.steps[this.activeStep].valid = true;
      this.activeStep = this.activeStep + 1;
    }
  }

  /**
   * Save latest step entry edit values.
   */
  saveActiveStep() {
    if (this.steps[this.activeStep] && this.steps[this.activeStep].entryComp) {
      this.steps[this.activeStep].entryComp.save();
    }
  }

  /**
   * Start a listener to watch for creation updates
   */
  async watchForCreation() {
    const getDispatcher = () => this.mode === 'plugin' ?
      dispatchers.pluginDispatcher : dispatchers.createDispatcher;

    const watch = async ($event?: any) => {
      const beforeCreating = this.creating;
      const runtime = utils.getRuntime(this);
      let toOpen;

      // when creating a plugin, use the pluginDispatcher and check for any instances
      if (this.mode === 'plugin') {
        const instances = await dispatchers.pluginDispatcher.getInstances(runtime);
        this.creating = instances.length > 0;

        if ($event && $event.detail.instance.data.description.name) {
          // force reload
          delete runtime.profile.trees[runtime.profile.treeLabels.contracts];
          toOpen = `${ $event.detail.instance.data.description.name }`;
        }
      } else {
        // when creating an container, check for createDispatcher and check only for instances with the specific digitaltwin address
        const instances = await dispatchers.createDispatcher.getInstances(runtime);
        this.creating = instances
          .filter((instance) => instance.data.digitalTwinAddress === this.digitalTwinAddress)
          .length > 0;

        if ($event && $event.detail.instance.data.contractAddress) {
          toOpen = $event.detail.instance.data.contractAddress;
        }
      }

      // if the synchronisation has finished, navigate to the new plugin / container
      if (!this.creating && beforeCreating && $event && toOpen) {
        (<any>this).evanNavigate(toOpen);
      }
    }

    watch();
    if (!this.creationWatcher) {
      this.creationWatcher = getDispatcher().watch(($event: any) => watch($event));
    }
  }

  /**
   * Shows the create modal.
   */
  showModal() {
    (<any>this).$refs.createModal.show();
    this.$nextTick(() => this.createForm.name.$ref && this.createForm.name.$ref.focus());
  }

  /**
   * Hide the create modal.
   */
  hideModal() {
    (<any>this).$refs.createModal.hide();
  }
}
