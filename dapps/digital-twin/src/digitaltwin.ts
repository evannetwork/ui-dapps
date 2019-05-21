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
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

import * as utils from './utils';
import * as dispatchers from './dispatchers/registy';
import { containerDispatchers } from '@evan.network/datacontainer.digitaltwin';

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
   * current contract address or ens address
   */
  address: string;

  /**
   * Loaded contract address for this identity
   */
  contractAddress: string;

  /**
   * bcc.DigitalTwin.isValidDigitalTwin result
   */
  validity: any;

  /**
   * Digital twin left navigation entries
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
  initialized = false;

  /**
   * creation is in progress
   */
  isCreating = false;

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
   * Is the current user owner of the digital twin?
   */
  isOwner = false;

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
      address: address === 'dt-create' ? '' : address,
      containerConfig: { accountId: runtime.activeAccount, },
      description: dbcp,
      factoryAddress: utils.twinFactory,
    }
  }

  /**
   * Use the default digitaltwin config and return a new digital Twin instance.
   */
  static getDigitalTwin(runtime: bcc.Runtime, address: string): bcc.DigitalTwin {
    return new bcc.DigitalTwin(
      <any>utils.getRuntime(runtime),
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
          { name: 'general', path: `${ address }/general`, i18n: true },
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
    utils.addLastOpenedTwin(this.address);
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
    const filteredInstances = instances
      .filter(instance => instance.data.address === this.address);

    if (filteredInstances.length > 0) {
      return filteredInstances[0].data;
    }
  }

  /**
   * Check if currently an synchronisation is running for the favorites.
   */
  async getFavoriteLoading(runtime: bcc.Runtime) {
    const add = await dispatchers['favoriteAddDispatcher'].getInstances(runtime);
    const remove = await dispatchers['favoriteRemoveDispatcher'].getInstances(runtime);

    return [ ]
      .concat(add, remove)
      // filter for the current digitaltwin
      .filter((instance) => {
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
    if (this.address === 'dt-create') {
      this.validity = { valid: true, error: false, exists: false };
    } else {
      this.validity = await bcc.DigitalTwin.getValidity((<any>runtime), this.address);
    }

    if (this.validity.exists) {
      const digitaltwin = this.getDigitalTwinInstance(runtime);
      // load saving data from dbcp, so we can hot load data from their
      const savingObj = await this.getSaving(runtime);

      this.contractAddress = await digitaltwin.getContractAddress();
      this.dbcp = savingObj && savingObj.dbcp ? savingObj.dbcp : await digitaltwin.getDescription();
      this.isFavorite = await digitaltwin.isFavorite();
      const owner = await runtime.executor
        .executeContractCall((<any>digitaltwin).contract, 'owner');
      this.isOwner = owner === runtime.activeAccount;

      // set custom translation
      const customTranslation = { };
      customTranslation[`_digitaltwins.breadcrumbs.${ this.address }`] = this.dbcp.name;
      (<any>vueInstance).$i18n.add((<any>vueInstance).$i18n.locale(), customTranslation);

      // load container data and watch for updates
      await this.loadContainers(runtime);
      await this.watchContainers(runtime);

      // fill left panel side nav
      this.updateContainerNavigation();

      // check, if any updates are running
      this.isFavoriteLoading = await this.getFavoriteLoading(runtime);
      this.isFavoriteLoading && this.watchFavoriteLoading(runtime);
      this.isSaving = !!savingObj;
      this.isSaving && this.watchSaving(vueInstance, runtime);
    } else {
      this.dbcp = await utils.getDigitalTwinBaseDbcp();
      this.isFavorite = true;
      this.isOwner = true;

      // set default dbcp name
      if (this.address === 'dt-create') {
        this.dbcp.name = '';
      } else {
        this.dbcp.name = this.address;
      }

      // check for running dispatchers
      this.setIsCreating(vueInstance, runtime);
      this.dispatcherListeners.push(dispatchers.digitaltwinCreateDispatcher
        .watch(() => this.setIsCreating(vueInstance, runtime)));
    }

    this.setNameTranslations(vueInstance);
    this.loading = false;
    this.initialized = true;
  }

  /**
   * Load all the container for the current twin and save them into the containers array on the
   * instances. Containers array includes also description and url paths, for quick usage in ui.
   *
   * @param      {bccRuntime}  runtime  The runtime
   */
  async loadContainers(runtime: bcc.Runtime) {
    const digitaltwin = this.getDigitalTwinInstance(runtime);
    // load the containers, map them to an array
    const containers = await digitaltwin.getEntries();
    this.containers = (await Promise.all(Object.keys(containers).map(async (key: string) => {
      // filter empty keys
      if (key && containers[key].value !== utils.nullAddress) {
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

    await this.checkContainerLoading(runtime);
  }

  /**
   * Checks for changes and triggers the save dispatcher
   *
   * @param      {Vue}         vueInstance  a vue component instance
   * @param      {bccRuntime}  runtime      bcc runtime
   */
  saveDbcp(vueInstance: Vue, runtime: bcc.Runtime) {
    // lookup dirty objects and pass them into the save object
    const dataToSave = { address: this.address, dbcp: this.dbcp };

    // start the dispatcher and watch for updates
    this.isSaving = true;
    dispatchers.digitaltwinSaveDispatcher.start(runtime, dataToSave);
    this.watchSaving(vueInstance, runtime);
  }

  /**
   * Check if the current digitaltwin with the specific address is in creation
   */
  async setIsCreating(vueInstance: any, runtime: bcc.Runtime): Promise<void> {
    const instances = await dispatchers.digitaltwinCreateDispatcher.getInstances(runtime);
    const wasCreating = this.isCreating;

    // is currently an digitaltwin for this address is in creation?
    this.isCreating = instances
      .filter(instance => instance.data.address).length !== 0;

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
    if (this.address !== 'dt-create') {
      const customTranslation = { };
      const i18n = vueInstance.$i18n;

      customTranslation[ `_digitaltwins.breadcrumbs.${ this.address }`] = this.dbcp.name;

      i18n.add(i18n.locale(), customTranslation);
    }
  }

  /**
   * Toggle the current dispatcher state
   */
  async toggleFavorite(runtime) {
    if (this.address !== 'dt-create') {
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
    } else {
      this.isFavorite = !this.isFavorite;
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
      }
    });

    this.dispatcherListeners.push(listener);
  }

  /**
   * Check for running containers and if they should be displayed as loading.
   *
   * @param      {bccRuntime}  runtime  bcc runtime
   */
  async checkContainerLoading(runtime: bcc.Runtime) {
    // map all dispatcher instances to one array
    const instances = Object.assign(
      { },
      ...(await Promise.all(Object.keys(containerDispatchers).map(
        (name: string) => containerDispatchers[name].getInstances(runtime, false)
      ))
    ));

    // reset previous loadings and creation containers
    let previousCreateInstances = this.containers
      .filter(container => container.creating || container.linking)
      .map(container => container.dispatcherInstanceId);
    this.containers.forEach(container => container.loading = false);
    this.containers = this.containers.filter(container =>
      !(container.creating || container.linking));

    // search for instances and containers specific for this twin
    Object.keys(instances).forEach((instanceKey: string) => {
      const instance: DispatcherInstance = instances[instanceKey];

      // if an container gets created for this digital twin, add it to the containers list
      if ((instance.dispatcher.name === 'createDispatcher' ||
           instance.dispatcher.name === 'linkDispatcher') &&
        (instance.data.digitalTwinAddress === this.address ||
        instance.data.digitalTwinAddress === this.contractAddress)) {
        // remove the create instance, it's always running
        const runningIndex = previousCreateInstances.indexOf(instance.id);
        runningIndex !== -1 && previousCreateInstances.splice(runningIndex, 1);

        // add the container including the creating flag, so the ui will be locked, but the
        // container will be displayed
        const loadingContainer: any = {
          creating: true,
          description: {
            name: instance.data.name,
            description: instance.data.description,
            imgSquare: instance.data.img,
          },
          dispatcherInstanceId: instance.id,
          loading: true,
          name: instance.data.name,
        }

        // if the container gets linked, it already exists, so we can add a navigation path
        if (instance.dispatcher.name === 'linkDispatcher') {
          loadingContainer.creating = false;
          loadingContainer.linking = true;
          loadingContainer.address = instance.data.containerAddress;
          loadingContainer.path = [
            this.address,
            `datacontainer.digitaltwin.${ dappBrowser.getDomainName() }`,
            loadingContainer.address,
          ].join('/');
        }

        this.containers.push(loadingContainer);
      } else {
        // check for containers, that are bound to this twin and check for loading
        this.containers.forEach((container: any) => {
          if (container.address === instance.data.address) {
            container.loading = true;
          }
        });
      }
    });

    // if not all previously create instances are running, the instance has finished creation, so we
    // can reload the containers
    if (previousCreateInstances.length > 0) {
      await this.loadContainers(runtime);
    }

    // update left twin navigation
    this.updateContainerNavigation();
  }

  /**
   * Watch for creating or updating containers.
   *
   * @param      {bccRuntime}  runtime  bcc runtime
   */
  async watchContainers(runtime: bcc.Runtime) {
    const listener = await Dispatcher.watch(
      () => this.checkContainerLoading(runtime),
      `datacontainer.digitaltwin.${ dappBrowser.getDomainName() }`
    );

    this.dispatcherListeners.push(listener);
  }

  /**
   * Uses the current containers and fills the left digital twin navigation
   */
  updateContainerNavigation() {
    // set the navigation for the containers => keep first entry, replace the containers
    this.navigation[1].children = [ this.navigation[1].children[0] ]
      .concat(this.containers.map(container => {
        return {
          creating: container.creating,
          i18n: false,
          loading: container.loading,
          name: container.name,
          path: container.path,
        }
      })
    );
  }
}
