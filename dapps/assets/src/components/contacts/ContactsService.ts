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

import { profileUtils, DispatcherInstance } from '@evan.network/ui';
import { Runtime } from '@evan.network/api-blockchain-core';
import InviteDispatcher from './InviteDispatcher';
import { Contact, ContactFormData } from './ContactInterfaces';
import removeContactDispatcher from './RemoveContactDispatcher';

// TODO: Should come from runtime profile
interface AddressbookEntry {
  alias?: string;
  accountId?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
  isFavorite: string;
}

export class ContactsService {
  private runtime: Runtime;

  constructor(runtime: Runtime) {
    this.runtime = runtime;
  }

  /**
   * Return well-formatted list of contacts
   */
  async getContacts(): Promise<Contact[]> {
    const { profile }: { profile: AddressbookEntry } = await this.runtime.profile.getAddressBook();
    const contactKeys = Object.keys(profile).filter(
      (address) => address !== this.runtime.activeAccount && address !== this.runtime.activeIdentity,
    );

    return Promise.all(contactKeys.map(async (contactAddress: string) => {
      // filter out own account
      const type = await profileUtils.getProfileType(this.runtime, contactAddress);
      const isPending = ContactsService.isPending(profile[contactAddress]);
      let displayName;
      if (isPending) {
        // email address
        displayName = contactAddress;
      } else {
        // either shared name or hash address
        displayName = await profileUtils.getDisplayName(this.runtime, contactAddress);
      }

      return {
        address: contactAddress,
        alias: profile[contactAddress].alias,
        createdAt: profile[contactAddress].createdAt,
        displayName,
        icon: profileUtils.getProfileTypeIcon(type),
        isFavorite: profile[contactAddress].isFavorite,
        isPending,
        type,
        updatedAt: profile[contactAddress].updatedAt,
      };
    }));
  }

  async addContact(contactFormData: ContactFormData): Promise<void> {
    await InviteDispatcher.start(this.runtime, contactFormData);
  }

  async addFavorite(contact: Contact): Promise<void> {
    await this.runtime.profile.addProfileKey(
      contact.address,
      'isFavorite',
      'true',
    );

    await this.runtime.profile.storeForAccount(
      this.runtime.profile.treeLabels.addressBook,
    );
  }

  async removeFavorite(contact: Contact): Promise<void> {
    await this.runtime.profile.addProfileKey(
      contact.address,
      'isFavorite',
      'false',
    );

    await this.runtime.profile.storeForAccount(
      this.runtime.profile.treeLabels.addressBook,
    );
  }

  removeContact(contact: Contact): Promise<DispatcherInstance> {
    return removeContactDispatcher.start(this.runtime, contact);
  }

  static isPending(contact: AddressbookEntry): boolean {
    if (!contact.accountId && contact.email) {
      return true;
    }
    return false;
  }
}
