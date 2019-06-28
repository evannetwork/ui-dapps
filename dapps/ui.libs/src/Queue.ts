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

/**
 * initialized queue database
 */
let queueDB;

/**
 * Structure for handling dispatcher instances and managing data of them. It will start and register
 * dispatchers and offers the possiblity to save the dispatchers runtime data within the browsers
 * IndexDB.
 *
 * @class      EvanQueue
 */
export default class EvanQueue {
  /**
   * global available queue instance
   */
  entries: { };

  /**
   * save the last account id to check, for which account the queue was loaded
   */
  accountId: string;

  /**
   * Promise to handle queueDB loading finish
   */
  initializing: Promise<void>;

  /**
   * Storage name for the current user.
   */
  storageName: string;

  constructor(accountId: string) {
    this.accountId = accountId;
    this.storageName = this.getStorageName();
  }

  /**
   * Open the correct index db for the current user. Checks also for upgrades.
   *
   * @param      {number}  version  current db version
   */
  async openDB(version?: number) {
    return new Promise((resolve, reject) => {
      const indexDB = window['indexedDB'] ||
        window['mozIndexedDB'] ||
        window['webkitIndexedDB'] ||
        window['msIndexedDB'] ||
        window['shimIndexedDB'];

      const openRequest = indexedDB.open('EvanNetworkQueueV2', version);
      const storageName = this.storageName;

      openRequest.onerror = () => reject(openRequest.error);
      openRequest.onsuccess = async (event) => {
        const storeExists = Object
          .keys(openRequest.result.objectStoreNames)
          .map(index => openRequest.result.objectStoreNames[index])
          .indexOf(storageName) !== -1;

        if (!storeExists) {
          openRequest.result.close();
          resolve(await this.openDB(openRequest.result.version + 1));
        } else {
          resolve(openRequest.result)
        }
      };

      openRequest.onblocked = (event) => reject('indexDB blocked');

      openRequest.onupgradeneeded = function(event) {
        (<any>event.target).result
          .createObjectStore(storageName, {
            keyPath: 'dispatcherId'
          });
      };
    });
  }

  /**
   * Creates a queueDB if missing and open all connections. Is called by the Queue interaction
   * functions itself.
   */
  async initialize(): Promise<any> {
    if (!queueDB) {
      if (!this.initializing) {
        try {
          queueDB = await this.openDB();
        } catch (ex) {
          console.error(ex);
        }
      }

      await this.initializing;
    }
  }

  /**
   * gets the queue db storage name for the active account
   *
   * @return     {string}  The storage name.
   */
  getStorageName(): string {
    return 'evan-queue-' + this.accountId;
  }

  /**
   * Gets the "evan-queue" IndexDB object store.
   *
   * @param      {any}  option  additional options for queueDB.transaction
   * @return     {any}  The IDBObjectStore.
   */
  getObjectStore(option?: any) {
    const transaction = queueDB.transaction([this.storageName], option);
    const objectStore = transaction.objectStore(this.storageName);

    return objectStore;
  }

  /**
   * Loads the queue db for the current user and updates all global queue entries from the index db
   * @param      {string}  dispatcherId  The dispatcher identifier
   * @return     {Promise<Array<any>>}  global queue entry array
   */
  async load(dispatcherId: string): Promise<any> {
    await this.initialize();

    const entries = <any>await new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore('readonly');
      let request;

      if (dispatcherId === '*') {
        request = objectStore.getAll();
        request.onsuccess = (event) => resolve(request.result);
      } else {
        request = objectStore.get(dispatcherId);
        request.onsuccess = (event) =>
          resolve(request.result && request.result.entries ? request.result.entries : { });
      }

      request.onerror = (event) => reject(request.error);
    });

    return entries;
  }

  /**
   * Store for the current user its current global entries to the queue db.  It loads all current
   * saved entries and checks for the provided entryId. If the entryId is empty, the entry will be
   * deleted.
   *
   * @param      {string}  dispatcherId  dispatcher identifier (dappEns + dispatcher name)
   * @param      {string}  entryId       random id string
   * @param      {any}     data          any data that should be saved, leave empty to remove the
   *                                     entry
   * @return     {Promise<any>}  objectStore.put result
   */
  async save(dispatcherId: string, entryId: string, data?: any): Promise<any> {
    await this.initialize();

    return await new Promise(async (resolve, reject) => {
      // load previous entries
      const entries = await this.load(dispatcherId);

      // create objectStore to delete or put data
      const objectStore = this.getObjectStore('readwrite');
      let request;

      // if no data was applied, delete the data
      if (!data) {
        delete entries[entryId];
      } else {
        entries[entryId] = data;
      }

      if (Object.keys(entries).length === 0) {
        request = objectStore.delete(dispatcherId);
      } else {
        request = objectStore.put({
          dispatcherId: dispatcherId,
          entries: entries || { }
        });
      }

      request.onsuccess = (event) => resolve(request.result);
      request.onerror = (event) => reject(request.error);
    });
  }
}
