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
import * as bcc from '@evan.network/api-blockchain-core';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

const dispatcher = new Dispatcher(
  `mailbox.${ dappBrowser.getDomainName() }`,
  'attachmentDispatcher',
  40 * 1000,
  '_mailbox.dispatcher.attachment'
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    const runtime = instance.runtime;
    if (data.attachment.type === 'commKey') {
      const privateKey = await runtime.profile.getContactKey(
        runtime.activeAccount,
        'dataKey'
      );
      const myPubKey = await runtime.profile.getPublicKey();
      runtime.keyExchange.setPublicKey(myPubKey, privateKey);

      let profile = new bcc.Profile({
        accountId: data.mail.from,
        contractLoader: runtime.profile.options.contractLoader,
        dataContract: runtime.profile.options.dataContract,
        defaultCryptoAlgo: 'aes',
        executor: runtime.profile.options.executor,
        ipld: runtime.profile.options.ipld,
        nameResolver: runtime.profile.options.nameResolver,
        rightsAndRoles: runtime.profile.options.rightsAndRoles,
      })
      const targetPubKey = await profile.getPublicKey();

      const commSecret = runtime.keyExchange.computeSecretKey(targetPubKey);

      const commKey = await runtime.keyExchange.decryptCommKey(data.attachment.key, commSecret.toString('hex'));
      await runtime.profile.addContactKey(data.mail.from, 'commKey', commKey.toString('utf-8'));
      await runtime.profile.addProfileKey(data.mail.from, 'alias', data.mail.fromAlias);
      await runtime.profile.storeForAccount(runtime.profile.treeLabels.addressBook);
    } else {
      // check if a specific store value was specified, if not, use the latest dbcp description
      let storeKey = data.attachment.storeKey || data.attachment.address;
      let storeValue = data.attachment.storeValue;
      if (!storeValue) {
        const contractDefinition = await runtime.description.getDescriptionFromContract(
          data.attachment.address,
          runtime.activeAccount
        );
        storeValue = contractDefinition.public;
      }
      await runtime.profile.addBcContract(data.attachment.bc || 'contracts', storeKey, storeValue);
      await runtime.profile.storeForAccount(runtime.profile.treeLabels.contracts);
    }
  });

export default dispatcher;
