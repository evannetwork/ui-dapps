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
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { utils } from '@evan.network/api-blockchain-core';
import axios from 'axios';


const dispatcher = new Dispatcher(
  `wallet.${dappBrowser.getDomainName()}`,
  'openChannelDispatcher',
  40 * 1000,
  '_wallet.dispatchers.open-channel',
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    const { runtime } = instance;

    runtime.payments.setChannelManager('0x1f49A10F38b7dfBD18597287a4880A611514F3Bf');

    // transform eve to gwei
    const eveToSend = runtime.web3.utils.toWei('1', 'ether');
    const createdChannel = await runtime.payments.openChannel(
      runtime.activeAccount,
      '0x81b1e7D90E54cf7Fa7bAF2b09587E0b046aB9611',
      eveToSend,
    );
    const proof = await runtime.payments.incrementBalanceAndSign(eveToSend);
    const result = await axios({
      method: 'POST',
      url: `http://localhost:8080/api/smart-agents/ipfs-payments/channel/confirm?proof=${proof.sig}&openBlockNumber=${createdChannel.block}`,
      headers: {
        Authorization: await utils.getSmartAgentAuthHeaders(runtime),
      },
    });

    console.dir(result);
  });

export default dispatcher;
