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

import { getIdentityBaseDbcp, getLastOpenedIdentities, latestIdentitiesKey, getRuntime } from './utils';
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
  dirtyObjects = [ ];

  /**
   * is this identity is a favorite?
   */
  isFavorite = false;
  isFavoriteLoading = false;

  /**
   * show loading, when save process is running
   */
  isSaving = false;

  /**
   * Return the default identity config.
   */
  static getIdentityConfig(
    runtime: bcc.Runtime,
    address: string,
    dbcp?: any
  ): bcc.DigitalIdentityConfig {
    return {
      accountId: runtime.activeAccount,
      address: address,
      containerConfig: { accountId: runtime.activeAccount, },
      description: dbcp,
      factoryAddress: '0xE8aB5213BDD998FB39Ed41352a7c84a6898C288a',
    }
  }

  /**
   * Use the default identity config and return a new digital identity instance.
   */
  static getDigitalIdentity(runtime: bcc.Runtime, address: string): bcc.DigitalIdentity {
    return new bcc.DigitalIdentity(
      <any>getRuntime(runtime),
      EvanUIIdentity.getIdentityConfig(runtime, address)
    );
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
   * Returns a saving object, if the current identity is updating.
   *
   * @param      {bccRuntime}  runtime  bcc runtime
   */
  async getSaving(runtime: bcc.Runtime): Promise<any> {
    const instances = await dispatchers.identitySaveDispatcher.getInstances(runtime);

    // filter instances for this address
    const instanceKeys = Object
      .keys(instances)
      .filter(instanceKey => instances[instanceKey].data.address === this.address);

    if (instanceKeys.length > 0) {
      return instances[instanceKeys[0]].data;
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
   * Load the initial data for the digital identity
   *
   * @param      {any}         vueInstance  a vue component instance
   * @param      {bccRuntime}  runtime      bcc runtime
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
      // load saving data from dbcp, so we can hot load data from their
      const savingObj = await this.getSaving(runtime);

      this.dbcp = savingObj && savingObj.dbcp ? savingObj.dbcp : await identity.getDescription();
      this.isFavorite = await identity.isFavorite();

      // check, if any updates are running
      this.isFavoriteLoading = await this.getFavoriteLoading(runtime);
      this.isFavoriteLoading && this.watchFavoriteLoading(runtime);
      this.isSaving = !!savingObj;
      this.isSaving && this.watchSaving(vueInstance, runtime);
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
   * Checks for changes and triggers the save dispatcher
   *
   * @param      {Vue}         vueInstance  a vue component instance
   * @param      {bccRuntime}  runtime      bcc runtime
   */
  saveChanges(vueInstance: Vue, runtime: bcc.Runtime) {
    if (this.dirty) {
      // lookup dirty objects and pass them into the save object
      const dataToSave = { address: this.address };
      this.dirtyObjects.forEach((key) => dataToSave[key] = this[key]);

      // start the dispatcher and watch for updates
      this.isSaving = true;
      dispatchers.identitySaveDispatcher.start(runtime, dataToSave);
      this.watchSaving(vueInstance, runtime);
    }
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

      if (this.dirtyObjects.indexOf(splitKey[0]) === -1) {
        this.dirtyObjects.push(splitKey[0]);
      }

      // make the identity dirty
      this.dirty = true;
    }
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
   * Set the translation for the current dbcp name, so the breadcrumbs will be displayed correctly.
   *
   * @param      {any}         vueInstance  a vue component instance
   */
  setNameTranslations(vueInstance: any): void {
    const customTranslation = { };
    const i18n = vueInstance.$i18n;

    customTranslation[ `_identities.breadcrumbs.${ this.address }`] = this.dbcp.name;

    i18n.add(i18n.locale(), customTranslation);
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

  /**
   * Watch for updates, when the contract is saving
   *
   * @param      {any}         vueInstance  a vue component instance
   * @param      {bccRuntime}  runtime      bcc runtime
   */
  async watchSaving(vueInstance: Vue, runtime: bcc.Runtime): Promise<void> {
    const listener = await dispatchers.identitySaveDispatcher.watch(async () => {
      this.isSaving = await this.getSaving(runtime);

      if (!this.isSaving) {
        listener();
        this.dispatcherListeners.splice(this.dispatcherListeners.indexOf(listener, 1));
        this.dirty = false;
        this.dirtyObjects = [ ];
      }
    });

    this.dispatcherListeners.push(listener);
  }
}
