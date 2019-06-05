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

import * as dcUtils from './utils';
import * as dispatchers from './dispatchers/registry';
import ContainerCache from './container-cache';

/**
 * UI Container instances serated by addresses
 */
export const containers: any = { };

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
   * container specific data
   */
  description: any;
  savingData: Array<any>;
  isContainer: any;
  isSaving: boolean;
  isSharing: boolean;
  owner: string;
  permissions: any;
  plugin: any;
  sharingData: Array<any>;
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
    watch && uiContainer.address && (await uiContainer.runPluginUpdate(false, [ watch ]));

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
      uiContainer.dapp = JSON.parse(JSON.stringify(vueInstance.dapp));
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
   * @param      {Array<Function>}  updateWatchers  update functions
   */
  async runPluginUpdate(reload = false, updateWatchers = this.updateWatchers) {
    const savingData = await this.getSavingData();
    const sharingData = await this.getSharingData();
    const isSaving = savingData.length !== 0;
    const isSharing = sharingData.length !== 0;

    // load plugin, trigger reload, when dispatcher is finished
    await this.loadPlugin(
      reload ||
      (this.isSaving && !isSaving) ||
      (this.isSharing && !isSharing)
    );

    // update latest saving status
    this.isSaving = isSaving;
    this.isSharing = isSharing;
    this.savingData = savingData;
    this.sharingData = sharingData;

    // run all update functions
    await Promise.all(updateWatchers.map((updateFunc: Function) =>
      updateFunc(this, savingData, sharingData)
    ));
  };

  /**
   * Bind container and dispatcher update watchers for populating changes.
   */
  bindWatchers() {
    // watch for cache updates
    this.clearWatchers.push(this.containerCache.watch(this.address, () =>
      this.runPluginUpdate(true)
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
   * @param      {string}      address  container address / plugin name
   */
  async loadPlugin(reload = false) {
    if (!reload && this.plugin) {
      return this.plugin;
    }

    this.loading = true;
    this.loadingPromise = this.loadingPromise ||
      new Promise(async (resolve, reject) => {
        let plugin, permissions, owner, error;

        try {
          // check if it was already loaded before
          const savingData = await this.getSavingData();
          const cached: any = await this.containerCache.get(this.address) || {
            template: {
              properties: { }
            }
          };

          // load the original container data
          const container = utils.getContainer(this.runtime, this.address);
          if (this.isContainer) {
            // get the container instance and load the template including all values
            plugin = await container.toPlugin();
            // else try to laod a plugin from profile
          } else {
            // only work on a copy! loadForAccount is only triggered at startup, after this, the
            // same object references will be loaded
            plugin = JSON.parse(JSON.stringify(await bcc.Container.getContainerPlugin(
              this.runtime.profile,
              this.address
            )));
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

          // load the owner
          if (this.address.startsWith('0x')) {
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
    if (this.address.startsWith('0x')) {
      return (await dispatchers.shareDispatcher.getInstances(this.runtime))
        .filter(instance => instance.data.address === this.address)
        .map(instance => instance.data);
    } else {
      return (await dispatchers.pluginShareDispatcher.getInstances(this.runtime))
        .filter(instance => instance.data.description.name === this.address)
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
    const pluginCopy = JSON.parse(JSON.stringify(this.plugin));
    delete pluginCopy.template.properties[entryName];

    // reset the cache
    this.containerCache.put(this.address, pluginCopy);
  }

  /**
   * Saves latest changes.
   */
  async save() {
    // make a copy of the current plugin, so the object will not be changed within the dispatcher
    const saveCopy = JSON.parse(JSON.stringify(this.plugin));
    if (this.isContainer) {
      await dispatchers.updateDispatcher.start(this.runtime, {
        address: this.address,
        description: this.description,
        digitalTwinAddress: this.digitalTwinAddress,
        plugin: saveCopy,
      });
    } else {
      await dispatchers.pluginDispatcher.start(this.runtime, saveCopy);
    }
  }
}
