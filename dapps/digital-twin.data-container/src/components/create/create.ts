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
   * digitalTwin address, where the container should be created for
   */
  @Prop() digitalTwinAddress;

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
  plugins: Array<any> = [ ];

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
   * array for importing exported json plugins
   */
  importPlugins: Array<any> = [ ];
  importPluginError = false;

  /**
   * Setup the form.
   */
  async created() {
    this.$emit('init', this);

    const runtime = utils.getRuntime(this);
    this.hideBreadcrumbs = document.querySelectorAll('.evan-navigation-tabs').length > 0;

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
      imgSquare: {
        value: ''
      },
    }));

    if (this.mode === 'plugin') {
      this.plugins.push({
        description: {
          name: (<any>this).$i18n.translate('_datacontainer.createForm.base-plugin'),
          description: '',
        },
        template: {
          type: 'metadata',
          properties: { },
        }
      });
    }

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
            this.activatePlugin(this.plugins[i], false);

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
        this.activatePlugin(this.plugins[this.plugins.length - 1], false);
      }
    }

    this.loading = false;
    this.watchForCreation();
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
          name: this.createForm.name.value.trim().replace(/\s{2,}/g, ' '),
        },
        template: this.activePlugin.template,
      });
    } else {
      dispatchers.createDispatcher.start(runtime, {
        digitalTwinAddress: this.digitalTwinAddress,
        description: {
          description: this.createForm.description.value,
          imgSquare: this.createForm.imgSquare.value,
          name: this.createForm.name.value.trim().replace(/\s{2,}/g, ' '),
        },
        plugin: this.activePlugin,
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

    // save previous enabled states
    const enabledStates = { };
    this.steps.forEach(step => enabledStates[step.entryName] = step.enabled);

    // reset steps
    this.$set(this, 'steps', [ ]);

    this.steps.push({
      title: '_datacontainer.createForm.general',
      disabled: () => false
    });

    // apply the new active plugin entries as new steps
    const customTranslation = { };
    Object.keys(plugin.template.properties).forEach((entryName: string) => {
      const entry = plugin.template.properties[entryName];
      const type = fieldUtils.getType(entry.dataSchema);

      // do not add list configurations to create in container mode, in container mode, only value
      // view is editable
      if (this.mode !== 'plugin' && type === 'array') {
        return;
      }

      // add the steps
      const title = `_datacontainer.breadcrumbs.${ entryName }`;
      const step: any = {
        title,
        enabled: enabledStates[entryName],
        entryName,
        entryType: type,
        disabled: (index: number) => {
          const activeEntryComp = this.steps[this.activeStep].entryComp;
          const activeValid = activeEntryComp && activeEntryComp.isValid();
          const isEnabled =
            index < this.activeStep ||
            (
              // active entry must be valid
              activeValid &&
              // and previous one is enable or previous one is the active step and active is valid
              (
                this.steps[index - 1].enabled ||
                index - 1 === this.activeStep && activeValid
              )
            );

          return !isEnabled;
        }
      };

      if (step.entryType === 'array') {
        step.itemType = fieldUtils.getType(entry.dataSchema.items);
      }

      // apply step to the steps array
      this.steps.push(step);

      // add custom translation
      customTranslation[title] = entryName;

      /**
       * Takes an entry and checks for type array. If it's an array, ensure, that the value array
       * and an addValue object is added. Per default, this values are not returned by the API,
       * templates does not support list entries export and must be load dynamically. The value
       * array is used to handle new arrays, that will be persisted for caching to the indexeddb
       * like the normal entries
       */
      entryUtils.ensureValues('create', plugin.template.properties[entryName]);
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
        }, 3e3);
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

    utils.enableDTSave();
    this.activatePlugin(this.activePlugin, false);

    this.loading = true;
    this.$nextTick(() => this.loading = false);
  }

  /**
   * Activates a specific step.
   *
   * @param      {number}  stepIndex  step index to activate
   */
  activateStep(stepIndex: number) {
    this.saveActiveStep();

    // navigate to next step.
    const activeEntryComp = this.steps[this.activeStep].entryComp;
    if (activeEntryComp.isValid()) {
      this.steps[this.activeStep].enabled = true;
    }

    // reset entry components
    this.activeStep = stepIndex;
  }

  /**
   * Saves current changes and navigates to next step.
   */
  nextStep() {
    // if we are on the last step, ask to finish creation
    if (this.steps.length === 0 || this.activeStep === (this.steps.length - 1)) {
      this.saveActiveStep();
      (<any>this.$refs.createModalSubmit).show();
    } else {
      // navigate to next step.
      this.activateStep(this.activeStep + 1);
    }
  }

  /**
   * Save latest step entry edit values.
   */
  saveActiveStep() {
    // do not trigger save for dbcp, will trigger endless loop
    if (this.activeStep !== 0) {
      if (this.steps[this.activeStep] && this.steps[this.activeStep].entryComp) {
        this.steps[this.activeStep].entryComp.save();
      }
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
      const dapp: any = (<any>this).dapp;

      // when creating a plugin, use the pluginDispatcher and check for any instances
      if (this.mode === 'plugin') {
        const instances = await dispatchers.pluginDispatcher.getInstances(runtime);
        this.creating = instances.length > 0;

        if ($event && $event.detail.instance.data.description.name) {
          const pluginName = $event.detail.instance.data.description.name;

          // if the synchronisation has finished, navigate to the new plugin / container
          if (!this.creating && beforeCreating) {
            try {
              // force reload and try to load the plugin, if it could be load, navigate to the plugin
              delete runtime.profile.trees[runtime.profile.treeLabels.contracts];
              const plugin = await bcc.Container.getContainerPlugin(runtime.profile, pluginName);

              if (plugin) {
                window.location.hash = [
                  dapp.rootEns,
                  `digitaltwins.${ dapp.domainName }`,
                  `datacontainer.digitaltwin.${ dapp.domainName }`,
                  pluginName
                ].join('/');
              }
            } catch (ex) {
              console.log(ex);
              // plugin creation was cancled or failed
            }
          }
        }
      } else {
        // when creating an container, check for createDispatcher and check only for instances with
        // the specific digitaltwin address
        const instances = await dispatchers.createDispatcher.getInstances(runtime);
        this.creating = instances
          .filter((instance) => instance.data.digitalTwinAddress === this.digitalTwinAddress)
          .length > 0;

        // if the synchronisation has finished, navigate to the new plugin / container
        if (!this.creating && beforeCreating && $event && $event.detail.instance.data.contractAddress) {
          // base navigation url
          let urlToOpen = [
            dapp.rootEns,
            `digitaltwins.${ dapp.domainName }`,
          ];

          // navigate relative to digitaltwin address
          if (this.digitalTwinAddress) {
            urlToOpen = urlToOpen.concat([
              `digitaltwin.${ dapp.domainName }`,
              this.digitalTwinAddress
            ]);
          }

          // open datacontainer directly
          urlToOpen = urlToOpen.concat([
            `datacontainer.digitaltwin.${ dapp.domainName }`,
            $event.detail.instance.data.contractAddress
          ]);

          // open built url
          window.location.hash = urlToOpen.join('/');
        }
      }
    }

    watch();
    if (!this.creationWatcher) {
      this.creationWatcher = getDispatcher().watch(($event: any) => watch($event));
    }
  }

  /**
   * Shows the create modal.
   *
   * @param      {any}  clonePlugin  plugin object to clone from
   */
  showModal(clonePlugin?: any) {
    if (clonePlugin) {
      this.plugins.unshift(clonePlugin);
      this.activatePlugin(clonePlugin);
    }

    (<any>this).$refs.createModal.show();
    this.$nextTick(() => this.createForm.name.$ref && this.createForm.name.$ref.focus());
  }

  /**
   * Hide the create modal.
   */
  hideModal() {
    (<any>this).$refs.createModal.hide();
  }

  /**
   * Take a exported plugin and parse the file.
   */
  async importPlugin() {
    // transform result to json
    const fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        const plugin = JSON.parse(<string>fileReader.result);

        // if invalid plugin, throw an error
        if (!plugin || !plugin.description || !plugin.template) {
          throw new Error('Invalid plugin!');
        } else {
          // else add it as valid plugin
          this.plugins.push(plugin);
        }
      } catch (ex) {
        this.importPluginError = true;
      }
    };
    fileReader.readAsText(this.importPlugins[0].blob);

    // reset import plugins
    this.importPlugins = [ ];
  }
}
