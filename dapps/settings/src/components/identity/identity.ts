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

import Component, { mixins } from 'vue-class-component';
import { EvanComponent } from '@evan.network/ui-vue-core';
import { profileUtils } from '@evan.network/ui';
import { Runtime } from '@evan.network/api-blockchain-core';
import { session } from '@evan.network/ui-session';

import { Contact } from './interfaces';

@Component
export default class IdentitySettingsComponent extends mixins(EvanComponent) {
  /**
   * All contacts that have the profile key `identityAccess`
   */
  contacts: Contact[] = null;

  /**
   * Is the current user allowed to grant access?
   */
  enableAccessGranting = false;

  /**
   * Contacts that getting currently permissions
   */
  granting = { };

  /**
   * Show loading symbol until contacts were loaded.
   */
  loading = true;

  /**
   * Current session runtime for quick access
   */
  runtime: Runtime;

  /**
   * Table configuration
   */
  table = {
    columns: [
      {
        key: 'icon',
        label: '',
        sortable: false,
        thClass: 'th-icon',
      },
      {
        key: 'displayName',
        label: this.$t('_settings.identity.table.columns.name'),
        sortable: true,
        tdClass: 'truncate',
      },
      {
        key: 'note',
        label: this.$t('_settings.identity.table.columns.note'),
        sortable: true,
        tdClass: 'truncate',
      },
      {
        key: 'granted',
        label: this.$t('_settings.identity.table.columns.granted'),
        sortable: true,
        thClass: 'th-date',
      },
      {
        key: 'actions',
        label: '',
        sortable: false,
        thClass: 'th-icon',
        tdClass: 'td-multi-icon',
      },
    ],
    filterBy: [
      'address',
      'alias',
      'displayName',
      'note',
    ],
    filter: '',
  }

  /**
   * Load initial data
   */
  async created(): Promise<void> {
    this.runtime = session.identityRuntime;
    this.contacts = await this.getPermittedContacts();
    this.loading = false;
  }

  /**
   * Load all contacts that are flagged with the `identityAccess` flag.
   */
  async getPermittedContacts(): Promise<Contact[]> {
    const { profile }: { profile: any } = await this.runtime.profile.getAddressBook();

    return Promise.all(Object.keys(profile)
      .filter((address) => address.startsWith('0x')
        && address !== this.runtime.activeAccount
        && address !== this.runtime.activeIdentity
        && profile[address].identityAccess)
      .map(async (contactAddress: string) => {
        // filter out own account
        const [type, displayName] = await Promise.all([
          profileUtils.getProfileType(this.runtime, contactAddress),
          profileUtils.getUserAlias(this.runtime, contactAddress),
        ]);

        return {
          address: contactAddress,
          displayName,
          granted: profile[contactAddress].identityAccessGranted || '',
          icon: profileUtils.getProfileTypeIcon(type),
          note: profile[contactAddress].identityAccessNote || '',
          type,
        } as Contact;
      }));
  }
}
