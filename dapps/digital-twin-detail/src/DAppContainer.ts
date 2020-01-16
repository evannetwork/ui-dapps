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

import { Container, ContainerPlugin, Runtime, DigitalTwinOptions } from '@evan.network/api-blockchain-core';
import { DispatcherInstance } from '@evan.network/ui';
import { EvanComponent } from '@evan.network/ui-vue-core';

import * as dispatchers from './dispatchers';
import { applyMixins, DAppContract, DBCPDescriptionInterface } from './DAppContract';

/**
 * Extended Container class to merge backend logic with dispatcher watching functionalities. Also
 * provides for stateful data holding.
 * 
 * TODO: Sharing handling.
 */
class DAppContainer extends Container {
  /**
   * Contains all data, that is currently processed by the container save dispatchers. So get entry
   * can merge original values with these ones.
   */
  dispatcherData: any = { };

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
   * All container entries mapped to it's loaded data
   */
  entryKeys: string[];
  entries: { [entryName: string]: any };

  /**
   * Containers plugin definition for accessing entry data schemas.
   */
  plugin: ContainerPlugin;

  /**
   * Call super and initialize new container class.
   */
  constructor(vue: EvanComponent, runtime: Runtime, address: string) {
    super(runtime as DigitalTwinOptions, { accountId: runtime.activeAccount, address });
    this.baseConstructor(vue, runtime, address);
  }

  /**
   * Add list entries using the digital-twin detail dispatcher.
   *
   * @param      {string}  listName  name of the list in the data contract
   * @param      {any}     values    values to add
   */
  public async addListEntries(listName: string, values: any[]): Promise<void> {
    await dispatchers.containerSaveDispatcher.start(this.runtime, {
      address: this.contractAddress,
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
    const dispatcherData = { };
    const dispatcherStates = {
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
        dispatcherStates.container = true;
        dispatcherStates.description = true;
        this.vue.$set(this, 'description', instance.data.description);
      }
    });

    // check for saving entries
    (saveInstances as DispatcherInstance[]).forEach((instance: DispatcherInstance) => {
      if (instance.data.address === this.contractAddress) {
        (instance.data.entriesToSave || Object.keys(instance.data.value)).forEach(entryKey => {
          dispatcherStates.container = true;
          dispatcherStates.entries[entryKey] = true;
          dispatcherData[entryKey] = instance.data.value[entryKey];

          // do not overwrite list values, ui must render it using dispatcherData
          const entryDef = this.plugin.template.properties[entryKey];
          if (entryDef.type === 'entry') {
            this.entries[entryKey] = instance.data.value[entryKey];
          }
        });
      }
    });

    // check for sharing
    (shareInstances as DispatcherInstance[]).forEach((instance: DispatcherInstance) => {
      // TODO: setup sharing states
      // if (instance.data.address === this.contractAddress) {
      // }
    });

    // set it afterwards to reduce vue update triggers
    this.vue.$set(this, 'dispatcherData', dispatcherData);
    this.vue.$set(this, 'dispatcherStates', dispatcherStates);
  }

  /**
   * Setup the whole data object for the current container. Is not loaded by default, must be runned
   * using
   *
   * @param      {string}  entriesToLoad  load only specific entriess
   */
  public async ensureEntries(entriesToLoad?: string[]) {
    this.entries = { };
    this.entryKeys = Object.keys(this.plugin.template.properties);
    // load entry data
    await Promise.all((entriesToLoad || this.entryKeys).map(async (entryKey: string) => {
      const entryDef = this.plugin.template.properties[entryKey];

      if (entryDef.type === 'list') {
        this.entries[entryKey] = await this.getListEntries(entryKey, 30, 0, true);
      } else {
        this.entries[entryKey] = await this.getEntry(entryKey);
      }
    }));
  }

  /**
   * Return entry from contract including current dispatcher value
   *
   * @param      {string}  entryName  entry name
   */
  public async getEntry(entryName: string): Promise<any> {
    if (this.dispatcherData[entryName]) {
      return this.dispatcherData[entryName];
    } else {
      return await Container.prototype.getEntry.call(this, entryName);
    }
  }

  /**
   * Return list entries from contract including dispatcher values.
   *
   * @param      {string}   listName  name of a list in the container
   * @param      {number}   count     number of items to retrieve
   * @param      {number}   offset    skip this many entries
   * @param      {boolean}  reverse   if true, fetches last items first
   */
  public async getListEntries(
    listName: string,
    count = 10,
    offset = 0,
    reverse = false,
  ): Promise<any[]> {
    let listEntries = await Container.prototype.getListEntries.call(this, listName, count,
      offset, reverse);

    // if offset === 0 and the dispatcher is saving some values, add this values to the top
    if (offset === 0 && this.dispatcherData[listName]) {
      listEntries.unshift(this.dispatcherData[listName]);
    }

    return listEntries;
  }

  /**
   * Load basic container information and ensure dispatcher states
   */
  public async initialize() {
    await this.loadBaseInfo();
    this.plugin = await this.toPlugin();
    await this.ensureDispatcherStates();
    this.ensureI18N();
  }

  /**
   * Saves the current description for this container.
   *
   * @param      {DBCPDescriptionInterface}  description  description to save
   */
  public async setDescription(description?) {
    this.baseSetDescription(description);
  }

  /**
   * Store data to a container using the default dispatcher.
   *
   * @param      {any}  data    object with keys, that are names of lists or entries and values,
   *                            that are the values to store to them
   */
  public async storeData(data: { [id: string]: any }): Promise<void> {
    await dispatchers.containerSaveDispatcher.start(this.runtime, {
      address: this.contractAddress,
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
      address: this.contractAddress,
      data: {
        [entryName]: value,
      },
      updateDescription,
    });
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
      dispatchers.containerSaveDispatcher.watch(async ($event: any) => {
        const beforeSave = this.dispatcherStates.container;
        await this.ensureDispatcherStates();

        // force entry reloading, when data was already loaded and container update was finished
        if (beforeSave && !this.dispatcherStates.container &&
            ($event.detail.status === 'finished' || $event.detail.status === 'deleted')) {
          await this.ensureEntries(Object.keys($event.data.data));
        }
      }),
      dispatchers.containerShareDispatcher.watch(() => this.ensureDispatcherStates()),
    ];
  }

  /**
   * Stop all dispatcher listeners.
   */
  async stopWatchDispatchers() {
    this.listeners.forEach(listener => listener());
  }
}

// enable multi inheritance for general DAppContract
interface DAppContainer extends DAppContract { }
applyMixins(DAppContainer, [ DAppContract ]);

export default DAppContainer;