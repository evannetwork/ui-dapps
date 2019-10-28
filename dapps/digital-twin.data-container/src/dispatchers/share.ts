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
import * as bcc from '@evan.network/api-blockchain-core';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { utils } from '@evan.network/digitaltwin.lib';


const dispatcher = new Dispatcher(
  `datacontainer.digitaltwin.${ dappBrowser.getDomainName() }`,
  'shareDispatcher',
  40 * 1000,
  '_datacontainer.dispatcher.share'
);

/**
 * share the properties for single container
 *
 * @param runtime
 * @param data
 */
const updateSharings = (runtime, data) => {
  return utils
    .getContainer(runtime, data.address)
    .shareProperties(data.shareConfigs);
};

/**
 * unshare the properties for single container
 *
 * @param runtime
 * @param data
 */
const updateUnsharings = (runtime, data) => {
  return utils
    .getContainer(runtime, data.address)
    .unshareProperties(data.unshareConfigs);
};

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    if (!data.unshareConfigs) {
      return;
    }

    // set the digital twin instance
    const runtime = utils.getRuntime(instance.runtime);

    if (Array.isArray(data.unshareConfigs)) {
      await Promise.all(data.unshareConfigs.map(async (unshareData: any) => {
        await updateUnsharings(runtime, unshareData);
      }));

      return;
    }

    await updateUnsharings(runtime, data.unshareConfigs);
  })
  .step(async (instance: DispatcherInstance, data: any) => {
    if (!data.shareConfigs) {
      return;
    }

    // set the digital twin instance
    const runtime = utils.getRuntime(instance.runtime);

    if (Array.isArray(data.shareConfigs)) {
      await Promise.all(data.shareConfigs.map(async (shareData: any) => {
        await updateSharings(runtime, shareData);
      }));

      return;
    }

    await updateSharings(runtime, data.shareConfigs);
  })
  // send b-mails
  .step(async (instance: DispatcherInstance, data: any) => {
    // do not sent bMail for multi container sharing
    if (data.bMailContent) {
      const runtime = utils.getRuntime(instance.runtime);

      await Promise.all(data.shareConfigs.map(async (shareConfig: bcc.ContainerShareConfig) => {
        await runtime.mailbox.sendMail(
          data.bMailContent,
          runtime.activeAccount,
          shareConfig.accountId
        );
      }));
    }
  });

export default dispatcher;
