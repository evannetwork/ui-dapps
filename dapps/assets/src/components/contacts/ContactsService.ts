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

import { Runtime, Profile } from '@evan.network/api-blockchain-core';
import InviteDispatcher from './InviteDispatcher';
import { Contact, ContactType, ContactFormData } from './ContactInterfaces';

export default class ContactsService {
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
    Object.keys(this.contacts.profile).forEach(async contact => {
      // filter out own account
      if (contact !== this.runtime.activeAccount) {
        const type = await this.getProfileType(contact);
        data.push({
          address: contact,
          alias: this.contacts.profile[contact].alias,
          createdAt: this.contacts.profile[contact].createdAt,
          isFavorite: this.contacts.profile[contact].isFavorite,
          icon: this.getIcon(type),
          type,
          updatedAt: this.contacts.profile[contact].updatedAt
        });
      }
    });
    return data;
  }

  async addContact(contactFormData: ContactFormData): Promise<void> {
    await InviteDispatcher.start(this.runtime, contactFormData);
  }

  async addFavorite(contact: Contact): Promise<void> {
    await this.runtime.profile.addProfileKey(
      contact.address,
      'isFavorite',
      'true'
    );

    await this.runtime.profile.storeForAccount(
      this.runtime.profile.treeLabels.addressBook
    );
  }

  async removeFavorite(contact: Contact): Promise<void> {
    await this.runtime.profile.addProfileKey(
      contact.address,
      'isFavorite',
      'false'
    );

    await this.runtime.profile.storeForAccount(
      this.runtime.profile.treeLabels.addressBook
    );
  }

  /**
   * Return corresponding icon for account type.
   * @param type Account type
   */
  private static getIcon(type: ContactType): string {
    switch (type) {
      case ContactType.USER:
        return 'mdi mdi-account-outline';
      case ContactType.COMPANY:
        return 'mdi mdi-domain';
      case ContactType.IOT_DEVICE:
        return 'mdi mdi-radio-tower';
      case ContactType.UNSHARED:
        return 'mdi mdi-help-circle-outline';
      default:
        return 'mdi mdi-help-circle-outline';
    }
  }

  /**
   * Try to get profile type if it's shared
   * @param accountId Account address
   */
  private async getProfileType(accountId: string): Promise<ContactType> {
    try {
      const otherProfile = new Profile({
        ...(this.runtime as any),
        profileOwner: accountId,
        accountId: this.runtime.activeAccount
      });

      const { profileType } = await otherProfile.getProfileProperty(
        'accountDetails'
      );
      return profileType;
    } catch (err) {
      return ContactType.UNSHARED;
    }
  }
}
