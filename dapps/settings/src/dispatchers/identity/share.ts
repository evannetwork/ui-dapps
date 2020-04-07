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

import { IdentityAccessContact } from '../../interfaces';

const dispatcher = new Dispatcher(
  `settings.${dappBrowser.getDomainName()}`,
  'identityShareDispatcher',
  40 * 1000,
  '_settings.identity.dispatcher.share',
);

dispatcher
  .step(async (
    instance: DispatcherInstance,
    { contact, bmail }: { contact: IdentityAccessContact; bmail: any },
  ) => {
    const { profile } = instance.runtime;
    const { address, note, hasIdentityAccess } = contact;

    await Promise.all([
      // add "cosmetic" profile keys
      profile.addProfileKey(address, 'hasIdentityAccess', hasIdentityAccess as string),
      profile.addProfileKey(address, 'identityAccessGranted', Date.now().toString()),
      profile.addProfileKey(address, 'identityAccessNote', note),
      // send the b-mail to the invited user
      instance.runtime.mailbox.sendMail(bmail, instance.runtime.activeIdentity, address),
      // (() => {
      //   if (hasIdentityAccess === 'write') {

      //   }
      // })(),
    ]);
  });

export default dispatcher;
