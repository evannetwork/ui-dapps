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
  const addressBook = (await runtime.profile.getAddressBook()).profile;

  const contacts = Object.keys(addressBook).map((key) => ({
    label: addressBook[key].alias,
    value: key,
  }));

  if (unfiltered) {
    return contacts;
  }

  return contacts.filter((entry) => entry.value !== runtime.activeAccount && !/@/.test(entry.value));
}

export { getUserAlias } from './profileUtils';
