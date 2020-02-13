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

// reduces amount of alias requests directly one after another
export const aliasCache = { };

/**
 * Returns the users alias, depending on it's profile type. If it's an old profile, resolve alias
 * from address book.
 *
 * @param      {Runtime}  runtime         runtime of the user that wants to load the alias
 * @param      {string}   accountId       address of the user that should be loaded
 * @param      {any}      accountDetails  already laoded accountDetails, to prevent duplicated
 *                                        loading
 */
export async function getUserAlias(
  runtime: Runtime,
  accountId: string = runtime.activeAccount,
  accountDetails?: any,
): Promise<string> {
  const cacheID = `${runtime.activeAccount}.${accountId}`;

  if (!aliasCache[cacheID]) {
    aliasCache[cacheID] = (async () => {
      const otherProfile = new Profile({
        ...(runtime as any),
        profileOwner: accountId,
        accountId: runtime.activeAccount,
      });
      let details = { ...accountDetails };

      try {
        details = cloneDeep(lodash, await otherProfile.getProfileProperty('accountDetails') || { });
      } catch (ex) {
        // no permissions
      }

      // load alias from addressbook, when it's not available
      if (details && details.accountName) {
        return details.accountName;
      }

      const addressBook = await runtime.profile.getAddressBook();
      const contact = addressBook.profile[accountId];

      return contact ? contact.alias : accountId;
    })();

    // reset alias cache after 10 seconds
    setTimeout(() => {
      delete aliasCache[cacheID];
    }, 10 * 1000);
  }

  return aliasCache[cacheID];
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
