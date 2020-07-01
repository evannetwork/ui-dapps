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


const dispatcher = new Dispatcher(
  `profile.vue.${dappBrowser.getDomainName()}`,
  'sendEveDispatcher',
  40 * 1000,
  '_wallet.dispatchers.send-eve',
);

dispatcher
  .step(async (instance: DispatcherInstance, data: any) => {
    const { runtime } = instance;

    // if the user selects a identity to send eve to, load the owner of this identity and sent the
    // eve to this user
    let toAccount = data.accountId;
    const toIsIdentity = await runtime.verifications.isIdentity(toAccount);
    if (toIsIdentity) {
      toAccount = await runtime.verifications.getOwnerAddressForIdentity(toAccount);
    }

    await runtime.executor.executeSend({
      from: runtime.activeIdentity,
      to: toAccount,
      value: runtime.web3.utils.toWei(data.amount.toString(), 'ether'),
    });
  });

export default dispatcher;
