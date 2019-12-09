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

export interface Contact {
  alias: string;
  address: string;
  icon: string;
  created: string;
  updated: string;
  favorite: boolean;
  type: ContactType;
}

enum ContactType {
  USER = 'user',
  IOT_DEVICE = 'iot-device',
  COMPANY = 'company',
  UNSHARED = 'unshared'
}

export class ContactsService {
  private contacts;
  private runtime;

  constructor(runtime) {
    this.runtime = runtime;
  }

  async getContacts(): Promise<Contact[]> {
    this.contacts = JSON.parse(
      JSON.stringify(await this.runtime.profile.getAddressBook())
    );

    let data: Contact[] = [];
    Object.keys(this.contacts.profile).forEach(async contact => {
      const type = await this.getProfileType(contact);
      data.push({
        alias: this.contacts.profile[contact].alias,
        address: contact,
        icon: this.getIcon(type),
        created: new Date().toLocaleString(),
        updated: new Date().toLocaleString(),
        favorite: true,
        type: type
      });
    });
    return data;
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
        ...this.runtime,
        accountId
      });
      const { profileType } = await otherProfile.getProfileProperty(
        'accountDetails'
      );
      return profileType;
    } catch (err) {
      console.log(err);
      return ContactType.UNSHARED;
    }
  }
}
