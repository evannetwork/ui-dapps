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


export default class ContainerCache {
  /**
   * Current database instance
   */
  db: Dexie;

  /**
   * Users account id, so we can scope the template cache for multiple users
   */
  activeAccount: string;

  /**
   * template cache key for the current user
   */
  cacheKey: string;

  constructor(activeAccount: string) {
    this.db = new Dexie(`evan-dt-datacontainer`);
    this.activeAccount = activeAccount;
    this.cacheKey = `templates`;

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
   * Store a template within the current indexed db, so the user won't miss any data
   *
   * @param      {string}  id      id of the cache (e.g.: create, container address, template type,
   *                               ...)
   */
  async get(id: string) {
    const result = await (<any>this.db).templates.get(this.getEntryId(id));

    if (result) {
      return result.template;
    }
  }

  /**
   * Store a template within the current indexed db, so the user won't miss any data
   *
   * @param      {bccContainerTemplate}  template  template that should be saved
   */
  async put(id: string, template: bcc.ContainerTemplate) {
    await (<any>this.db).templates.put({ id: this.getEntryId(id), template });
  }

  /**
   * Removes an entry from the cache db.
   *
   * @param      {string}  id      id of the cache (e.g.: create, container address, template type,
   *                               ...)
   */
  async delete(id: string) {
    await (<any>this.db).templates.delete(this.getEntryId(id));
  }
}
