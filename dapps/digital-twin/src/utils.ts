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

import { utils } from '@evan.network/datacontainer.digitaltwin';
import { containerDispatchers, } from '@evan.network/datacontainer.digitaltwin';
import { favoriteAddDispatcher, favoriteRemoveDispatcher, } from './dispatchers/registy';

export const latestTwinsKey = 'evan-last-digital-digitaltwins';
export const nullAddress = '0x0000000000000000000000000000000000000000';
export const containerFactory = '0x92DFbA8b3Fa31437dD6bd89eC0D09E30564c8D7d';
export const twinFactory = '0x278e86051105c7a0ABaf7d175447D03B0c536BA6';
export const getRuntime = utils.getRuntime;

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
    window.localStorage[latestTwinsKey] = JSON.stringify(lastTwins.slice(0, 20));
  }
}

/**
 * Return the last opened digitaltwins that were persited in the localStorage.
 */
export function getLastOpenedTwins() {
  return JSON.parse(window.localStorage[latestTwinsKey] || '[ ]');
}

/**
 * Returns the active domain name (currently payable, until the nameresolve is fixed)
 *
 * @return     {string}  domain name (default evan)
 */
export function getDomainName(): string {
  return 'payable' || dappBrowser.getDomainName();
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
 * Return my templates and merge them with current running dispatchers.
 *
 * @param      {bccRuntime}  runtime  bcc runtime
 */
export async function getMyTemplates(runtime: bcc.Runtime) {
  const templates: any = await bcc.Container.getContainerTemplates(runtime.profile);

  // watch for new and sharing containers
  const saving = await containerDispatchers.templateDispatcher.getInstances(runtime);
  const sharing = await containerDispatchers.templateDispatcher.getInstances(runtime);

  // apply saving templates
  saving.forEach(instance => {
    // template gets updated
    if (instance.data.beforeName) {
      delete templates[instance.data.beforeName];
    }

    templates[instance.data.name] = {
      creating: !!instance.data.beforeName,
      description: {
        description: instance.data.description,
        img: instance.data.img,
        name: instance.data.name
      },
      loading: true,
      template: instance.data.template,
    };
  });

  // show loading for shared containers
  sharing.forEach(instance => {
    templates[instance.data.name].loading = true;
  });

  return templates;
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

  return favorites;
}
