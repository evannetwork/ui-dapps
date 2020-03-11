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


import {
  Profile, lodash, Runtime, ProfileOptions,
} from '@evan.network/api-blockchain-core';
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
  identity: string = runtime.activeIdentity,
  accountDetails?: any,
): Promise<string> {
  const cacheID = `${runtime.activeAccount}.${identity}`;

  if (!aliasCache[cacheID]) {
    aliasCache[cacheID] = (async (): Promise<void> => {
      const otherProfile = new Profile({
        ...(runtime as ProfileOptions),
        profileOwner: identity,
        accountId: runtime.activeIdentity,
      });
      let details = { ...accountDetails };

      try {
        details = cloneDeep(lodash, await otherProfile.getProfileProperty('accountDetails') || { });
      } catch (ex) {
        // no permissions
      }

      // load alias from addressbook, when it's not available
      if (details?.accountName) {
        return details.accountName;
      }

      const addressBook = await runtime.profile.getAddressBook();
      const contact = addressBook.profile[identity];

      return contact ? contact.alias : identity;
    })();

    // reset alias cache after 10 seconds
    setTimeout(() => {
      delete aliasCache[cacheID];
    }, 10 * 1000);
  }

  return aliasCache[cacheID];
}

/**
 * Display the shared profile name if possible. If not, display the hash address.
 * @param runtime Runtime
 * @param address hash address of the profile
 */
export async function getDisplayName(runtime: Runtime, address: string): Promise<string> {
  const otherProfile = new Profile({
    ...(runtime as ProfileOptions),
    profileOwner: address,
    accountId: runtime.activeAccount,
  });
  let details;
  try {
    details = await otherProfile.getProfileProperty('accountDetails');
  } catch (ex) {
    // no permissions
  }

  return details?.accountName || address;
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
      accountId: runtime.activeIdentity,
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
      return 'mdi mdi-cube-outline';
    default:
      return 'mdi mdi-cube-outline';
  }
}

/**
 * Returns all contacts from current user addressbook
 *
 * @param      {any}      runtime     The runtime
 * @param      {boolean}  unfiltered  default "false", if true response containing own contact and
 *                                    test entries, as well.
 */
export async function getContacts(
  runtime: any,
  unfiltered = false,
): Promise<{label: string; value: string}[]> {
  // load the contacts for the current user, so we can display correct contact alias
  const { profile: addressBook } = await runtime.profile.getAddressBook();

  const contacts = Object.keys(addressBook).map((key) => ({
    label: addressBook[key].alias,
    value: key,
  }));

  if (unfiltered) {
    return contacts;
  }

  return contacts
    .filter((entry) => entry.value !== runtime.activeAccount
      && entry.value !== runtime.activeIdentity
      && !/@/.test(entry.value));
}
