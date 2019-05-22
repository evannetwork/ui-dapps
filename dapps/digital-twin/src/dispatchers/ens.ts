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
import { Dispatcher, } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { utils } from '@evan.network/digitaltwin.lib';

const dispatcher = new Dispatcher(
  `digitaltwin.${ dappBrowser.getDomainName() }`,
  'ensDispatcher',
  40 * 1000,
  '_digitaltwins.dispatcher.create'
);

dispatcher
  .step(async (instance, data) => {
    const runtime = utils.getRuntime(instance.runtime);
    const splitAddr = data.ensAddress.split('.');
    const topLevelAdress = splitAddr.slice(splitAddr.length - 2, splitAddr.length)
      .join('.');

    // purchaser the ens address
    await runtime.nameResolver.claimAddress(
      topLevelAdress,
      instance.runtime.activeAccount,
      instance.runtime.activeAccount,
      await runtime.nameResolver.getPrice(topLevelAdress)
    );
  })
  .step(async (instance, data) => {
    // add the ens address to your favorites list
    await instance.runtime.profile.addBcContract('evan-ens-management', data.ensAddress, { });

    // store profile contracts
    await instance.runtime.profile.storeForAccount(instance.runtime.profile.treeLabels.contracts);
  });


export default dispatcher;
