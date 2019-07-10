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

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';

import { notarySmartAgentAccountId } from '../identification';

const dispatcher = new Dispatcher(
  `organizations.${ dappBrowser.getDomainName() }`,
  'requestIdentificationDispatcher',
  40 * 1000,
  '_org.dispatchers.request-identification'
);

/**
 * creates a new keyexchange with a target account and stores it at the given alias
 *
 * @param      {any}     runtime    runtime object
 * @param      {string}  targetAcc  target keyExchange accountid
 * @param      {string}  alias      alias of the keyexchanged accountid
 */
async function doKeyExchange(runtime: any, targetAcc: string, alias: string) {
  const myAccountId = runtime.activeAccount;

  const profile = new bcc.Profile({
    accountId: targetAcc,
    contractLoader: runtime.contractLoader,
    dataContract: runtime.dataContract,
    defaultCryptoAlgo: 'aes',
    executor: runtime.executor,
    ipld: runtime.ipld,
    log: runtime.logger.log,
    nameResolver: runtime.nameResolver,
    rightsAndRoles: runtime.rightsAndRoles,
  });

  const targetPubKey = await profile.getPublicKey();
  const commKey = await runtime.keyExchange.generateCommKey();
  await runtime.keyExchange.sendInvite(targetAcc, targetPubKey, commKey, {});

  // add key to profile
  await runtime.profile.addContactKey(
    targetAcc,
    'commKey',
    commKey
  );
  await runtime.profile.addProfileKey(
    targetAcc, 'alias', alias
  );

  await runtime.profile.storeForAccount('addressBook');
}


dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    const runtime = instance.runtime;

    // check if key exchange with the smart agents exist
    if (!await runtime.profile.getContactKey(notarySmartAgentAccountId, 'commKey')) {
      await doKeyExchange(runtime, notarySmartAgentAccountId, 'Notary Smart Agent');
    }

    // create b-mail including an notaryVerificationRequest attachment
    await runtime.mailbox.sendMail({
      content: {
        from: runtime.activeAccount,
        to: notarySmartAgentAccountId,
        title: data.mail.title,
        body: data.mail.body,
        attachments: [{
          type: 'notaryVerificationRequest',
          ...data.requestData
        }]
      }
    }, runtime.activeAccount, notarySmartAgentAccountId);
  });

export default dispatcher;
