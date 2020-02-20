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

export class ContactsService {
  private contacts;

  private runtime: Runtime;

  constructor(runtime: Runtime) {
    this.runtime = runtime;
  }

  /**
   * Return well-formatted list of contacts
   */
  async getContacts(): Promise<Contact[]> {
    this.contacts = await this.runtime.profile.getAddressBook();

    const data: Contact[] = [];
    await Promise.all(Object.keys(this.contacts.profile).map(async (contactAddress) => {
      // filter out own account
      if (contactAddress !== this.runtime.activeAccount) {
        const type = await profileUtils.getProfileType(this.runtime, contactAddress);
        const isPending = ContactsService.isPending(this.contacts.profile[contactAddress]);
        let displayName;
        if (isPending) {
          // email address
          displayName = contactAddress;
        } else {
          // either shared name or hash address
          displayName = await profileUtils.getDisplayName(this.runtime, contactAddress);
        }
        data.push({
          address: contactAddress,
          alias: this.contacts.profile[contactAddress].alias,
          createdAt: this.contacts.profile[contactAddress].createdAt,
          displayName,
          icon: profileUtils.getProfileTypeIcon(type),
          isFavorite: this.contacts.profile[contactAddress].isFavorite,
          isPending,
          type,
          updatedAt: this.contacts.profile[contactAddress].updatedAt,
        });
      }
    }));
    return data;
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

interface AddressbookEntry {
  alias?: string;
  accountId?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
  isFavorite: string;
}
