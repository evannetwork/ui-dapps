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
import { Dispatcher, DispatcherInstance, agentUrl } from '@evan.network/ui';
import { utils } from '@evan.network/api-blockchain-core';
import axios from 'axios';

import { getOpenChannels } from '../ipfs-utils';

const dispatcher = new Dispatcher(
  `wallet.${dappBrowser.getDomainName()}`,
  'ipfsPaymentDispatcher',
  40 * 1000,
  '_wallet.dispatchers.ipfs-payment-channel',
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    const { runtime } = instance;
    const eveToSend = runtime.web3.utils.toWei(data.eve, 'ether');

    runtime.payments.setChannelManager('0x1f49A10F38b7dfBD18597287a4880A611514F3Bf');

    const channels = await getOpenChannels();
    let proof;
    if (channels.length === 0) {
      // transform eve to gwei
      channels.push(await runtime.payments.openChannel(
        runtime.activeAccount,
        '0x81b1e7D90E54cf7Fa7bAF2b09587E0b046aB9611',
        eveToSend,
      ));
      proof = await runtime.payments.incrementBalanceAndSign(eveToSend);
    } else {
      const [currentChannel] = channels;
      // prepare channel for top topUp
      const { channel } = currentChannel;
      channel.account = runtime.activeAccount;
      channel.proof = {
        balance: runtime.payments.toBigNumber('0'),
      };
      channel.block = channel.openBlockNumber;
      runtime.payments.setChannel(channel);
      await runtime.payments.topUpChannel(eveToSend);
      const eveBn = runtime.payments.toBigNumber(eveToSend).plus(channel.deposit);
      proof = await runtime.payments.incrementBalanceAndSign(eveBn);
    }

    await axios({
      method: 'POST',
      url: `${agentUrl}/api/smart-agents/ipfs-payments/channel/confirm?proof=${proof.sig}&openBlockNumber=${channels[0].block}`,
      headers: {
        Authorization: await utils.getSmartAgentAuthHeaders(runtime),
      },
    });
  });

export default dispatcher;
