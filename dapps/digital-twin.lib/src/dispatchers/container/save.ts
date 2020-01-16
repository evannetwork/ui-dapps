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

import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { Container, ContainerOptions, lodash } from '@evan.network/api-blockchain-core';
import { Dispatcher, DispatcherInstance, cloneDeep } from '@evan.network/ui';

const dispatcher = new Dispatcher(
  `lib.digital-twin.${ dappBrowser.getDomainName() }`,
  'containerSaveDispatcher',
  40 * 1000,
  '_digital-twin-lib.dispatchers.container.save'
);

dispatcher
  .startup(async (instance: DispatcherInstance, data: any) => {
    // be able to save already saved entries to indexedDB, so we will not save duplicated on errors
    data.entriesToSave = data.entriesToSave || Object.keys(data.value);
  })
  .step(async (instance: DispatcherInstance, data: any) => {
    const container = new Container(instance.runtime as ContainerOptions, data.address);
    const { template } = await container.toPlugin();

    // copy the entries to save, so the iteration will not be affected by removing entries to save
    // from the data object => entries will be removed and the data will be persisted, after the
    // synchronization of this entry was saved successful, so the user won't do this twice
    const entriesToSave = cloneDeep(lodash, data.entriesToSave, true);
    await Promise.all(entriesToSave.map(async (entryKey: string, index: number) => {
      if (template.properties[entryKey].type === 'list') {
        await container.addListEntries(entryKey, data.value);
      } else {
        await container.setEntry(entryKey, data.value);
      }

      // remove the list entry and persist the state into the indexeddb
      data.entriesToSave.splice(index, 1);
      await instance.save();
    }));
  });

export default dispatcher;
