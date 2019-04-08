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

import { getDigitalTwinBaseDbcp, getLastOpenedTwins, latestTwinsKey, getRuntime,
  nullAddress } from './utils';
import * as dispatchers from './dispatchers/registy';

/**
 * Represents the UI representation for a evan.network. Handles data management and so on.
 *
 * @class      EvanUIDigitalTwin
 */
export default class EvanUIDigitalTwin {
  /**
   * dbcp description of the digitaltwin (initially the most smallest subset of data)
   */
  dbcp: any;

  /**
   * current contract address
   */
  address: string;

  /**
   * bcc.DigitalTwin.isValidDigitalTwin result
   */
  validity: any;

  /**
   * Digital digitaltwin left navigation entries
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
   * is the digitaltwin currently loading?
   */
  loading = true;

  /**
   * creation is in progress
   */
  isCreating = false;

  /**
   * Was the digitaltwin adjusted and a save is needed?
   */
  dirty = false;
  dirtyObjects = [ ];

  /**
   * is this digitaltwin is a favorite?
   */
  isFavorite = false;
  isFavoriteLoading = false;

  /**
   * show loading, when save process is running
   */
  isSaving = false;

  /**
   * Return the default digitaltwin config.
   */
  static getDigitalTwinConfig(
    runtime: bcc.Runtime,
    address: string,
    dbcp?: any
  ): bcc.DigitalTwinConfig {
    return {
      accountId: runtime.activeAccount,
      address: address,
      containerConfig: { accountId: runtime.activeAccount, },
      description: dbcp,
      factoryAddress: '0xE8aB5213BDD998FB39Ed41352a7c84a6898C288a',
    }
  }

  /**
   * Use the default digitaltwin config and return a new digital Twin instance.
   */
  static getDigitalTwin(runtime: bcc.Runtime, address: string): bcc.DigitalTwin {
    return new bcc.DigitalTwin(
      <any>getRuntime(runtime),
      EvanUIDigitalTwin.getDigitalTwinConfig(runtime, address)
    );
  }

  constructor(address: string) {
    this.address = address;

    // set initial navigation
    this.navigation = [
      {
        name: 'digitaltwin-details',
        active: true,
        children: [
          { name: 'general', path: address, i18n: true },
          { name: 'verifications', path: `${ address }/verifications`, i18n: true }
        ]
      },
      {
        name: 'containers',
        active: false,
        children: [
          { name: 'container-overview', path: `${ address }/containers`, i18n: true },
        ]
      }
    ];

    // apply this digitaltwin address to the last opened digitaltwins
    const lastTwins = getLastOpenedTwins();
    const existingIndex = lastTwins.indexOf(address);
    if (existingIndex !== -1) {
      lastTwins.splice(existingIndex, 1);
    }
    lastTwins.unshift(address);
    // only save the latest 20 entries
    window.localStorage[latestTwinsKey] = JSON.stringify(lastTwins.slice(0, 20));
  }

  /**
   * Stops all dispatcher listeners and kill the vue store instance, if it's set
   *
   * @param      {any}  vueInstance  a vue instance
   */
  destroy(vueInstance?: Vue): void {
    if (vueInstance) {
      vueInstance.$store.state.uiDT = null;
    }

    this.dispatcherListeners.forEach((listener: Function) => listener());
  }

  /**
   * Return the DigitalTwin instance for the current class instancew.
   *
   * @param      {bccRuntime}  runtime  The runtime
   */
  getDigitalTwinInstance(runtime: bcc.Runtime) {
    return new bcc.DigitalTwin(
      <any>runtime,
      EvanUIDigitalTwin.getDigitalTwinConfig(runtime, this.address)
    );
  }

  /**
   * Returns a saving object, if the current digitaltwin is updating.
   *
   * @param      {bccRuntime}  runtime  bcc runtime
   */
  async getSaving(runtime: bcc.Runtime): Promise<any> {
    const instances = await dispatchers.digitaltwinSaveDispatcher.getInstances(runtime);

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
      // filter for the current digitaltwin
      .filter((instanceKey) => {
        const instance = add[instanceKey] || remove[instanceKey];
        return instance.data.address === this.address;
      })
      .length > 0;
  }

  /**
   * Load the initial data for the digital Twin
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
    this.validity = await bcc.DigitalTwin.getValidity((<any>runtime), this.address);

    if (this.validity.exists) {
      const digitaltwin = this.getDigitalTwinInstance(runtime);
      // load saving data from dbcp, so we can hot load data from their
      const savingObj = await this.getSaving(runtime);

      this.dbcp = savingObj && savingObj.dbcp ? savingObj.dbcp : await digitaltwin.getDescription();
      this.isFavorite = await digitaltwin.isFavorite();

      // load the containers, map them to an array
      const containers = await digitaltwin.getEntries();
      this.containers = (await Promise.all(Object.keys(containers).map(async (key: string) => {
        // filter empty keys
        if (key && containers[key].value !== nullAddress) {
          const [ containerAddress, description ] = await Promise.all([
            containers[key].value.getContractAddress(),
            containers[key].value.getDescription(),
          ]);

          return {
            address: containerAddress,
            description: description,
            name: key,
            path: [
              this.address,
              `datacontainer.digitaltwin.${ dappBrowser.getDomainName() }`,
              containerAddress,
            ].join('/'),
            container: containers[key].value,
          };
        }
      }))).filter(container => !!container);

      // set the navigation for the containers => keep first entry, replace the containers
      this.navigation[1].children = [ this.navigation[1].children[0] ]
        .concat(this.containers.map(container => {
          return { name: container.name, path: container.path, i18n: false }
        }));

      // check, if any updates are running
      this.isFavoriteLoading = await this.getFavoriteLoading(runtime);
      this.isFavoriteLoading && this.watchFavoriteLoading(runtime);
      this.isSaving = !!savingObj;
      this.isSaving && this.watchSaving(vueInstance, runtime);
    } else {
      this.dbcp = await getDigitalTwinBaseDbcp();
      // set default dbcp name
      this.dbcp.name = this.address;

      // check for running dispatchers
      this.setIsCreating(vueInstance, runtime);
      this.dispatcherListeners.push(dispatchers.digitaltwinCreateDispatcher
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
      dispatchers.digitaltwinSaveDispatcher.start(runtime, dataToSave);
      this.watchSaving(vueInstance, runtime);
    }
  }

  /**
   * Sets a data property and makes the digitaltwin dirty.
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

      // make the digitaltwin dirty
      this.dirty = true;
    }
  }

  /**
   * Check if the current digitaltwin with the specific address is in creation
   */
  async setIsCreating(vueInstance: any, runtime: bcc.Runtime): Promise<void> {
    const instances = await dispatchers.digitaltwinCreateDispatcher.getInstances(runtime);
    const wasCreating = this.isCreating;

    // is currently an digitaltwin for this address is in creation?
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

    customTranslation[ `_digitaltwins.breadcrumbs.${ this.address }`] = this.dbcp.name;

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
    const listener = await dispatchers.digitaltwinSaveDispatcher.watch(async () => {
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
