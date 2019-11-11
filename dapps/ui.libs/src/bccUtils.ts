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
import { cloneDeep } from './utils';

/**
 * Returns the users alias, depending on it's profile type. If it's an old profile, resolve alias
 * from address book.
 *
 * @param      {bccProfile}  profile         profile to load the data for
 * @param      {any}         accountDetails  already laoded accountDetails, to prevent duplicated
 *                                           loading
 * @param      {any}         registration    company registration data, to prevent duplicated data
 *                                           loading
 */
export async function getUserAlias(profile: bcc.Profile, accountDetails?: any, registration?: any) {
  try {
    accountDetails = cloneDeep(
      bcc.lodash,
      accountDetails || await profile.getProfileProperty('accountDetails') || { }
    );

    // for companies load directly the company name and disable edit mode
    if (accountDetails.profileType === 'company') {
      registration = registration || (await profile.getProfileProperty('registration'));
      accountDetails.accountName = registration.company;
    }
  } catch (ex) { }

  // load alias from addressbook, when it's not available
  if (accountDetails && accountDetails.accountName) {
    return accountDetails.accountName;
  } else {
    // load addressbook info
    const myProfile = new bcc.Profile({
      ...profile.options,
      profileOwner: profile.activeAccount,
      accountId: profile.activeAccount,
    });
    const addressBook = await myProfile.getAddressBook();
    const contact = addressBook.profile[myProfile.profileOwner];

    return contact ? contact.alias : myProfile.profileOwner;
  }
}
