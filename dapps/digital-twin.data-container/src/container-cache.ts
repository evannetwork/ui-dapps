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

import Dexie from 'dexie';

import * as bcc from '@evan.network/api-blockchain-core';

import { containerCache } from './UiContainer';

export default class ContainerCache {
  /**
   * Current database instance
   */
  db: Dexie;

  /**
   * Users account id, so we can scope the plugin cache for multiple users
   */
  activeAccount: string;

  /**
   * plugin cache key for the current user
   */
  cacheKey: string;

  constructor(activeAccount: string) {
    this.db = new Dexie(`evan-dc-cache`);
    this.activeAccount = activeAccount;
    this.cacheKey = `plugins`;

    // set the store for the user
    const stores = { };
    stores[this.cacheKey] = 'id';
    this.db.version(1).stores(stores);
  }

  /**
   * Get the id including the active account
   *
   * @param      {string}  id      The identifier
   */
  getEntryId(id: string) {
    return `${ this.activeAccount }-${ id }`;
  }

  /**
   * Build the entry event id.
   *
   * @param      {string}  id      container address
   */
  getEventName(id: string) {
    return `dc-cache-${ this.getEntryId(id) }`;
  }

  /**
   * Store a plugin within the current indexed db, so the user won't miss any data
   *
   * @param      {string}  id      id of the cache (e.g.: create, container address, plugin type,
   *                               ...)
   */
  async get(id: string) {
    const result = await (<any>this.db).plugins.get(this.getEntryId(id));

    if (result) {
      return result.plugin;
    }
  }

  /**
   * Store a plugin within the current indexed db, so the user won't miss any data
   *
   * @param      {bcc.ContainerPlugin}  plugin  plugin that should be saved
   */
  async put(id: string, plugin: bcc.ContainerPlugin) {
    containerCache[id] = plugin;

    await (<any>this.db).plugins.put({ id: this.getEntryId(id), plugin });

    this.sendEvent(id, 'put', plugin);
  }

  /**
   * Removes an entry from the cache db.
   *
   * @param      {string}  id      id of the cache (e.g.: create, container address, plugin type,
   *                               ...)
   */
  async delete(id: string) {
    delete containerCache[id];
    await (<any>this.db).plugins.delete(this.getEntryId(id));

    this.sendEvent(id, 'delete');
  }

  /**
   * Send an event with an status for this instance.
   *
   * @param      {string}  id      affected container address
   * @param      {string}  type    The type
   * @param      {any}     data    custom data that should be sent
   */
  sendEvent(id: string, type: string, data?: any) {
    const eventName = this.getEventName(id);

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(eventName, {
        detail: {
          type: type,
          data: data
        }
      }));
    });
  }

  /**
   * Watch for updates
   *
   * @param      {Function}  func    function that should be called on an update
   */
  watch(id: string, func: ($event: CustomEvent) => any) {
    const eventName = this.getEventName(id);
    const watch = ($event: CustomEvent) => func($event);
    window.addEventListener(eventName, watch);

    // return the watch remove function
    return () => window.removeEventListener(eventName, watch);
  }
}
