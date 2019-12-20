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
import InviteDispatcher from './InviteDispatcher';

export interface Contact {
  address: string;
  alias: string;
  createdAt: string;
  isFavorite: string;
  icon: string;
  type: ContactType;
  updatedAt: string;
}

enum ContactType {
  COMPANY = 'company',
  IOT_DEVICE = 'device',
  USER = 'user',
  UNSHARED = 'unshared'
}

export class ContactsService {
  private contacts;
  private runtime: bcc.Runtime;

  constructor(runtime) {
    this.runtime = runtime;
  }

  async getContacts(): Promise<Contact[]> {
    this.contacts = await this.runtime.profile.getAddressBook();

    let data: Contact[] = [];
    Object.keys(this.contacts.profile).forEach(async contact => {
      const type = await this.getProfileType(contact);
      // filter out own account
      if (contact != this.runtime.activeAccount) {
        data.push({
          address: contact,
          alias: this.contacts.profile[contact].alias,
          createdAt: this.contacts.profile[contact].createdAt,
          isFavorite: this.contacts.profile[contact].isFavorite,
          icon: this.getIcon(type),
          type: type,
          updatedAt: this.contacts.profile[contact].updatedAt
        });
      }
    });
    return data;
  }

  async addContact(contactFormData) {
    await InviteDispatcher.start(this.runtime, contactFormData);
  }

  async addFavorite(contact): Promise<void> {
    await this.runtime.profile.addProfileKey(
      contact.address,
      'isFavorite',
      'true'
    );

    await this.runtime.profile.storeForAccount(
      this.runtime.profile.treeLabels.addressBook
    );
  }

  async removeFavorite(contact): Promise<void> {
    await this.runtime.profile.addProfileKey(
      contact.address,
      'isFavorite',
      'false'
    );

    await this.runtime.profile.storeForAccount(
      this.runtime.profile.treeLabels.addressBook
    );    
  }

  private getIcon(type: ContactType): string {
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

  private async getProfileType(accountId: string): Promise<ContactType> {
    try {
      const otherProfile = new bcc.Profile({
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
