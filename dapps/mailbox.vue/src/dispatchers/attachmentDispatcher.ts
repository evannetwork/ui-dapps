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
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

const dispatcher = new Dispatcher(
  `mailbox.vue.${dappBrowser.getDomainName()}`,
  'attachmentDispatcher',
  40 * 1000,
  '_mailbox.dispatcher.attachment',
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    const { runtime } = instance;
    if (data.attachment.type === 'commKey') {
      const privateKey = await runtime.profile.getContactKey(
        runtime.activeIdentity,
        'dataKey',
      );
      const myPubKey = await runtime.profile.getPublicKey();
      runtime.keyExchange.setPublicKey(myPubKey, privateKey);

      const profile = new bcc.Profile({
        accountId: data.mail.from,
        contractLoader: runtime.profile.options.contractLoader,
        dataContract: runtime.profile.options.dataContract,
        defaultCryptoAlgo: 'aes',
        executor: runtime.profile.options.executor,
        ipld: runtime.profile.options.ipld,
        nameResolver: runtime.profile.options.nameResolver,
        rightsAndRoles: runtime.profile.options.rightsAndRoles,
      });
      const targetPubKey = await profile.getPublicKey();

      const commSecret = runtime.keyExchange.computeSecretKey(targetPubKey);

      const commKey = await runtime.keyExchange.decryptCommKey(data.attachment.key, commSecret.toString('hex'));
      await runtime.profile.addContactKey(data.mail.from, 'commKey', commKey.toString('utf-8'));
      await runtime.profile.addProfileKey(data.mail.from, 'alias', data.mail.fromAlias);
      await runtime.profile.addProfileKey(data.mail.from, 'createdAt', new Date().toISOString());
      await runtime.profile.addProfileKey(data.mail.from, 'updatedAt', new Date().toISOString());

      // remove old account that includes fromMail
      if (data.mail.fromMail) {
        await runtime.profile.removeContact(data.mail.fromMail);
      }

      await runtime.profile.storeForAccount(runtime.profile.treeLabels.addressBook);
    } else if (data.attachment.type === 'identityAccess') {
      await runtime.profile.setIdentityAccess(data.mail.from, data.attachment.encryptionKey);
      await runtime.profile.storeForAccount(runtime.profile.treeLabels.addressBook);
    } else if (data.attachment.type === 'identityAccessRemove') {
      await runtime.profile.removeIdentityAccess(data.mail.from, data.attachment.address);
      await runtime.profile.storeForAccount(runtime.profile.treeLabels.addressBook);
    } else if (data.attachment.type === 'verifications') {
      // eslint-disable-next-line no-restricted-syntax
      for (const key of data.attachment.keys) {
        const { storeKey, storeValue } = key;
        // eslint-disable-next-line no-await-in-loop
        await runtime.profile.addBcContract(key.context || 'contracts', storeKey, storeValue);
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const verification of data.attachment.verifications) {
        // load nested verifications
        // eslint-disable-next-line no-await-in-loop
        const nestedVerification = await runtime.verifications.getNestedVerificationsV2(
          runtime.activeIdentity,
          verification,
          false,
        );

        // eslint-disable-next-line no-await-in-loop
        await runtime.verifications.confirmVerification(
          runtime.activeIdentity,
          runtime.activeIdentity,
          nestedVerification.verifications[0].details.id,
        );
      }

      await runtime.profile.storeForAccount(runtime.profile.treeLabels.contracts);
    } else {
      // check if a specific store value was specified, if not, use the latest dbcp description
      const storeKey = data.attachment.storeKey || data.attachment.address;
      const { storeValue } = data.attachment.storeValue;
      if (!storeValue) {
        const contractDefinition = await runtime.description.getDescriptionFromContract(
          data.attachment.address,
          runtime.activeIdentity,
        );
        storeValue = contractDefinition.public;
      }
      await runtime.profile.addBcContract(data.attachment.bc || 'contracts', storeKey, storeValue);
      await runtime.profile.storeForAccount(runtime.profile.treeLabels.contracts);
    }
  });

export default dispatcher;
