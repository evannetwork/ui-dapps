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

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { cloneDeep } from '@evan.network/ui';

import dispatchers from './dispatchers';

/**
 * Global constants
 */
export const containerFactory = '0x92DFbA8b3Fa31437dD6bd89eC0D09E30564c8D7d';
export const latestTwinsKey = 'evan-last-digital-twins';
export const nullAddress = '0x0000000000000000000000000000000000000000';
export const twinFactory = '0x278e86051105c7a0ABaf7d175447D03B0c536BA6';

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
 * Remove last opened twin from localStorage.
 *
 * @param      {string}  address  The address
 */
export function removeLastOpenedTwin(address: string) {
  if (address) {
    const lastTwins = getLastOpenedTwins();

    lastTwins.splice(lastTwins.indexOf(address), 1);
    window.localStorage[latestTwinsKey] = JSON.stringify(lastTwins.slice(0, 20));
  }
}

/**
 * Sends the 'dt-value-changed' event.
 */
export function enableDTSave() {
  window.dispatchEvent(new CustomEvent('dc-value-changed'));
}

/**
 * Return a new container instance
 *
 * @return     {bcc.Container}  The container.
 */
export function getContainer(runtime: bcc.Runtime, address: string): bcc.Container {
  return new bcc.Container(<any>runtime, {
    accountId: runtime.activeAccount,
    address: address,
    factoryAddress: containerFactory
  });
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
export async function getDataContainerBaseDbcp(description: any = { }): Promise<any> {
  const digitaltwinDbcp = await dappBrowser.System
    .import(`datacontainer.digitaltwin.${ dappBrowser.getDomainName() }!ens`);

  return {
    author: '',
    dapp: digitaltwinDbcp.dapp,
    dbcpVersion: 2,
    description: '',
    name: '',
    version: '1.0.0',
    ...description
  };
}

/**
 * Return the default digitaltwin config.
 */
export function getDigitalTwinConfig(
  runtime: bcc.Runtime,
  address: string,
  dbcp?: any
): bcc.DigitalTwinConfig {
  return {
    accountId: runtime.activeAccount,
    address: address,
    containerConfig: { accountId: runtime.activeAccount, },
    description: dbcp,
    factoryAddress: twinFactory,
  }
}

/**
 * Return the last opened digitaltwins that were persited in the localStorage.
 */
export function getLastOpenedTwins() {
  return JSON.parse(window.localStorage[latestTwinsKey] || '[ ]');
}

/**
 * Return my plugins and merge them with current running dispatchers.
 *
 * @param      {bccRuntime}  runtime  bcc runtime
 */
export async function getMyPlugins(runtime: bcc.Runtime) {
  const plugins: any = cloneDeep(
    bcc.lodash,
    await bcc.Container.getContainerPlugins(runtime.profile),
    true,
  );

  // watch for new and sharing containers
  const deleting = await dispatchers.dc.pluginRemoveDispatcher.getInstances(runtime);
  const saving = await dispatchers.dc.pluginDispatcher.getInstances(runtime);
  const sharing = await dispatchers.dc.pluginShareDispatcher.getInstances(runtime);

  // apply saving plugins
  saving.forEach(instance => {
    // plugin gets updated
    if (instance.data.beforeName) {
      delete plugins[instance.data.beforeName];
    }

    plugins[instance.data.description.name] = {
      creating: !instance.data.beforeName,
      description: instance.data.description,
      loading: true,
      template: instance.data.template,
    };
  });

  // show loading for shared containers
  sharing.forEach(instance => plugins[instance.data.name].loading = true);

  // remove deleted plugins
  deleting.forEach(instance => delete plugins[instance.data.name]);

  return plugins;
}

/**
 * Copies and returns a runtime with the correct nameresolver for payable stuff.
 *
 * @param      {any}  runtime  vue instance or runtime
 */
export function getRuntime(runtime: any): bcc.Runtime {
  runtime = runtime.getRuntime ? runtime.getRuntime() : runtime;

  const nameResolverConfig = cloneDeep(bcc.lodash, dappBrowser.config.nameResolver, true);
  // set the custom ens contract address
  nameResolverConfig.ensAddress = '0xaeF6Cc6D8048fD1fbb443B32df8F00A07FA55224';
  nameResolverConfig.ensResolver = '0xfC382415126EB7b78C5c600B06f7111a117948F4';

  // apply correct factory address
  nameResolverConfig.domains.containerFactory = containerFactory;

  // copy runtime and set the nameResolver
  const runtimeCopy = Object.assign({ }, runtime);
  runtimeCopy.nameResolver = new bcc.NameResolver({
    config: nameResolverConfig,
    contractLoader: runtime.contractLoader,
    executor: runtime.executor,
    web3: runtime.web3,
  });
  runtimeCopy.description.nameResolver = runtimeCopy.nameResolver;

  return runtimeCopy;
}

/**
 * Load the digitaltwin favorites for the current user.
 *
 * @param      {bcc.Runtime}  runtime  bcc runtime
 */
export async function loadTwinFavorites(runtime: bcc.Runtime) {
  const favorites = await bcc.DigitalTwin.getFavorites(<any>runtime);

  // load dispatchers and merge the favorites with the favorite dispatchers
  const add = await dispatchers.dt.favoriteAddDispatcher.getInstances(runtime);
  const remove = await dispatchers.dt.favoriteRemoveDispatcher.getInstances(runtime);

  // add favorites directly
  add.forEach(instance => favorites.push(instance.data.address));
  // remove favorites
  remove.forEach(instance =>
    favorites.splice(favorites.indexOf(instance.data.address), 1));

  return favorites.reverse();
}

