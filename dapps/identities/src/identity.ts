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
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import { getIdentityBaseDbcp, getLastOpenedIdentities, latestIdentitiesKey } from './utils';
import * as dispatchers from './dispatchers/registy';

/**
 * Represents the UI representation for a evan.network. Handles data management and so on.
 *
 * @class      EvanUIIdentity
 */
export default class EvanUIIdentity {
  /**
   * dbcp description of the identity (initially the most smallest subset of data)
   */
  dbcp: any;

  /**
   * current contract address
   */
  address: string;

  /**
   * bcc.DigitalIdentity.isValidDigitalIdentity result
   */
  validity: any;

  /**
   * Digital identity left navigation entries
   */
  navigation: Array<any>;

  /**
   * List of data containers.
   */
  containers: Array<any> = [ ];

  /**
   * watch for dispatcher updates
   */
  dispatcherListeners: Array<Function> = [ ];

  /**
   * is the identity currently loading?
   */
  loading = true;

  /**
   * creation is in progress
   */
  isCreating = false;

  /**
   * Was the identity adjusted and a save is needed?
   */
  dirty = false;

  /**
   * is this identity is a favorite?
   */
  isFavorite = false;
  isFavoriteLoading = false;

  /**
   * Return the default identity config.
   */
  static getIdentityConfig(runtime: bcc.Runtime, address: string, dbcp?: any) {
    return {
      accountId: runtime.activeAccount,
      address: address,
      containerConfig: { accountId: runtime.activeAccount, },
      description: dbcp,
      factoryAddress: '0xE8aB5213BDD998FB39Ed41352a7c84a6898C288a',
    }
  }

  constructor(address: string) {
    this.address = address;

    // set initial navigation
    this.navigation = [
      {
        name: 'identity-details',
        active: true,
        children: [
          { name: 'general', path: address, i18n: true },
          { name: 'verifications', path: `${ address }/verifications`, i18n: true }
        ]
      },
      {
        name: 'containers',
        active: false,
        children: [ ]
      }
    ];

    // apply this identity address to the last opened identities
    const lastIdentities = getLastOpenedIdentities();
    const existingIndex = lastIdentities.indexOf(address);
    if (existingIndex !== -1) {
      lastIdentities.splice(existingIndex, 1);
    }
    lastIdentities.unshift(address);
    // only save the latest 20 entries
    window.localStorage[latestIdentitiesKey] = JSON.stringify(lastIdentities.slice(0, 20));
  }

  /**
   * Return the DigitalIdentity instance for the current class instancew.
   *
   * @param      {bccRuntime}  runtime  The runtime
   */
  getIdentityInstance(runtime: bcc.Runtime) {
    return new bcc.DigitalIdentity(
      <any>runtime,
      EvanUIIdentity.getIdentityConfig(runtime, this.address)
    );
  }

  /**
   * Load the initial data for the digital identity
   */
  async initialize(vueInstance: any, runtime: bcc.Runtime) {
    this.loading = true;

    // clear all previous watchers
    this.dispatcherListeners.forEach((listener) => listener());
    this.dispatcherListeners = [ ];

    // if we are not loading the create components, show the details.
    this.validity = await bcc.DigitalIdentity.getValidity((<any>runtime), this.address);

    if (this.validity.exists) {
      const identity = this.getIdentityInstance(runtime);

      this.dbcp = await identity.getDescription();
      this.isFavorite = await identity.isFavorite();

      // check for is favorite updates
      this.isFavoriteLoading = await this.getFavoriteLoading(runtime);
      this.isFavoriteLoading && this.watchFavoriteLoading(runtime);
    } else {
      this.dbcp = await getIdentityBaseDbcp();
      // set default dbcp name
      this.dbcp.name = this.address;

      // check for running dispatchers
      this.setIsCreating(vueInstance, runtime);
      this.dispatcherListeners.push(dispatchers.identityCreateDispatcher
        .watch(() => this.setIsCreating(vueInstance, runtime)));
    }

    this.setNameTranslations(vueInstance);
    this.loading = false;
  }

  /**
   * Set the translation for the current dbcp name, so the breadcrumbs will be displayed correctly.
   */
  setNameTranslations(vueInstance: any): void {
    const customTranslation = { };
    const i18n = vueInstance.$i18n;

    customTranslation[ `_identities.breadcrumbs.${ this.address }`] = this.dbcp.name;

    i18n.add(i18n.locale(), customTranslation);
  }

  /**
   * Check if the current identity with the specific address is in creation
   */
   async setIsCreating(vueInstance: any, runtime: bcc.Runtime): Promise<void> {
    const instances = await dispatchers.identityCreateDispatcher.getInstances(runtime);
    const wasCreating = this.isCreating;

    // is currently an identity for this address is in creation?
    this.isCreating = Object.keys(instances)
      .filter(id => instances[id].data.address).length !== 0;

    if (!this.isCreating && wasCreating) {
      await this.initialize(vueInstance, runtime);
    }
  }

  /**
   * Stops all dispatcher listeners and kill the vue store instance, if it's set
   *
   * @param      {any}  vueInstance  a vue instance
   */
  destroy(vueInstance?: Vue): void {
    if (vueInstance) {
      vueInstance.$store.state.uiIdentity = null;
    }

    this.dispatcherListeners.forEach((listener: Function) => listener());
  }

  /**
   * Sets a data property and makes the identity dirty.
   *
   * @param      {string}  key     nested key (e.g. dbcp.name)
   * @param      {any}     value   value that should be set
   */
  setData(key: string, value: any): void {
    const splitKey = key.split('.');
    const paramKey = splitKey.pop();
    let parentDataObj = this;

    // find the correct nested obj
    splitKey.forEach((parentKey: string) => parentDataObj = parentDataObj[parentKey]);

    // make it only dirty, when the value has changed
    if (parentDataObj[paramKey] !== value) {
      parentDataObj[paramKey] = value;

      // make the identity dirty
      this.dirty = true;
    }
  }

  /**
   * Toggle the current dispatcher state
   */
  async toggleFavorite(runtime) {
    const dispatcherName = this.isFavorite ? 'favoriteRemoveDispatcher' : 'favoriteAddDispatcher';

    // start the dispatcher
    dispatchers[dispatcherName].start(runtime, { address: this.address });

    // toggle favorite
    this.isFavorite = !this.isFavorite;

    // only watch, when it wasn't watched before
    if (!this.isFavoriteLoading) {
      this.isFavoriteLoading = true;
      this.watchFavoriteLoading(runtime);
    }
  }

  /**
   * Check if currently an synchronisation is running for the favorites.
   */
  async getFavoriteLoading(runtime: bcc.Runtime) {
    const add = await dispatchers['favoriteAddDispatcher'].getInstances(runtime);
    const remove = await dispatchers['favoriteRemoveDispatcher'].getInstances(runtime);

    return [ ]
      .concat(Object.keys(add), Object.keys(remove))
      // filter for the current identity
      .filter((instanceKey) => {
        const instance = add[instanceKey] || remove[instanceKey];
        return instance.data.address === this.address;
      })
      .length > 0;
  }

  /**
   * Watch for favorite loading updates
   *
   * @param      {bccRuntime}  runtime  The runtime
   */
  watchFavoriteLoading(runtime: bcc.Runtime) {
    const watch = async () => {
      this.isFavoriteLoading = await this.getFavoriteLoading(runtime);

      // clear the watchers, when the synchronization has finished
      if (!this.isFavoriteLoading) {
        addListener(); removeListener();
        this.dispatcherListeners.splice(this.dispatcherListeners.indexOf(addListener, 1));
        this.dispatcherListeners.splice(this.dispatcherListeners.indexOf(removeListener, 1));
      }
    }

    // watch for updates
    const addListener = dispatchers['favoriteAddDispatcher'].watch(watch);
    const removeListener = dispatchers['favoriteRemoveDispatcher'].watch(watch);
    this.dispatcherListeners.push(addListener);
    this.dispatcherListeners.push(removeListener);
  }
}
