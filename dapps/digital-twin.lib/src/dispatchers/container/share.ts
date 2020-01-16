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
import { Container, ContainerShareConfig } from '@evan.network/api-blockchain-core';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

const dispatcher = new Dispatcher(
  `digital-twin.lib.${dappBrowser.getDomainName()}`,
  'containerShareDispatcher',
  40 * 1000,
  '_digital-twin-lib.dispatchers.container.share'
);

/**
 * Return a new container instances for a given runtime and container address.
 *
 * @return     {Container}  The container.
 */
const getContainer = (runtime, address) => {
  return new Container(<any>runtime, {
    accountId: runtime.activeAccount,
    address: address,
  });
};

/**
 * share the properties for single container
 *
 * @param runtime
 * @param data
 */
const updateSharings = (runtime, data) => {
  if (!data.shareConfigs) {
    return;
  }

  return getContainer(runtime, data.address).shareProperties(data.shareConfigs);
};

/**
 * unshare the properties for single container
 *
 * @param runtime
 * @param data
 */
const updateUnsharings = (runtime, data) => {
  if (!data.unshareConfigs) {
    return;
  }

  return getContainer(runtime, data.address).unshareProperties(data.unshareConfigs);
};

dispatcher
  // set new shared fields
  .step(async (instance: DispatcherInstance, data: any) => {
    const sharingArr = Array.isArray(data) ? data : [ data ];

    if (Array.isArray(data)) {
      await Promise.all(data.map(async (shareData: any) => {
        await updateSharings(instance.runtime, shareData);
      }));
    } else {
      await updateSharings(instance.runtime, data);
    }
  })
  // remove "un-shared" fields
  .step(async (instance: DispatcherInstance, data: any) => {
    const sharingArr = Array.isArray(data) ? data : [ data ];

    if (Array.isArray(data)) {
      await Promise.all(data.map(async (shareData: any) => {
        await updateUnsharings(instance.runtime, shareData);
      }));
    } else {
      await updateUnsharings(instance.runtime, data);
    }
  })
  // send b-mails
  .step(async (instance: DispatcherInstance, data: any) => {
    const sharingArr = Array.isArray(data) ? data : [ data ];

    await Promise.all(sharingArr.map(async (sharingData: any) => {
      if (sharingData.bMailContent || data.bMailContent) {
        await Promise.all(sharingData.shareConfigs.map(async (shareConfig: ContainerShareConfig) => {
          await instance.runtime.mailbox.sendMail(
            sharingData.bMailContent || data.bMailContent,
            instance.runtime.activeAccount,
            shareConfig.accountId
          );
        }));
      }
    }));
  });

export default dispatcher;
