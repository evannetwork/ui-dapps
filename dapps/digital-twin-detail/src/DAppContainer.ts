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

import dispatchers from './dispatchers';

// TODO: remove type description when ticket is implemented
// (https://evannetwork.atlassian.net/browse/CORE-864)
export interface DBCPDescriptionInterface {
  author: string;
  description?: string;
  i18n?: {
    [language: string]: {
      [id: string]: any;
      description?: string;
      name: string;
    };
  };
  name: string;
}

/**
 * Extended Container class to merge backend logic with dispatcher watching functionalities. Also
 * provides for stateful data holding.
 * 
 * TODO: Sharing handling.
 */
export default class DAppContainer extends bcc.Container {
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
    // true, if anything else is loading
    container: boolean;
    // true when description is saved
    description: boolean;
    // all loading flags for entries
    entries: { [dataSet: string]: boolean; };
    // combined sharing / unshare state
    shareUnshare: { [dataSet: string]: boolean; };
    // all entries, that are in sharing process
    sharing: { [dataSet: string]: boolean; };
    // all entries, that are in unshare process
    unsharing: { [dataSet: string]: boolean; };
  };

  /**
   * Container owner address
   */
  owner: string;

  /**
   * Initial provided runtime for creating DAppContainer instances.
   */
  runtime: bcc.Runtime;

  /**
   * Vue state for accessing and extending translations
   */
  vue: EvanComponent;

  /**
   * Call super and initialize new container class.
   */
  constructor(vue: EvanComponent, runtime: bcc.Runtime, address: string) {
    super(runtime as bcc.ContainerOptions, {
      accountId: runtime.activeAccount,
      address,
    });

    this.runtime = runtime;
    this.vue = vue;
  }
  /**
   * Add list entries using the digital-twin detail dispatcher.
   *
   * @param      {string}  listName  name of the list in the data contract
   * @param      {any}     values    values to add
   */
  public async addListEntries(listName: string, values: any[]): Promise<void> {
    await dispatchers.containerSaveDispatcher.start(this.runtime, {
      addres: this.contractAddress,
      data: {
        [listName]: values,
      },
    });
  }

  /**
   * Checkup current dispatcher loading states and set corresponding states.
   */
  private async ensureDispatcherStates() {
    // load all running dispatcher instances for containers
    const [ descInstances, saveInstances, shareInstances ] = await Promise.all([
      dispatchers.descriptionDispatcher.getInstances(this.runtime),
      dispatchers.containerSaveDispatcher.getInstances(this.runtime),
      dispatchers.containerShareDispatcher.getInstances(this.runtime),
    ]);

    // reset previous saving states
    this.dispatcherStates = {
      container: false,
      description: false,
      entries: { },
      shareUnshare: { },
      sharing: { },
      unsharing: { },
    };

    // check description save states
    (descInstances as DispatcherInstance[]).forEach((instance: DispatcherInstance) => {
      if (instance.data.address === this.contractAddress) {
        this.dispatcherStates.container = true;
        this.dispatcherStates.description = true;
      }
    });

    // check for saving entries
    (saveInstances as DispatcherInstance[]).forEach((instance: DispatcherInstance) => {
      if (instance.data.address === this.contractAddress) {
        (instance.data.entriesToSave || Object.keys(instance.data.value)).forEach(key => {
          this.dispatcherStates.container = true;
          this.dispatcherStates.entries[key] = true; 
        });
      }
    });

    // check for sharing
    (shareInstances as DispatcherInstance[]).forEach((instance: DispatcherInstance) => {
      // TODO: setup sharing states
      // if (instance.data.address === this.contractAddress) {
      // }
    });
  }

  /**
   * Basic twin information and update instance params.
   */
  private async ensureContainerInfo() {
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
      properties: { },
    };

    // also support default language
    for (let locale in locales) {
      i18n[locale] = i18n[locale] || { };

      newTranslations.name = i18n[locale].name || newTranslations.name;
      newTranslations.description = i18n[locale].name || newTranslations.description;

      // check if properties are sent and merge them
      if (i18n[locale].properties) {
        newTranslations.properties = bcc.lodash.merge(newTranslations.properties,
          i18n[locale].properties);
      }
    }

    this.vue.$i18n.add(locales[0], newTranslations);
  }


  /**
   * Load basic container information and ensure dispatcher states
   */
  public async initialize() {
    await (this as any).ensureContract();
    await this.ensureContainerInfo();
    await this.ensureDispatcherStates();
    await this.ensureI18N();
  }

  /**
   * Saves the current description for this container.
   *
   * @param      {DBCPDescriptionInterface}  description  description to save
   */
  public async setDescription(description = this.description) {
    await super.setDescription(description);
    this.description = await this.getDescription();
  }

  /**
   * Store data to a container using the default dispatcher.
   *
   * @param      {any}  data    object with keys, that are names of lists or entries and values,
   *                            that are the values to store to them
   */
  public async storeData(data: { [id: string]: any }): Promise<void> {
    await dispatchers.containerSaveDispatcher.start(this.runtime, {
      addres: this.contractAddress,
      data,
    });
  }

  /**
   * Set a value for an entry.
   *
   * @param      {string}  entryName  name of an entry in the container
   * @param      {any}     value      value to set
   */
  public async setEntry(entryName: string, value: any, updateDescription = true): Promise<void> {
    await dispatchers.containerSaveDispatcher.start(this.runtime, {
      addres: this.contractAddress,
      data: {
        [entryName]: value,
      },
      updateDescription,
    });
  }
}
