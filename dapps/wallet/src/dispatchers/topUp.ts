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
  'topupChannelDispatcher',
  40 * 1000,
  '_wallet.dispatchers.open-channel',
);

interface TopUpChannelData {
  eve: string;
}

dispatcher
  .step(async (instance: DispatcherInstance, data: TopUpChannelData) => {
    const { runtime } = instance;

    // transform eve to gwei
    const eveToSend = runtime.web3.utils.toWei(data.eve, 'ether');
    const paymentChannelAddress = await runtime.nameResolver.getAddress('payments.evan');
    runtime.payments.setChannelManager(paymentChannelAddress);

    const agentUrl = runtime.environment === 'core'
      ? 'https://payments.evan.network'
      : 'https://payments.test.evan.network';

    // try get the last open channel, otherwise create a new one
    const availableChannels = await axios({
      method: 'POST',
      url: `${agentUrl}/api/smart-agents/ipfs-payments/channel/get`,
      headers: {
        Authorization: await utils.getSmartAgentAuthHeaders(runtime),
      },
    });

    const openChannel = availableChannels.data.channels.filter((chan) => chan.state === 'OPEN');
    let proof;
    let currentChannel;
    if (openChannel.length > 0) {
      // prepare channel for top topUp
      [currentChannel] = openChannel;
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
    } else {
      currentChannel = await runtime.payments.openChannel(
        runtime.activeAccount,
        '0x81b1e7D90E54cf7Fa7bAF2b09587E0b046aB9611',
        eveToSend,
      );
      proof = await runtime.payments.incrementBalanceAndSign(eveToSend);
    }

    await axios({
      method: 'POST',
      url: `${agentUrl}/api/smart-agents/ipfs-payments/channel/confirm?proof=${proof.sig}&openBlockNumber=${currentChannel.block}`,
      headers: {
        Authorization: await utils.getSmartAgentAuthHeaders(runtime),
      },
    });
  });

export default dispatcher;
