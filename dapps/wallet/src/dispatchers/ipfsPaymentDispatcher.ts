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
import {
  utils, Runtime, Profile, ProfileOptions,
} from '@evan.network/api-blockchain-core';
import axios from 'axios';

import { getOpenChannels, getAgentUrl } from '../ipfs-utils';

const dispatcher = new Dispatcher(
  `wallet.${dappBrowser.getDomainName()}`,
  'ipfsPaymentDispatcher',
  40 * 1000,
  '_wallet.dispatchers.ipfs-payment-channel',
);

/**
 * Return a new bcc.Profile instance for a given accountId
 */
const getProfileForAccount = (runtime: Runtime, accountId: string): Profile => new Profile({
  ...(runtime as ProfileOptions),
  profileOwner: accountId,
  accountId,
});


dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    const { runtime } = instance;
    const eveToSend = runtime.web3.utils.toWei(data.eve, 'ether');
    const targetAgentAccount = runtime.environment === 'core'
      ? '0xD21EE2c93655581Ec1C0679c9A028247e9CC9eBB'
      : '0xAF176885bD81D5f6C76eeD23fadb1eb0e5Fe1b1F';
    const channelManager = await runtime.nameResolver.getAddress('payments.evan');
    runtime.payments.setChannelManager(channelManager);

    // check if the account has already a key exchange with the payment account
    const hasAgentExchangeKey = await runtime.profile.getContactKey(
      targetAgentAccount,
      'commKey',
    );

    if (!hasAgentExchangeKey) {
      const profile = getProfileForAccount(runtime, targetAgentAccount);
      const targetPubKey = await profile.getPublicKey();

      // generate new communication key and send to agent
      const commKey = await runtime.keyExchange.generateCommKey();
      await runtime.keyExchange.sendInvite(targetAgentAccount, targetPubKey, commKey, {});

      // add key to profile
      await runtime.profile.addContactKey(
        targetAgentAccount,
        'commKey',
        commKey,
      );
      await runtime.profile.addProfileKey(
        targetAgentAccount,
        'alias',
        'Storage Smart Agent',
      );
      await runtime.profile.addProfileKey(
        targetAgentAccount,
        'tags',
        'Smart Agent',
      );

      // at least store the key on the account
      await runtime.profile.storeForAccount(runtime.profile.treeLabels.addressBook);
    }

    const channels = await getOpenChannels(runtime);
    let proof;
    if (channels.length === 0) {
      channels.push(await runtime.payments.openChannel(
        runtime.activeAccount,
        targetAgentAccount,
        eveToSend,
      ));
      proof = await runtime.payments.incrementBalanceAndSign(eveToSend);
    } else {
      const [currentChannel] = channels;
      // prepare channel for top topUp
      const channel = currentChannel;
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
      url: `${getAgentUrl(runtime.environment)}/api/smart-agents/ipfs-payments/channel/confirm?proof=${proof.sig}&openBlockNumber=${channels[0].block}`,
      headers: {
        Authorization: await utils.getSmartAgentAuthHeaders(runtime),
      },
    });
  });

export default dispatcher;
