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

import { DigitalTwin, DigitalTwinOptions, Runtime } from '@evan.network/api-blockchain-core';
import { DispatcherInstance } from '@evan.network/ui';
import { EvanComponent } from '@evan.network/ui-vue-core';
import { mixins } from 'vue-class-component';

import { applyMixins, DAppContract, DBCPDescriptionInterface } from './DAppContract';
import DAppContainer from './DAppContainer';
import * as dispatchers from './dispatchers';

/**
 * Extended DigitalTwin class to merge backend logic with dispatcher watching functionalities. Also
 * provides for stateful data holding.
 *
 * TODO: Implement correct dispatcher callback logic. Currently only dispatcher loading states gets
 * resetted. No values will be updated.
 */
class DAppTwin extends DigitalTwin {
  /**
   * All loaded containers, enhanced with ui flags and data.
   */
  containers: { [id: string]: DAppContainer };
  containerContracts: { [id: string]: DAppContainer };
  containerKeys: string[];

  /**
   * Current states for running dispatchers. Includes description saving, entry saving, sharing /
   * unsharing flags
   */
  dispatcherStates: {
    // true, if anything else is loading (includes also container loading)
    twin: boolean;
    // true when description is saved
    description: boolean;
    // add / remove favorite
    favorite: boolean;
    // adding twin to favorites
    addFavorite: boolean;
    // removing twins from favorites
    removeFavorite: boolean;
  };

  /**
   * Is this twin a favorite?
   */
  favorite: boolean;

  /**
   * Call super and initialize new twin class.
   */
  constructor(vue: EvanComponent, runtime: Runtime, address: string) {
    super(runtime as DigitalTwinOptions, { accountId: runtime.activeAccount, address });
    this.baseConstructor(vue, runtime, address);
  }

  /**
   * Reset containers object and reload all container definitions.
   */
  private async ensureContainers() {
    this.containers = { };
    this.containerContracts = { };

    // transform twinEntries to containers object, so all 
    const twinEntries = await this.getEntries();
    this.containerKeys = Object.keys(twinEntries);
    await Promise.all(this.containerKeys.map(async (key: string) => {
      this.containers[key] = new DAppContainer(
        this.vue,
        this.runtime,
        await twinEntries[key].value.getContractAddress(),
      );

      // load description, contractAddress, dispatcherStates
      await this.containers[key].initialize();
      
      // make contracts also directly accessible
      this.containerContracts[this.containers[key].contractAddress] = this.containers[key];
    }));
  }

  /**
   * Checkup current dispatcher loading states and set corresponding states.
   */
  private async ensureDispatcherStates() {
    // load all running dispatcher instances for containers
    const [ descInstances, addFavInstances, removeFavInstances ] = await Promise.all([
      dispatchers.descriptionDispatcher.getInstances(this.runtime),
      dispatchers.twinFavoriteAddDispatcher.getInstances(this.runtime),
      dispatchers.twinFavoriteRemoveDispatcher.getInstances(this.runtime),
    ]);

    // reset previous saving states
    const dispatcherStates = {
      addFavorite: false,
      description: false,
      favorite: false,
      removeFavorite: false,
      twin: false,
    };

    // check description save states
    (descInstances as DispatcherInstance[]).forEach((instance: DispatcherInstance) => {
      if (instance.data.address === this.contractAddress) {
        dispatcherStates.description = true;
        dispatcherStates.twin = true;
        this.vue.$set(this, 'description', instance.data.description);
      }
    });

    // check if twin is added as favorite
    (addFavInstances as DispatcherInstance[]).forEach((instance: DispatcherInstance) => {
      if (instance.data.address === this.contractAddress) {
        dispatcherStates.addFavorite = true;
        dispatcherStates.favorite = true;
        this.vue.$set(this, 'favorite', true);
      }
    });

    // check if twin is removed from favorite
    (removeFavInstances as DispatcherInstance[]).forEach((instance: DispatcherInstance) => {
      if (instance.data.address === this.contractAddress) {
        dispatcherStates.removeFavorite = true;
        dispatcherStates.favorite = true;
        this.vue.$set(this, 'favorite', false);
      }
    });

    // check if any container gets saved
    Object.keys(this.containers).forEach(containerKey => {
      if (this.containers[containerKey].dispatcherStates.container) {
        dispatcherStates.twin = true;
      }
    });

    // set it afterwards to reduce vue update triggers
    this.vue.$set(this, 'dispatcherStates', dispatcherStates);
  }

  /**
   * Load basic twin information and setup dispatcher watchers for loading states.
   */
  public async initialize() {
    // load base info and check for favorites status
    await this.loadBaseInfo();
    this.favorite = await this.isFavorite();

    await this.ensureContainers();
    await this.ensureDispatcherStates();
    this.ensureI18N();
  }

  /**
   * Start all dispatcher watchers.
   */
  public watchDispatchers() {
    // clear previously running watchers
    this.stopWatchDispatchers();
    // trigger all new watchers and save the listeners
    this.listeners = [
      dispatchers.descriptionDispatcher.watch(() => this.ensureDispatcherStates()),
      dispatchers.twinFavoriteAddDispatcher.watch(() => this.ensureDispatcherStates()),
      dispatchers.twinFavoriteRemoveDispatcher.watch(() => this.ensureDispatcherStates()),
    ];
  }

  /**
   * Stop all dispatcher listeners.
   */
  async stopWatchDispatchers() {
    // clear own watchers
    this.listeners.forEach(listener => listener());
    // clear container watchers
    this.containerKeys.forEach(key => this.containers[key].stopWatchDispatchers());
  }

  /**
   * Saves the current description for this twin.
   *
   * @param      {DBCPDescriptionInterface}  description  description to save
   */
  public async setDescription(description?: DBCPDescriptionInterface) {
    this.baseSetDescription(description);
  }
}

// enable multi inheritance for general DAppContract
interface DAppTwin extends DAppContract { }
applyMixins(DAppTwin, [ DAppContract ]);

export default DAppTwin;