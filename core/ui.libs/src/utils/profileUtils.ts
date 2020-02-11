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


import { Profile, lodash, Runtime } from '@evan.network/api-blockchain-core';
import { cloneDeep } from './utils';

export enum ProfileType {
  COMPANY = 'company',
  IOT_DEVICE = 'device',
  USER = 'user',
  UNSHARED = 'unshared',
}

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
export async function getUserAlias(
  profile: Profile,
  accountDetails?: any,
  registration?: any,
): Promise<string> {
  let details = { ...accountDetails };

  try {
    details = cloneDeep(
      lodash,
      accountDetails || await profile.getProfileProperty('accountDetails') || { },
    );
  } catch (ex) {
    // no permissions
  }

  // load alias from addressbook, when it's not available
  if (details && details.accountName) {
    return details.accountName;
  }
  const { profileOwner } = profile;
  // load addressbook info
  const myProfile = new Profile({
    ...profile.options,
    profileOwner: profile.activeAccount,
    accountId: profile.activeAccount,
  });
  const addressBook = await myProfile.getAddressBook();
  const contact = addressBook.profile[profileOwner];

  return contact ? contact.alias : profileOwner;
}

/**
 * Creates a new blockchain-core profile instance with the given account id and resolves the alias
 * with the given runtime. (uses getUserAlias function)
 *
 * @param      {Runtime}  runtime    The runtime
 * @param      {string}   accountId  The account identifier
 */
export async function getUserAliasFromAddress(
  runtime: Runtime,
  accountId: string,
): Promise<string> {
  const otherProfile = new Profile({
    ...(runtime as any),
    profileOwner: accountId,
    accountId: runtime.activeAccount,
  });

  return getUserAlias(otherProfile);
}

/**
 * Try to get profile type if it's shared
 *
 * @param      {Runtime}  runtime    bcc runtime
 * @param      {string}   accountId  Account address
 */
export async function getProfileType(runtime: Runtime, accountId: string): Promise<ProfileType> {
  try {
    const otherProfile = new Profile({
      ...(runtime as any),
      profileOwner: accountId,
      accountId: runtime.activeAccount,
    });

    const { profileType } = await otherProfile.getProfileProperty(
      'accountDetails',
    );
    return profileType;
  } catch (err) {
    return ProfileType.UNSHARED;
  }
}

/**
 * Return corresponding icon for account type.
 *
 * @param      {string}  type    Account type
 * @return     {string}       profile  type material icon
 */
export function getProfileTypeIcon(type: string): string {
  switch (type) {
    case ProfileType.USER:
      return 'mdi mdi-account-outline';
    case ProfileType.COMPANY:
      return 'mdi mdi-office-building';
    case ProfileType.IOT_DEVICE:
      return 'mdi mdi-radio-tower';
    case ProfileType.UNSHARED:
      return 'mdi mdi-help-circle-outline';
    default:
      return 'mdi mdi-help-circle-outline';
  }
}
