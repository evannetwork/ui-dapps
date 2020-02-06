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

import {
  Container, ContainerPlugin, Runtime, DigitalTwinOptions, utils,
} from '@evan.network/api-blockchain-core';
import { DispatcherInstance } from '@evan.network/ui';
import { EvanComponent } from '@evan.network/ui-vue-core';

import * as dispatchers from './dispatchers';
import { applyMixins, DAppContract } from './DAppContract';

/**
 * Extended Container class to merge backend logic with dispatcher watching functionalities. Also
 * provides stateful data holding.
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
    entries: { [dataSet: string]: boolean };
    // combined sharing / unshare state
    shareUnshare: { [dataSet: string]: boolean };
    // all entries, that are in sharing process
    sharing: { [dataSet: string]: boolean };
    // all entries, that are in unshare process
    unsharing: { [dataSet: string]: boolean };
  };

  /**
   * All container entries mapped to it's loaded data
   */
  entryKeys: string[];

  entries: { [entryName: string]: any };

  listEntryCounts: { [entryName: string]: number }

  /**
   * Containers plugin definition for accessing entry data schemas.
   */
  plugin: ContainerPlugin;

  /**
   * Return the easy type definition from a ajv schema (e.g. used to detect file fields).
   *
   * @param      {any}      subSchema   ajv sub schema
   * @return     {string}   The type.
   */
  static getSchemaType(subSchema: any): string {
    // check if it's a file
    if (subSchema?.$comment) {
      let $comment;

      try {
        $comment = JSON.parse(subSchema.$comment);
      } catch (ex) {
        // could not parse comment
      }

      if ($comment?.isEncryptedFile) {
        return 'files';
      }
    }

    return subSchema?.type;
  }

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
      value: {
        [listName]: values,
      },
    });
  }

  /**
   * Checkup current dispatcher loading states and set corresponding states.
   */
  private async ensureDispatcherStates(): Promise<void> {
    // load all running dispatcher instances for containers
    const [descInstances, saveInstances, shareInstances] = await Promise.all([
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
        (instance.data.entriesToSave || Object.keys(instance.data.value)).forEach((entryKey: string) => {
          dispatcherStates.container = true;
          dispatcherStates.entries[entryKey] = true;
          dispatcherData[entryKey] = instance.data.value[entryKey];
        });
      }
    });

    // check for sharing
    (shareInstances as DispatcherInstance[]).forEach((instance: DispatcherInstance) => {
      /* TODO: setup sharing states
         if (instance.data.value.address === this.contractAddress) {
         } */
    });

    // set it afterwards to reduce vue update triggers
    this.dispatcherData = dispatcherData;
    this.dispatcherStates = dispatcherStates;
  }

  /**
   * Setup the whole data object for the current container. Is not loaded by default, must be runned
   * using
   *
   * @param      {string}  entriesToLoad  load only specific entriess
   */
  public async loadEntryValues(entriesToLoad?: string[]): Promise<void> {
    this.entryKeys = Object.keys(this.plugin.template.properties);
    // load entry data
    await Promise.all((entriesToLoad || this.entryKeys).map(async (entryKey: string) => {
      const entryDef = this.plugin.template.properties[entryKey];

      if (entryDef?.type === 'list') {
        this.listEntryCounts[entryKey] = await this.getListEntryCount(entryKey);
        this.entries[entryKey] = await this.getListEntries(entryKey, 30, 0, true);
      } else {
        this.entries[entryKey] = await this.getEntry(entryKey);
        if (this.entries[entryKey] === '0x0000000000000000000000000000000000000000000000000000000000000000') {
          this.entries[entryKey] = undefined;
        }
      }
    }));
  }

  /**
   * Return entry from contract including current dispatcher value
   *
   * @param      {string}  entryName  entry name
   */
  public async getEntry(entryName: string): Promise<any> {
    return Container.prototype.getEntry.call(this, entryName);
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
    const listEntries = await Container.prototype.getListEntries.call(this, listName, count,
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
  public async initialize(): Promise<void> {
    await this.loadBaseInfo();
    this.plugin = await this.toPlugin();
    this.entries = {};
    this.listEntryCounts = {};
    await this.ensureDispatcherStates();
    this.ensureI18N();
  }

  /**
   * Saves the current description for this container.
   *
   * @param      {DBCPDescriptionInterface}  description  description to save
   */
  public async setDescription(description?): Promise<void> {
    return this.baseSetDescription(description);
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
  public async setEntry(entryName: string, value: any): Promise<void> {
    await dispatchers.containerSaveDispatcher.start(this.runtime, {
      address: this.contractAddress,
      value: {
        [entryName]: value,
      },
    });
  }

  /**
   * Start all dispatcher watchers.
   */
  public watchDispatchers(): void {
    // clear previously running watchers
    this.stopWatchDispatchers();
    // trigger all new watchers and save the listeners
    this.listeners = [
      dispatchers.descriptionDispatcher.watch(($event) => this.onDescriptionSave($event)),
      dispatchers.containerSaveDispatcher.watch(($event) => this.onContainerSave($event)),
      dispatchers.containerShareDispatcher.watch(() => this.ensureDispatcherStates()),
    ];
  }

  /**
   * Handles a container entry save dispatcher loading event and triggers a description reload, if
   * dispatcher was stopped / finished.
   *
   * @param      {any}  $event  dispatcher event
   */
  async onContainerSave($event: any): Promise<void> {
    const beforeSave = this.dispatcherStates.container;
    const entriesToReload = Object.keys(this.dispatcherStates.entries)
      .filter((key: string) => this.dispatcherStates.entries[key]);
    await this.ensureDispatcherStates();

    // force entry reloading, when data was already loaded and container update was finished
    if (beforeSave && !this.dispatcherStates.container
      && ($event.detail.status === 'finished' || $event.detail.status === 'deleted')) {
      await this.loadEntryValues(entriesToReload);
      entriesToReload.forEach((entry: string) => this.triggerReload(entry));
    }
  }

  /**
   * Handles a description save dispatcher loading event and triggers a description reload, if
   * dispatcher was stopped / finished.
   */
  async onDescriptionSave($event: any): Promise<void> {
    this.ensureDispatcherStates();

    if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
      this.description = await this.getDescription();
      this.triggerReload('description');
    }
  }

  /**
   * Stop all dispatcher listeners.
   */
  public stopWatchDispatchers(): void {
    this.listeners.forEach((listener: Function) => listener());
  }
}

// enable multi inheritance for general DAppContract
interface DAppContainer extends DAppContract, Container { }
applyMixins(DAppContainer, [DAppContract]);

export default DAppContainer;
