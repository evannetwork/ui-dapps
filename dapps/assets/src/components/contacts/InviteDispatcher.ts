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

export const dispatcher = new Dispatcher(
  `assets.${dappBrowser.getDomainName()}`,
  'inviteDispatcher',
  40 * 1000,
  '_assets.contacts.invite-dispatcher',
);

/**
 * Return a new bcc.Profile instance for a given accountId.
 *
 * @return     {bcc.Runtime}  profile for account
 */
const getProfileForAccount = (runtime: bcc.Runtime, accountId: string) => new bcc.Profile({
  ...(runtime as any), // TODO: Fix runtime interface
  profileOwner: accountId,
  accountId,
});

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    // check if mail smart agent was key exchanged
    if (data.emailInvite) {
      const { runtime } = instance;
      const smartAgentAccountId = '0x063fB42cCe4CA5448D69b4418cb89E663E71A139';

      // get mail smart agent contact key
      const smartAgentCommKey = await runtime.profile.getContactKey(
        smartAgentAccountId,
        'commKey',
      );

      // if the user hasn't added the smart agent, add it to the contacts
      if (!smartAgentCommKey) {
        const targetPubKey = await getProfileForAccount(
          runtime,
          smartAgentAccountId,
        ).getPublicKey();
        const commKey = await runtime.keyExchange.generateCommKey();
        await runtime.keyExchange.sendInvite(
          smartAgentAccountId,
          targetPubKey,
          commKey,
          {},
        );

        // add key to profile
        await runtime.profile.addContactKey(
          smartAgentAccountId,
          'commKey',
          commKey,
        );
        await runtime.profile.addProfileKey(
          smartAgentAccountId,
          'alias',
          'Email Smart Agent',
        );
        await runtime.profile.addProfileKey(
          smartAgentAccountId,
          'tags',
          'Smart Agent',
        );
        await runtime.profile.storeForAccount(
          runtime.profile.treeLabels.addressBook,
        );
      }
    }
  })
  .step(async (instance: DispatcherInstance, data: any) => {
    const { runtime } = instance;
    const accountId = data.accountId || data.email;

    // ensure latest addressbook is loaded
    await runtime.profile.loadForAccount(
      runtime.profile.treeLabels.addressBook,
    );

    // send email invitation
    if (data.emailInvite) {
      await runtime.onboarding.sendInvitation(
        {
          to: accountId,
          subject: data.msgTitle,
          body: data.msgBody,
          fromAlias: data.fromAlias,
          lang: data.currLang,
        },
        runtime.web3.utils.toWei('0'),
      );
    } else {
      // generate communication keys
      const targetPubKey = await getProfileForAccount(
        runtime,
        accountId,
      ).getPublicKey();
      const commKey = await runtime.keyExchange.generateCommKey();
      await runtime.keyExchange.sendInvite(accountId, targetPubKey, commKey, {
        fromAlias: data.fromAlias,
        title: data.msgTitle,
        body: data.msgBody,
      });

      // add key to profile
      await runtime.profile.addContactKey(accountId, 'commKey', commKey);
    }

    // aggregate the contact details
    await Promise.all(
      [
        'alias',
        'accountId',
        'email',
        'createdAt',
        'updatedAt',
        'isFavorite',
      ].map((profileKey) => runtime.profile.addProfileKey(accountId, profileKey, data[profileKey])),
    );

    // save for the account
    await runtime.profile.storeForAccount(
      runtime.profile.treeLabels.addressBook,
    );
  });

export default dispatcher;
