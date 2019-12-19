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
 * @param      {any}  dapp    Vue instance evan routing dapp definition
 */
export function getDtAddressFromUrl(dapp: any) {
  const splitHash = window.location.hash.split('/');
  const twinDAppIndex = splitHash.indexOf(`digitaltwin.${ dapp.domainName }`);
  let digitalTwinAddress;
  if (twinDAppIndex !== -1) {
    digitalTwinAddress = splitHash[twinDAppIndex + 1];
  }

  return digitalTwinAddress;
}

/**
 * Check the integrity of a new template, and if anything has changed
 *
 * @param      {bccRuntime}  runtime      bcc runtime
 * @param      {string}      address      data container address
 * @param      {any}         newPlugin    new template definition that should be checked
 */
export async function getEntryChanges(runtime: bcc.Runtime, address: string, template: any) {
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
    changed.entriesToSave = Object.keys(template.properties).map(propertyKey => propertyKey);
  } else {
    const container = dtLib.getContainer(runtime, address);
    const description = await container.getDescription();
    const originTemplate = (await container.toPlugin(true)).template;

    // check for integrity
    Object.keys(template.properties).map((propertyKey: string) => {
      const newProp = template.properties[propertyKey];
      const originProp: any = originTemplate.properties[propertyKey] || { };

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

