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

  constructor(accountId: string) {
    this.accountId = accountId;
  }

  /**
   * Creates a queueDB if missing and open all connections
   *
   * @param      {string}  accountId  account id to initialize the queueDB for
   */
  async initialize(): Promise<any> {
    if (!queueDB) {
      if (!this.initializing) {
        this.initializing = new Promise((resolve, reject) => {
          const indexDB = window['indexedDB'] ||
            window['mozIndexedDB'] ||
            window['webkitIndexedDB'] ||
            window['msIndexedDB'] ||
            window['shimIndexedDB'];

          const openRequest = indexedDB.open('EvanNetworkQueueV2', 1);
          const storageName = this.getStorageName();

          openRequest.onerror = () => {
            reject(openRequest.error)
          };

          openRequest.onsuccess = (event) => {
            try {
              (<any>event.target).result
                .createObjectStore(storageName, {
                  keyPath: 'dispatcherId'
                });
            } catch (ex) { }

            queueDB = openRequest.result;

            resolve();
          };

          openRequest.onblocked = function(event) {
            console.log('IndexDB blocked: ')

            resolve();
          };

          openRequest.onupgradeneeded = function(event) {
            (<any>event.target).result
              .createObjectStore(storageName, {
                keyPath: 'dispatcherId'
              });
          };
        })
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
   * Gets the "evan-queue" object store
   *
   * @param      {any}  option  additional options for transaction
   * @return     {any}  The object store.
   */
  getObjectStore(option?: any) {
    const transaction = queueDB.transaction([this.getStorageName()], option);
    const objectStore = transaction.objectStore('evan-queue');

    return objectStore;
  }

  /**
   * Loads the queue db for the current user and updates all global queue entries from the index db
   *
   * @return     {Promise<Array<any>>}  global queue entry array
   */
  private async load(dispatcherId: string): Promise<any> {
    const entries = <any>await new Promise((resolve, reject) => {
      const objectStore = this.getObjectStore('readonly');
      const request = objectStore.get(dispatcherId);

      request.onsuccess = function(event) {
        resolve(request.result && request.result.entries ? request.result.entries : { });
      };

      request.onerror = function(event) {
        reject(request.error);
      };
    });

    return entries;
  }

  /**
   * store for the current user it scurrent global entries to the queue db
   *
   * @param      {string}      dispatcher  dispatcher identifier (dappEns + dispatcher name)
   * @param      {Array<any>}  entries     queue entries to save
   * @return     {Promise<any>}  objectStore.put result
   */
  async save(dispatcherId: string, entryId: string, data?: any): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      const objectStore = this.getObjectStore('readwrite');
      let request;

      // load previous entries
      const entries = await this.load(dispatcherId);

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

      request.onsuccess = function(event) {
        resolve(request.result);
      };

      request.onerror = function(event) {
        reject(request.error);
      };
    });
  }
}
