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
import { Dispatcher, DispatcherInstance, cloneDeep } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { utils } from '@evan.network/digitaltwin.lib';

import * as dcUtils from './utils';
import * as dispatchers from './dispatchers/registry';
import ContainerCache from './container-cache';

/**
 * UI Container instances serated by addresses
 */
export const containers: any = { };

/**
 * Share configs for containers
 */
export const shareConfigs: any = { };

/**
 * DigitalTwin Container wrapper for loading.
 */
export default class UiContainer {
  /**
   * digital twin and container address
   */
  digitalTwinAddress: string;
  address: string;

  /**
   * Vue instance evan routing dapp definition
   */
  dapp: any;
  $i18n: any;

  /**
   * Status params
   */
  error: any;
  loading: boolean;
  loadingPromise: any;

  /**
   * util for interaction with containers
   */
  runtime: bcc.Runtime;
  containerCache: ContainerCache;

  /**
   * dispatcher infos
   */
  deletingData: Array<any>;
  isContainer: boolean;
  isDeleting: boolean;
  isSaving: boolean;
  isSharing: boolean;
  savingData: Array<any>;
  sharingData: Array<any>;
  savingEntries: Array<any>;

  /**
   * container specific data
   */
  description: any;
  owner: string;
  permissions: any;
  // plugin origin, nothing was changed
  pluginOrigin: any;
  // plugin definition including cached and dispatcher data
  plugin: any;
  template: any;

  /**
   * Vue instances that were applied to this ui container
   */
  vueInstances: Array<any> = [ ];

  /**
   * List of functions to clear active data watching functions
   */
  clearWatchers: Array<any> = [ ];
  updateWatchers: Array<any> = [ ];

  /**
   * Return new UiContainer without using new flag for using easy usable watch logic
   *
   * @param      {any}       vueInstance  vue instance for getting $i18n, runtime, dapp, ...
   * @param      {Function}  watch        optional watching function, is called with the following
   *                                      params (uiContainer, savingDispatcherData,
   *                                      sharingDispatcherData)
   */
  static async watch(vueInstance: any, watch: Function) {
    const uiContainer = new UiContainer(vueInstance, watch);

    // run plugin update only for this watch function
    watch && uiContainer.address && (await uiContainer.runPluginUpdate(false, false, [ watch ]));

    return uiContainer;
  }

  /**
   * Initialize the ui container.
   */
  constructor(vueInstance: any, watch?: Function) {
    const address = vueInstance.containerAddress || vueInstance.pluginName;
    const uiContainer = containers[address] || this;

    if (!address) {
      throw new Error('No container address applied!');
    }

    if (!uiContainer.address) {
      // cache it for later usage
      containers[address] = this;

      uiContainer.address = address;
      uiContainer.runtime = utils.getRuntime(vueInstance);
      uiContainer.dapp = cloneDeep(bcc.lodash, vueInstance.dapp, true);
      uiContainer.containerCache = new ContainerCache(uiContainer.runtime.activeAccount);
      uiContainer.digitalTwinAddress = dcUtils.getDtAddressFromUrl(uiContainer.dapp);
      uiContainer.$i18n = vueInstance.$i18n;
      uiContainer.isContainer = uiContainer.address && uiContainer.address.startsWith('0x');
    }

    // bind watchers, when no watcher was started before
    if (uiContainer.vueInstances.length === 0) {
      uiContainer.bindWatchers();
    }

    // apply the vue instance to the list of previous used, so data watchers can be bound and
    // removed dynamically
    watch && uiContainer.updateWatchers.push(watch);
    uiContainer.vueInstances.push(vueInstance);

    // bind custom beforeDestroy function, to clear all watch functions
    vueInstance.$once('hook:beforeDestroy', () => {
      watch && uiContainer.updateWatchers.splice(uiContainer.updateWatchers.indexOf(watch), 1);
      uiContainer.vueInstances.splice(uiContainer.vueInstances.indexOf(vueInstance), 1);

      // remove all listeners, when the ui container is not bound to a vue instance
      if (uiContainer.vueInstances.length === 0) {
        uiContainer.clearWatchers.forEach(watcher => watcher());
      }
    });

    return uiContainer;
  }

  /**
   * loads the latest data and calls the callback
   *
   * @param      {boolean}          reload          force updateFunc data reload
   * @param      {boolean}          cacheChange     cache has changed, so recalculate original
   *                                                plugin with cached values
   * @param      {Array<Function>}  updateWatchers  update functions
   */
  async runPluginUpdate(
    reload = false,
    cacheChange = false,
    updateWatchers = this.updateWatchers
  ) {
    const [ deletingData, savingData, sharingData ] = await Promise.all([
      this.getDeleteData(),
      this.getSavingData(),
      this.getSharingData(),
    ]);
    const isDeleting = deletingData.length !== 0;
    const isSaving = savingData.length !== 0;
    const isSharing = sharingData.length !== 0;

    // load plugin, trigger reload, when dispatcher is finished
    await this.loadPlugin(
      reload ||
      (this.isSaving && !isSaving) ||
      (this.isSharing && !isSharing),
      cacheChange
    );

    // if sharing has finished, clear the permission cache
    if (this.isSharing && !isSharing) {
      delete shareConfigs[this.address];
    }

    // update latest saving status
    this.isSaving = isSaving;
    this.isSharing = isSharing;
    this.isDeleting = isDeleting;
    this.savingData = savingData;
    this.sharingData = sharingData;
    this.deletingData = deletingData;

    if (isSaving) {
      // in container, show saving symbol only for these entries, that are. in save process
      if (this.isContainer) {
        this.savingEntries = [ ].concat(
          ...(savingData
            .filter(data => data.plugin && data.address === this.address)
            .map(data => data.entriesToSave)
          ))
      // for templates show save symbol everywhere
      } else {
        this.savingEntries = Object.keys(this.template.properties);
      }
    } else {
      this.savingEntries = [ ];
    }

    // run all update functions
    await this.triggerUpdateFunctions(updateWatchers, reload, cacheChange);
  };

  /**
   * Run all update functions.
   *
   * @param      {Array<Function>}  updateWatchers  update functions
   * @param      {boolean}          reload          suggest reload of the component
   * @param      {boolean}          cacheChange     chache was changed, reload ui
   */
  async triggerUpdateFunctions(
    updateWatchers = this.updateWatchers,
    reload = false,
    cacheChange = false
  ) {
    await Promise.all(updateWatchers.map((updateFunc: Function) =>
      updateFunc(this, this.savingData, this.sharingData, reload, cacheChange)
    ));
  }

  /**
   * Bind container and dispatcher update watchers for populating changes.
   */
  bindWatchers() {
    // watch for cache updates
    this.clearWatchers.push(this.containerCache.watch(this.address, async (event: any) =>
      this.runPluginUpdate(false, true)
    ));
    // watch for save updates
    this.clearWatchers.push(this.isContainer ?
      dispatchers.updateDispatcher.watch(() => this.runPluginUpdate()) :
      dispatchers.pluginDispatcher.watch(() => this.runPluginUpdate())
    );
    // watch for sharing updates
    this.clearWatchers.push(this.isContainer ?
      dispatchers.shareDispatcher.watch(() => this.runPluginUpdate()) :
      dispatchers.pluginShareDispatcher.watch(() => this.runPluginUpdate())
    );
  }

  /**
   * Returns the plugin definition for a container or plugin.
   *
   * @param      {boolean}  reload      force plugin reload
   * @param      {boolean}  resetCache  use original plugin and apply latest cached changes
   */
  async loadPlugin(reload = false, resetCache = false) {
    // set reload param, so the following logic can work only on this flag
    if (!this.plugin) {
      reload = true;
    } else if (!reload && !resetCache) {
      return this.plugin;
    }

    this.loading = true;
    this.loadingPromise = this.loadingPromise ||
      new Promise(async (resolve, reject) => {
        let plugin, permissions, owner, error;

        try {
          // load dispatcher and cache data, so it can be merged with the plugin definition
          const savingData = await this.getSavingData();
          const cached: any = await this.containerCache.get(this.address) || {
            template: {
              properties: { }
            }
          };

          // load the original container data
          const container = utils.getContainer(this.runtime, this.address);

          // if the plugin should be reloaded, force reload, else use original plugin without hard reloading
          if (reload) {
            if (this.isContainer) {
              // get the container instance and load the template including all values
              plugin = await container.toPlugin();
              // else try to laod a plugin from profile
            } else {
              // only work on a copy! loadForAccount is only triggered at startup, after this, the
              // same object references will be loaded
              plugin = cloneDeep(
                bcc.lodash,
                await bcc.Container.getContainerPlugin(
                  this.runtime.profile,
                  this.address
                ),
                true
              );
            }

            // set plugin origin, so cache changes can be applied faster in futurer
            this.pluginOrigin = cloneDeep(bcc.lodash, plugin, true);
          } else {
            plugin = cloneDeep(bcc.lodash, this.pluginOrigin, true);
          }

          // merge container cache with dispatcher data
          savingData.forEach(data => {
            if (data.template) {
              cached.template.properties = Object.assign(
                cached.template.properties,
                data.template.properties
              );
            }

            if (data.description) {
              plugin.description = data.description;
            }
          });

          // merged cached values with the correct loaded one
          const properties = cached.template.properties;
          Object.keys(properties).forEach((property) => {
            if (properties[property].changed || properties[property].isNew) {
              plugin.template.properties[property] = properties[property];
            }
          });

          // for initial load or reload, load latest permission definitions
          if (reload) {
            // load the owner
            if (this.isContainer) {
              owner = await container.getOwner();
              permissions = await container.getContainerShareConfigForAccount(
                this.runtime.activeAccount);
            } else {
              owner = this.runtime.activeAccount;
              permissions = Object.keys(plugin.template.properties)
            }

            permissions.read = permissions.read || [ ];
            permissions.readWrite = permissions.readWrite || [ ];

            // set custom translation
            const customTranslation = { _digitaltwins: { breadcrumbs: { } } };
            customTranslation._digitaltwins.breadcrumbs[this.address] =
              plugin.description.name;
            this.$i18n.add(this.$i18n.locale(), customTranslation);
          } else {
            owner = this.owner;
            permissions = this.permissions;
          }
        } catch (ex) {
          error = ex;
        }

        // finish the promise
        if (error) {
          reject(error);
        } else {
          resolve({ permissions, plugin, owner, });
        }

        // reset the loading promise
        this.loadingPromise = null;
      });

    try {
      const { plugin, permissions, owner } = await this.loadingPromise;

      this.plugin = plugin;
      this.plugin.permissions = this.permissions;
      this.permissions = permissions;
      this.owner = owner;
      this.description = this.plugin.description;
      this.template = this.plugin.template;
    } catch (ex) {
      this.runtime.logger.log(`Could not load DataContainer detail: ${ ex.message }`, 'error');
      this.error = ex.message;
      this.loading = false;

      this.plugin = null;
      this.permissions = null;
      this.owner = null;
      this.description = null;
      this.template = null;

      return;
    }

    this.loading = false;
    return this.plugin;
  }

  /**
   * Is currently a dispatcher running for this container / plugin?
   */
  async getSavingData() {
    if (this.isContainer) {
      return (await dispatchers.updateDispatcher.getInstances(this.runtime))
        .filter(instance => instance.data.address === this.address)
        .map(instance => instance.data);
    } else {
      return (await dispatchers.pluginDispatcher.getInstances(this.runtime))
        .filter(instance => instance.data.description.name === this.address)
        .map(instance => instance.data);
    }
  }

  /**
   * Is currently a dispatcher running for this container / plugin?
   */
  async getSharingData() {
    if (this.isContainer) {
      return (await dispatchers.shareDispatcher.getInstances(this.runtime))
        .filter(instance => instance.data.address === this.address)
        .map(instance => instance.data);
    } else {
      return (await dispatchers.pluginShareDispatcher.getInstances(this.runtime))
        .filter(instance => instance.data.address === this.address)
        .map(instance => instance.data);
    }
  }

  /**
   * Is currently a dispatcher running for this container / plugin?
   */
  async getDeleteData() {
    if (this.isContainer) {
      return [ ];
    } else {
      return (await dispatchers.pluginRemoveDispatcher.getInstances(this.runtime))
        // .filter(instance => instance.data.name === this.address)
        .map(instance => instance.data);
    }
  }

  /**
   * Clear the indexedDb cache for this container.
   */
  async clearCache() {
    await this.containerCache.delete(this.address);
  }

  /**
   * Resets last changes of a property.
   *
   * @param      {string}  entryName  entry name that should be resetted
   */
  async resetEntry(entryName: string) {
    // do not delete the original one, only clear it within a copy and set the cache
    const pluginCopy = cloneDeep(bcc.lodash, this.plugin, true);
    delete pluginCopy.template.properties[entryName];

    // reset the cache
    this.containerCache.put(this.address, pluginCopy);
  }

  /**
   * Saves latest changes.
   *
   * @param      {boolean}      saveDescription  should the description
   * @param      {Arraystring}  entriesToSave    list of entries that should be saved
   */
  async save(saveDescription: boolean, entriesToSave: Array<string>) {
    // apply it directly, so each component will be updated
    this.isSaving = true;
    this.savingEntries = this.savingEntries.concat(entriesToSave);

    // run all update functions
    await this.triggerUpdateFunctions();

    if (this.isContainer) {
      await dispatchers.updateDispatcher.start(this.runtime, {
        address: this.address,
        description: this.description,
        digitalTwinAddress: this.digitalTwinAddress,
        entriesToSave,
        plugin: { ...this.plugin },
        saveDescription,
      });
    } else {
      await dispatchers.pluginDispatcher.start(this.runtime, {
        ...this.plugin,
        beforeName: this.address,
        entriesToSave,
      });
    }
  }

  /**
   * Return cached container share configs.
   */
  async getContainerShareConfigs() {
    if (!shareConfigs[this.address]) {
      shareConfigs[this.address] = (utils.getContainer(this.runtime, this.address))
        .getContainerShareConfigs();
    }

    return await shareConfigs[this.address];
  }
}
