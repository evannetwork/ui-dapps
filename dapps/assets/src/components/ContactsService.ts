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

export interface Contact {
  alias: string;
  adress: string;
  icon: string;
  created: string;
  updated: string;
  favorite: boolean;
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
    Object.keys(this.contacts.profile).forEach(contact => {
      data.push({
        alias: this.contacts.profile[contact].alias,
        adress: contact,
        icon: 'mdi mdi-account-outline',
        created: new Date().toLocaleString(),
        updated: new Date().toLocaleString(),
        favorite: true
      });
    });
    return data;
  }
}
