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

import * as dappBrowser from '@evan.network/ui-dapp-browser';
import * as bcc from '@evan.network/api-blockchain-core';

import * as dtLib from '@evan.network/digitaltwin.lib';
export {
  containerFactory,
  enableDTSave,
  getDigitalTwinConfig,
  getDomainName,
  getRuntime,
  latestTwinsKey,
  nullAddress,
  twinFactory,
} from '@evan.network/digitaltwin.lib';

import {
  favoriteAddDispatcher,
  favoriteRemoveDispatcher,
} from './dispatchers/registy';

/**
 * Add a address to the last opened twins array.
 *
 * @param      {string}  address  The address
 */
export function addLastOpenedTwin(address: string) {
  if (address &&
      address !== 'dt-create' &&
      address !== 'undefined') {
    const lastTwins = getLastOpenedTwins();

    const existingIndex = lastTwins.indexOf(address);
    if (existingIndex !== -1) {
      lastTwins.splice(existingIndex, 1);
    }
    lastTwins.unshift(address);
    // only save the latest 20 entries
    window.localStorage[dtLib.latestTwinsKey] = JSON.stringify(lastTwins.slice(0, 20));
  }
}

/**
 * Return the last opened digitaltwins that were persited in the localStorage.
 */
export function getLastOpenedTwins() {
  return JSON.parse(window.localStorage[dtLib.latestTwinsKey] || '[ ]');
}

/**
 * Returns a minimal dbcp description set.
 */
export async function getDigitalTwinBaseDbcp(): Promise<any> {
  const digitaltwinDbcp = await dappBrowser.System
    .import(`digitaltwins.${ dappBrowser.getDomainName() }!ens`);

  return {
    author: '',
    dapp: digitaltwinDbcp.dapp,
    dbcpVersion: 2,
    description: '',
    name: '',
    version: '1.0.0',
  };
}

/**
 * Load the digitaltwin favorites for the current user.
 *
 * @param      {bcc.Runtime}  runtime  bcc runtime
 */
export async function loadFavorites(runtime: bcc.Runtime) {
  const favorites = await bcc.DigitalTwin.getFavorites(<any>runtime);

  // load dispatchers and merge the favorites with the favorite dispatchers
  const add = await favoriteAddDispatcher.getInstances(runtime);
  const remove = await favoriteRemoveDispatcher.getInstances(runtime);

  // add favorites directly
  add.forEach(instance => favorites.push(instance.data.address));
  // remove favorites
  remove.forEach(instance =>
    favorites.splice(favorites.indexOf(instance.data.address), 1));

  return favorites.reverse();
}
