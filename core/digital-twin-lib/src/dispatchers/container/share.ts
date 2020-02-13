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
import { Container, ContainerShareConfig, ContainerOptions } from '@evan.network/api-blockchain-core';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

const dispatcher = new Dispatcher(
  `lib.digital-twin.${dappBrowser.getDomainName()}`,
  'containerShareDispatcher',
  40 * 1000,
  '_digital-twin-lib.dispatchers.container.share',
);

/**
 * Return a new container instances for a given runtime and container address.
 *
 * @return     {Container}  The container.
 */
const getContainer = (runtime, address): Container => new Container(runtime as ContainerOptions, {
  accountId: runtime.activeAccount,
  address,
});

/**
 * share the properties for single container
 *
 * @param runtime
 * @param data
 */
const updateSharings = async (runtime, data): Promise<void> => {
  if (!data.shareConfigs) {
    return;
  }

  await getContainer(runtime, data.address).shareProperties(data.shareConfigs);
};

/**
 * unshare the properties for single container
 *
 * @param runtime
 * @param data
 */
const updateUnsharings = async (runtime, data): Promise<void> => {
  if (!data.unshareConfigs) {
    return;
  }

  await getContainer(runtime, data.address).unshareProperties(data.unshareConfigs);
};

dispatcher
  // set new shared fields
  .step(async (instance: DispatcherInstance, data) => {
    const sharings = Array.isArray(data) ? data : [data];
    await Promise.all(sharings.map(async (toShare) => updateSharings(instance.runtime, toShare)));
  })
  // remove "un-shared" fields
  .step(async (instance: DispatcherInstance, data) => {
    const sharings = Array.isArray(data) ? data : [data];
    await Promise.all(sharings.map(async (toShare) => updateUnsharings(instance.runtime, toShare)));
  })
  // send b-mails
  .step(async (instance: DispatcherInstance, data) => {
    const sharingArr = Array.isArray(data) ? data : [data];

    await Promise.all(sharingArr.map(async (sharingData) => {
      if (sharingData.bMailContent || data.bMailContent) {
        await Promise.all(sharingData.shareConfigs.map(async (shareConfig: ContainerShareConfig) => {
          await instance.runtime.mailbox.sendMail(
            sharingData.bMailContent || data.bMailContent,
            instance.runtime.activeAccount,
            shareConfig.accountId,
          );
        }));
      }
    }));
  });

export default dispatcher;
