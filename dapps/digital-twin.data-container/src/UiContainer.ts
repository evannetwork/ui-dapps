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
  isContainer: any;
  owner: string;
  permissions: any;
  plugin: any;
  template: any;
  isSaving: boolean;

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
   * Initialize the ui container.
   */
  constructor(vueInstance: any, watch?: Function) {
    const address = vueInstance.address || vueInstance.pluginName;
    const uiContainer = containers[this.address] || this;

    // bind watchers, when no watcher was started before
    if (this.vueInstances.length === 0) {
      this.bindWatchers();
    }

    // apply the vue instance to the list of previous used, so data watchers can be bound and
    // removed dynamically
    watch && this.updateWatchers.push(watch);
    this.vueInstances.push(vueInstance);

    // bind custom beforeDestroy function, to clear all watch functions
    const originalDestroy = vueInstance.beforeDestroy;
    vueInstance.beforeDestroy = (() => {
      watch && this.updateWatchers.splice(this.updateWatchers.indexOf(watch), 1);
      this.vueInstances.splice(this.vueInstances.indexOf(vueInstance), 1);

      // remove all listeners, when the ui container is not bound to a vue instance
      if (this.vueInstances.length === 0) {
        this.clearWatchers.forEach(watcher => watcher());
      }

      // call original beforeDestroy
      originalDestroy();
    }).bind(this);

    if (containers[this.address]) {
      return containers[this.address];
    } else {
      uiContainer.address = address;
      uiContainer.runtime = utils.getRuntime(vueInstance);
      uiContainer.dapp = JSON.parse(JSON.stringify(vueInstance.dapp));
      uiContainer.containerCache = new ContainerCache(this.runtime.activeAccount);
      uiContainer.digitalTwinAddress = dcUtils.getDtAddressFromUrl(this.dapp);
      uiContainer.$i18n = vueInstance.$i18n;
      uiContainer.isContainer = this.address.startsWith('0x');

      // cache it for later usage
      containers[this.address] = this;

      return this;
    }
  }

  /**
   * loads the latest data and calls the callback
   *
   * @return     {bcc.ContainerPlugin}  container plugin instance
   */
  async runPluginUpdate() {
    const isSaving = await this.isDispatcherRunning();

    // load plugin, trigger reload, when dispatcher is finished
    const plugin = await this.loadPlugin(this.isSaving && !isSaving);

    // update latest saving status
    this.isSaving = isSaving;

    // run all update functions
    this.updateWatchers.forEach((updateFunc: Function) =>
      updateFunc(plugin, isSaving)
    );
  };

  /**
   * Bind container and dispatcher update watchers for populating changes.
   */
  bindWatchers() {
    // watch for updates
    this.clearWatchers.push(this.containerCache.watch(this.address, () => this.runPluginUpdate()));
    this.clearWatchers.push(this.isContainer ?
      dispatchers.updateDispatcher.watch(() => this.runPluginUpdate()) :
      dispatchers.pluginDispatcher.watch(() => this.runPluginUpdate())
    );

    this.runPluginUpdate();
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
        let plugin, permissions;

        try {
          // check if it was already loaded before
          const cached = await this.containerCache.get(this.address);
          const container = utils.getContainer(this.runtime, this.address);

          if (this.isContainer) {
            // get the container instance and load the template including all values
            plugin = await container.toPlugin();
            // else try to laod a plugin from profile
          } else {
            plugin = await bcc.Container.getContainerPlugin(
              this.runtime.profile,
              this.address
            );
          }

          // merged cached values with the correct loaded one
          if (cached) {
            const properties = cached.template.properties;

            Object.keys(properties).forEach((property) => {
              if (properties[property].changed || properties[property].isNew) {
                plugin.template.properties[property] = properties[property];
              }
            });
          }

          // load the owner
          if (this.address.startsWith('0x')) {
            permissions = {
              owner: await container.getOwner(),
              permissions: await container.getContainerShareConfigForAccount(
                this.runtime.activeAccount),
            };
          } else {
            // default permissions for plugins
            permissions = {
              owner: this.runtime.activeAccount,
              permissions: {
                readWrite: Object.keys(plugin.template.properties)
              },
            };
          }

          permissions.read = permissions.read || [ ];
          permissions.readWrite = permissions.readWrite || [ ];

          // set custom translation
          const customTranslation = { _digitaltwins: { breadcrumbs: { } } };
          customTranslation._digitaltwins.breadcrumbs[this.address] =
            plugin.description.name;
          this.$i18n.add(this.$i18n.locale(), customTranslation);
        } catch (ex) {
          return reject(ex);
        }

        resolve({ permissions,  plugin, });
      });

    try {
      const { plugin, permissions } = await this.loadingPromise[this.address];

      this.plugin = plugin;
      this.permissions = permissions;
      this.owner = permissions.owner;
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
  async isDispatcherRunning() {
    if (this.address.startsWith('0x')) {
      return (await dispatchers.updateDispatcher.getInstances(this.runtime))
        .filter(instance => instance.data.address === this.address)
        .length !== 0
    } else {
      return (await dispatchers.pluginDispatcher.getInstances(this.runtime))
        .filter(instance => instance.data.description.name === this.address)
        .length !== 0;
    }
  }
}
