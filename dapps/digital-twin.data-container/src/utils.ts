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
import { Dispatcher, DispatcherInstance, deepEqual } from '@evan.network/ui';
import { pluginDispatcher, pluginShareDispatcher } from './dispatchers/registry';

export const latestTwinKey = 'evan-last-digital-twins';
export const nullAddress = '0x0000000000000000000000000000000000000000';
export const containerFactory = '0x92DFbA8b3Fa31437dD6bd89eC0D09E30564c8D7d';
export const twinFactory = '0x278e86051105c7a0ABaf7d175447D03B0c536BA6';

/**
 * Copies and returns a runtime with the correct nameresolver for payable stuff.
 *
 * @param      {any}  runtime  vue instance or runtime
 */
export function getRuntime(runtime: any): bcc.Runtime {
  runtime = runtime.getRuntime ? runtime.getRuntime() : runtime;

  const nameResolverConfig = JSON.parse(JSON.stringify(dappBrowser.config.nameResolver));
  // set the custom ens contract address
  nameResolverConfig.ensAddress = '0xaeF6Cc6D8048fD1fbb443B32df8F00A07FA55224';
  nameResolverConfig.ensResolver = '0xfC382415126EB7b78C5c600B06f7111a117948F4';

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

  if (!address || address === 'create-plugin') {
    changed.saveDescription = true;
    changed.changed = true;
    changed.entriesToSave = Object.keys(newPlugin.properties).map(propertyKey => propertyKey);
  } else {
    const container = getContainer(runtime, address);
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


/**
 * Return my plugins and merge them with current running dispatchers.
 *
 * @param      {bccRuntime}  runtime  bcc runtime
 */
export async function getMyPlugins(runtime: bcc.Runtime) {
  const plugins: any = await bcc.Container.getContainerPlugins(runtime.profile);

  // watch for new and sharing containers
  const saving = await pluginDispatcher.getInstances(runtime);
  const sharing = await pluginShareDispatcher.getInstances(runtime);

  // apply saving plugins
  saving.forEach(instance => {
    // plugin gets updated
    if (instance.data.beforeName) {
      delete plugins[instance.data.beforeName];
    }

    plugins[instance.data.name] = {
      creating: !!instance.data.beforeName,
      description: instance.data.description,
      loading: true,
      template: instance.data.template,
    };
  });

  // show loading for shared containers
  sharing.forEach(instance => plugins[instance.data.name].loading = true);
  return plugins;
}
