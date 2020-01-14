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

import * as bcc from '@evan.network/api-blockchain-core';
import { DispatcherInstance } from '@evan.network/ui';
import { EvanComponent } from '@evan.network/ui-vue-core';

import { DBCPDescriptionInterface, DAppContainer } from './DAppContainer';
import dispatchers from './dispatchers';

/**
 * Extended DigitalTwin class to merge backend logic with dispatcher watching functionalities. Also
 * provides for stateful data holding.
 *
 * @class      DigitalTwinService (name)
 */
export class DAppTwin extends bcc.DigitalTwin {
  /**
   * All loaded containers, enhanced with ui flags and data.
   */
  containers: { [id: string]: DAppContainer };

  /**
   * Twins contract address (also resolved ens address)
   */
  contractAddress: string;

  /**
   * Currents twin description
   */
  description: DBCPDescriptionInterface;

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
   * Twin owner address
   */
  owner: string;

  /**
   * Initial provided runtime for creating DAppContainer instances.
   */
  runtime: bcc.Runtime;

  /**
   * Current description save state.
   */
  saving: {
    description: boolean;
  };

  /**
   * Vue state for accessing and extending translations
   */
  vue: EvanComponent;

  /**
   * Call super and initialize new twin class.
   */
  constructor(vue: EvanComponent, runtime: bcc.Runtime, address: string) {
    super(runtime as bcc.DigitalTwinOptions, {
      accountId: runtime.activeAccount,
      address,
    });

    this.vue = vue;
  }

  /**
   * Reset containers object and reload all container definitions.
   */
  private async ensureContainers() {
    this.containers = { };

    // transform twinEntries to containers object, so all 
    const twinEntries = await this.getEntries();
    await Promise.all(Object.keys(twinEntries).map(async (key: string) => {
      this.containers[key] = new DAppContainer(
        this.vue,
        this.runtime,
        await twinEntries[key].value.getContractAddress(),
      );

      // load description, contractAddress, dispatcherStates
      await this.containers[key].initialize();
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
    this.saving = { description: false };

    // check description save states
    (descInstances as DispatcherInstance[]).forEach((instance: DispatcherInstance) => {
      if (instance.data.address === this.contractAddress) {
        this.dispatcherStates.description = true;
        this.dispatcherStates.twin = true;
      }
    });

    // check if twin is added as favorite
    (addFavInstances as DispatcherInstance[]).forEach((instance: DispatcherInstance) => {
      if (instance.data.address === this.contractAddress) {
        this.dispatcherStates.addFavorite = true;
        this.dispatcherStates.favorite = true;
      }
    });

    // check if twin is removed from favorite
    (removeFavInstances as DispatcherInstance[]).forEach((instance: DispatcherInstance) => {
      if (instance.data.address === this.contractAddress) {
        this.dispatcherStates.removeFavorite = true;
        this.dispatcherStates.favorite = true;
      }
    });

    // check if any container gets saved
    Object.keys(this.containers).forEach(containerKey => {
      if (this.containers[containerKey].dispatcherStates.container) {
        this.dispatcherStates.twin = true;
      }
    });
  }

  /**
   * Basic twin information and update instance params.
   */
  private async ensureTwinInfo() {
    this.contractAddress = await this.getContractAddress();
    this.description = await this.getDescription();
    this.owner = await this.runtime.executor.executeContractCall((this as any).contract, 'owner');
  }

  /**
   * Check descriptions i18n and extend vue translation pipeline.
   */
  private ensureI18N() {
    const locales = [ 'en', this.vue.$i18n.locale(), ];
    const i18n: any = this.description?.i18n || { };
    const newTranslations = {
      description: this.description.description,
      name: this.description.name,
    };

    // also support default language
    for (let locale in locales) {
      i18n[locale] = i18n[locale] || { };

      newTranslations.name = i18n[locale].name || newTranslations.name;
      newTranslations.description = i18n[locale].name || newTranslations.description;
    }

    this.vue.$i18n.add(locales[0], newTranslations);
  }

  /**
   * Load basic twin information and setup dispatcher watchers for loading states.
   */
  public async initialize() {
    await (this as any).ensureContract();
    await this.ensureTwinInfo();
    await this.ensureContainers();
    await this.ensureDispatcherStates();
    await this.ensureI18N();
  }

  /**
   * Saves the current description for this twin.
   *
   * @param      {DBCPDescriptionInterface}  description  description to save
   */
  public async setDescription(description = this.description) {
    await super.setDescription(description);
    this.description = await this.getDescription();
  }
}
