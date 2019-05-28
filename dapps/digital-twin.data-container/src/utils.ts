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
import * as dtLib from '@evan.network/digitaltwin.lib';
import { Dispatcher, DispatcherInstance, deepEqual } from '@evan.network/ui';

import ContainerCache from './container-cache';
import { pluginDispatcher, pluginShareDispatcher } from './dispatchers/registry';
import { utils } from '@evan.network/digitaltwin.lib';

/**
 * Load the digital twin address for a opened data container / plugin.
 *
 * @param      {any}  dapp    dapp routing information
 */
export function getDtAddressFromUrl(dapp: any) {
  const splitHash = dapp.baseHash.split('/');
  const twinDAppIndex = splitHash.indexOf(`digitaltwin.${ dapp.domainName }`);
  let digitalTwinAddress;
  if (twinDAppIndex !== -1) {
    digitalTwinAddress = splitHash[twinDAppIndex + 1];
  }

  return digitalTwinAddress;
}

/**
 * watch for container or plugin updates
 *
 * @param      {bccRuntime}  runtime           The runtime
 * @param      {string}      containerAddress  The container address
 */
export function watchForUpdates(
  runtime: bcc.Runtime,
  containerAddress: string,
  callback: any,
) {
  const containerCache = new ContainerCache(runtime.activeAccount);
  return containerCache.watch(containerAddress, callback);
}

/**
 * Returns the plugin definition for a container or plugin.
 *
 * @param      {bccRuntime}  runtime           bcc runtime
 * @param      {string}      containerAddress  container address / plugin name
 */
export async function getContainerOrPlugin(
  runtime: bcc.Runtime,
  containerAddress: string,
  includeValue = false
) {
  const containerCache = new ContainerCache(runtime.activeAccount);
  const cached = await containerCache.get(containerAddress);
  let plugin;

  // return cached template
  if (cached) {
    plugin = cached;
  // if it's a contract, load the contract
  } else if (containerAddress.startsWith('0x')) {
    // get the container instance and load the template including all values
    const container = utils.getContainer(<any>runtime, containerAddress);
    plugin = await container.toPlugin(includeValue);
  // else try to laod a plugin from profile
  } else {
    plugin = await bcc.Container.getContainerPlugin(runtime.profile,
      containerAddress);
  }

  return plugin;
}

/**
 * Check the integrity of a new template, and if anything has changed
 *
 * @param      {bccRuntime}  runtime      bcc runtime
 * @param      {string}      address      data container address
 * @param      {any}         newPlugin    new template definition that should be checked
 */
export async function getEntryChanges(runtime: bcc.Runtime, address: string, newPlugin: any) {
  // analyse data and check, which data fields must be saved
  const changed = {
    saveDescription: false,
    entriesToSave: [ ],
    toShare: { },
    changed: false
  };

  if (!address || address === 'plugin-create') {
    changed.saveDescription = true;
    changed.changed = true;
    changed.entriesToSave = Object.keys(newPlugin.properties).map(propertyKey => propertyKey);
  } else {
    const container = dtLib.getContainer(runtime, address);
    const description = await container.getDescription();
    const plugin = await container.toPlugin(true);
    const template = plugin.template;

    // check for integrity
    Object.keys(newPlugin.properties).map((propertyKey: string) => {
      const newProp = newPlugin.properties[propertyKey];
      const originProp: any = template.properties[propertyKey] || { };

      if (typeof newProp.value !== 'undefined') {
        // schema has been changed
        if (!deepEqual(originProp.dataSchema, newProp.dataSchema)) {
          changed.saveDescription = true;
          changed.changed = true;
        }

        // if it's not an entry, check for value equality
        // if it's an list, check if new values were added
        if ((newProp.type !== 'list' && !deepEqual(originProp.value, newProp.value)) ||
            (newProp.type === 'list' && newProp.value && newProp.value.length > 0)) {
          changed.entriesToSave.push(propertyKey);
          changed.changed = true;
        }
      }
    });
  }

  return changed;
}

