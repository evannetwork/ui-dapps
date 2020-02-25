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

import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { getDomainName } from '@evan.network/ui-dapp-browser';
import { Contact } from './ContactInterfaces';

const updateContactDispatcher = new Dispatcher(
  `assets.${getDomainName()}`,
  'updateContactDispatcher',
  40 * 1000,
  '_assets.dispatcher.update-contact',
);

updateContactDispatcher
  .step(async (instance: DispatcherInstance, updatedContact: Contact) => {
    const { runtime } = instance;

    // ensure latest addressbook is loaded
    await runtime.profile.loadForAccount(runtime.profile.treeLabels.addressBook);

    // update the contact details
    await runtime.profile.addProfileKey(
      updatedContact.address,
      'alias',
      updatedContact.alias,
    );

    // save the account
    await runtime.profile.storeForAccount(runtime.profile.treeLabels.addressBook);
  });

export default updateContactDispatcher;
