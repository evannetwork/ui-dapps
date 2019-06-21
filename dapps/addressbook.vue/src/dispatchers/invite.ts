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


const dispatcher = new Dispatcher(
  `addressbook.vue.${ dappBrowser.getDomainName() }`,
  'inviteDispatcher',
  40 * 1000,
  '_addressbook.dispatcher.invite'
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    // check if mail smart agent was key exchanged
    if (data.emailInvite) {
      const runtime = instance.runtime;
      const smartAgentAccountId = '0x063fB42cCe4CA5448D69b4418cb89E663E71A139';

      // get mail smart agent contact key
      const smartAgentCommKey = await runtime.profile.getContactKey(
        smartAgentAccountId,
        'commKey',
      );

      // if the user hasn't added the smart agent, add it to the contacts
      if (!smartAgentCommKey) {
        const targetPubKey = await runtime.profile.getPublicKey();
        const commKey = await runtime.keyExchange.generateCommKey();
        await runtime.keyExchange.sendInvite(smartAgentAccountId, targetPubKey, commKey, {});

        // add key to profile
        await runtime.profile.addContactKey(
          smartAgentAccountId,
          'commKey',
          commKey
        );
        await runtime.profile.addProfileKey(
          smartAgentAccountId, 'alias', 'Email Smart Agent'
        );
        await runtime.profile.addProfileKey(
          smartAgentAccountId, 'tags', 'Smart Agent'
        );

        await runtime.profile.storeForAccount(runtime.profile.treeLabels.addressBook);
      }
    }
  })
  .step(async (instance: DispatcherInstance, data: any) => {
    const runtime = instance.runtime;
    const accountId = data.accountId || data.email;

    // ensure latest addressbook is loaded
    await runtime.profile.loadForAccount(runtime.profile.treeLabels.contracts);

    // send email invitation
    if (data.emailInvite) {
      let eve = (data.eve || 0).toString();

      await runtime.onboarding.sendInvitation(
        {
          to: data.email,
          subject: data.msgTitle,
          body: data.msgBody,
          fromAlias: data.fromAlias,
          lang: data.currLang
        },
        runtime.web3.utils.toWei(eve)
      );
    } else {
      // generate communication keys
      const targetPubKey = await runtime.profile.getPublicKey();
      const commKey = await runtime.keyExchange.generateCommKey();
      await runtime.keyExchange.sendInvite(accountId, targetPubKey, commKey, {
        fromAlias: data.fromAlias,
        title: data.msgTitle,
        body: data.msgBody
      });

      // add key to profile
      await runtime.profile.addContactKey(
        accountId,
        'commKey',
        commKey
      );
    }

    // update the contact details
    await Promise.all([ 'alias', 'accountId', 'email', 'tags', ]
      .map(profileKey => runtime.profile.addProfileKey(
        data.accountId || data.email,
        profileKey,
        data[profileKey]
      )
    ));

    // save the account
    await runtime.profile.storeForAccount(runtime.profile.treeLabels.addressBook);
  });

export default dispatcher;
