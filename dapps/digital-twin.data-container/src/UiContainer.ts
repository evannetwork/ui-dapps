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

import * as dispatchers from './dispatchers/registry';
import ContainerCache from './container-cache';
import * as dcUtils from './utils';

export const containerCache = { };
export const loadingCache = { };
export const permissionsCache = { };

/**
 * DigitalTwin Container wrapper for loading.
 */
export default class UiContainer {
  /**
   * Original vue isntance where the container should be loaded
   */
  vueInstance: any;

  /**
   * digitalTwin address, where the container should be created for
   */
  digitalTwinAddress: string;

  /**
   * Current opened container address
   */
  containerAddress: string;

  /**
   * Vue instance evan routing dapp definition
   */
  dapp: any;

  /**
   * current bcc runtime
   */
  runtime: bcc.Runtime;

  /**
   * Current container cache
   */
  containerCache: ContainerCache;

  /**
   * Is currently something loading?
   */
  loading: boolean;

  /**
   * Loading error?
   */
  error: any;

  /**
   * Loaded plugin instance
   */
  plugin: any;

  /**
   * Loaded plugins description
   */
  description: any;

  /**
   * Owner of the container
   */
  owner: string;

  /**
   * Loaded Permissions
   */
  permissions: any;

  /**
   * Initialize
   */
  constructor(vueInstance: any) {
    this.runtime = utils.getRuntime(vueInstance);
    this.vueInstance = vueInstance;
    this.dapp = vueInstance.dapp;
    this.containerCache = new ContainerCache(this.runtime.activeAccount);
    this.digitalTwinAddress = dcUtils.getDtAddressFromUrl(this.dapp);
    this.containerAddress = this.vueInstance.containerAddress || this.vueInstance.pluginName;
  }

  /**
   * Returns the plugin definition for a container or plugin.
   *
   * @param      {string}      containerAddress  container address / plugin name
   */
  async loadData(includeValue = false) {
    this.loading = true;

    const containerAddress = this.containerAddress;
    loadingCache[containerAddress] = loadingCache[containerAddress] ||
      new Promise(async (resolve, reject) => {
        let plugin;

        try {
          // check if it was already loaded before
          if (containerCache[containerAddress]) {
            plugin = containerCache[containerAddress];
          } else {
            const cached = await this.containerCache.get(containerAddress);
            const container = utils.getContainer(this.runtime, containerAddress);

            // return cached template
            if (cached) {
              plugin = cached;
            // if it's a contract, load the contract
            } else if (containerAddress.startsWith('0x')) {
              // get the container instance and load the template including all values
              plugin = await container.toPlugin(includeValue);
              // else try to laod a plugin from profile
            } else {
              plugin = await bcc.Container.getContainerPlugin(this.runtime.profile,
                containerAddress);
            }

            // load the owner
            if (!permissionsCache[containerAddress]) {
              let permissions;

              if (containerAddress.startsWith('0x')) {
                permissions = {
                  owner: await container.getOwner(),
                  permissions: await container.getContainerShareConfigForAccount(
                    this.runtime.activeAccount),
                };
              } else {
                // default permissions for plugins
                permissions = permissionsCache[containerAddress] || {
                  owner: this.runtime.activeAccount,
                  permissions: {
                    readWrite: Object.keys(plugin.template.properties)
                  },
                };
              }

              permissions.read = permissions.read || [ ];
              permissions.readWrite = permissions.readWrite || [ ];
              permissionsCache[containerAddress] = permissions;
            }
          }

          // set custom translation
          const customTranslation = { _digitaltwins: { breadcrumbs: { } } };
          customTranslation._digitaltwins.breadcrumbs[containerAddress] =
            plugin.description.name;
          this.vueInstance.$i18n.add(this.vueInstance.$i18n.locale(), customTranslation);

          // cache the latest result
          if (plugin) {
            containerCache[containerAddress] = plugin;
          }
        } catch (ex) {
          loadingCache[containerAddress] = null;
          return reject(ex);
        }

        loadingCache[containerAddress] = null;
        resolve(plugin);
      });

    try {
      this.plugin = await loadingCache[containerAddress];
    } catch (ex) {
      this.runtime.logger.log(`Could not load DataContainer detail: ${ ex.message }`, 'error');
      this.error = true;
      this.loading = false;

      return;
    }

    this.description = this.plugin.description;
    this.owner = permissionsCache[containerAddress].owner;
    this.permissions = permissionsCache[containerAddress].permissions;
    this.loading = false;

    return this.plugin;
  }

  /**
   * watch for container or plugin updates
   *
   * @param      {bccRuntime}  runtime           The runtime
   * @param      {string}      containerAddress  The container address
   */
  watchForUpdates(callback: any) {
    return this.containerCache.watch(this.containerAddress, callback);
  }

  /**
   * Is the current container / plugin in save mode?
   */
  async isSaving() {
    if (this.containerAddress.startsWith('0x')) {
      return (await dispatchers.updateDispatcher.getInstances(this.runtime))
        .filter(instance => instance.data.address === this.containerAddress)
        .length !== 0
    } else {
      return (await dispatchers.pluginDispatcher.getInstances(this.runtime))
        .filter(instance => instance.data.description.name === this.containerAddress)
        .length !== 0;
    }
  }

  /**
   * Start and return a dispatcher watcher for the current container.
   */
  async watchSaving(callback: any) {
    if (this.containerAddress.startsWith('0x')) {
      return dispatchers.updateDispatcher.watch(callback);
    } else {
      return dispatchers.pluginDispatcher.watch(callback);
    }
  }
}
