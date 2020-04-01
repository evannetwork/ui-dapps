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

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

import { notarySmartAgentAccountId, verificationCost } from '../../components/verifications/notary/notary.lib';

const dispatcher = new Dispatcher(
  `profile.vue.${dappBrowser.getDomainName()}`,
  'requestIdentificationDispatcher',
  40 * 1000,
  '_profile.dispatchers.request-verification',
);

/**
 * creates a new keyexchange with a target account and stores it at the given alias
 *
 * @param      {any}     runtime    runtime object
 * @param      {string}  targetAcc  target keyExchange accountid
 * @param      {string}  alias      alias of the keyexchanged accountid
 */
async function doKeyExchange(runtime: any, targetAcc: string, alias: string) {
  const profile = new bcc.Profile({
    ...runtime,
    accountId: targetAcc,
    profileOwner: targetAcc,
  } as bcc.ProfileOptions);

  const targetPubKey = await profile.getPublicKey();
  const commKey = await runtime.keyExchange.generateCommKey();
  await runtime.keyExchange.sendInvite(targetAcc, targetPubKey, commKey, {});

  // add key to profile
  await runtime.profile.addContactKey(
    targetAcc,
    'commKey',
    commKey,
  );
  await runtime.profile.addProfileKey(
    targetAcc, 'alias', alias,
  );

  await runtime.profile.storeForAccount('addressBook');
}

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    const { runtime } = instance;

    // check if key exchange with the smart agents exist
    const hasKeyExchange = await runtime.profile.getContactKey(notarySmartAgentAccountId, 'commKey');
    if (!hasKeyExchange) {
      await doKeyExchange(runtime, notarySmartAgentAccountId, 'Notary Smart Agent');
    }

    // create b-mail including an notaryVerificationRequest attachment
    await runtime.mailbox.sendMail({
      content: {
        from: runtime.activeIdentity,
        to: notarySmartAgentAccountId,
        title: data.mail.title,
        body: data.mail.body,
        attachments: [{
          type: 'notaryVerificationRequest',
          ...data.requestData,
        }],
      },
    }, runtime.activeIdentity, notarySmartAgentAccountId, verificationCost);
  });

export default dispatcher;
