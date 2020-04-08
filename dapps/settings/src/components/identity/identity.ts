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
import { profileUtils, DispatcherInstance } from '@evan.network/ui';
import { Runtime } from '@evan.network/api-blockchain-core';
import { session } from '@evan.network/ui-session';

import { IdentityAccessContact } from '../../interfaces';
import { identityShareDispatcher } from '../../dispatchers';

@Component
export default class IdentitySettingsComponent extends mixins(EvanComponent) {
  /**
   * All contacts that have the profile key `identityAccess`
   */
  contacts: IdentityAccessContact[] = null;

  /**
   * Contacts that getting currently permissions
   */
  loadingStates = { };

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
        key: 'grantedAt',
        label: this.$t('_settings.identity.table.columns.grantedAt'),
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

  isIdentityUsed = false;

  /**
   * Clear identity share dispatcher watcher in beforeDestroy
   */
  identityShareDispatcherClear: () => void;

  /**
   * Filter all contacts for hasIdentityAccess
   */
  get permittedContacts(): void {
    return this.contacts.filter(
      (contact) => contact.hasIdentityAccess || this.loadingStates[contact.address],
    );
  }

  beforeDestroy(): void {
    this.identityShareDispatcherClear();
  }

  /**
   * Load initial data
   */
  async created(): Promise<void> {
    this.runtime = session.identityRuntime;
    this.isIdentityUsed = this.runtime.runtimeConfig.isIdentityUsed;

    // don't allow this ui for profiles without useIdentity
    if (!this.isIdentityUsed) {
      this.loading = false;
      return;
    }

    // load contacts, check for loading dispatchers and filter out permitted contacts
    this.contacts = await this.loadContacts();
    this.loadingStates = await this.getLoadingStates();

    // watch for changes
    this.identityShareDispatcherClear = identityShareDispatcher.watch(async ($event) => {
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        this.loading = true;
        await this.loadContacts();
        this.loading = false;
      }

      this.loadingStates = await this.getLoadingStates();
    });

    this.loading = false;
  }

  /**
   * Load all contacts that are flagged with the `identityAccess` flag.
   */
  async loadContacts(): Promise<IdentityAccessContact[]> {
    const { profile }: { profile: any } = await this.runtime.profile.getAddressBook();

    return Promise.all(Object.keys(profile)
      .filter((address) => address.startsWith('0x')
        && address !== this.runtime.activeAccount
        && address !== this.runtime.activeIdentity)
      .map(async (contactAddress: string) => {
        const contact = profile[contactAddress];
        // filter out own account
        const [type, displayName] = await Promise.all([
          profileUtils.getProfileType(this.runtime, contactAddress),
          profileUtils.getUserAlias(this.runtime, contactAddress),
        ]);

        return {
          address: contactAddress,
          displayName,
          grantedAt: contact.identityAccessGranted
            ? new Date(parseInt(contact.identityAccessGranted, 10)) : '',
          icon: profileUtils.getProfileTypeIcon(type),
          hasIdentityAccess: contact.hasIdentityAccess || false,
          note: contact.identityAccessNote || '',
          type,
        } as IdentityAccessContact;
      }));
  }

  /**
   * Load latest dispatcher instances and check which identities currently gets access.
   */
  async getLoadingStates(): Promise<void> {
    const instances = await identityShareDispatcher.getInstances(this.runtime, true) as DispatcherInstance[];
    const loadingStates = { };

    instances.forEach((instance: DispatcherInstance) => {
      loadingStates[instance.data.contact.address] = true;
    });

    // update table data and display also the contacts that are in loading progress
    return loadingStates;
  }
}
