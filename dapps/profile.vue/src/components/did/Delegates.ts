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
import { EvanComponent, EvanTableColumn, ContactInterface } from '@evan.network/ui-vue-core';
import { profileUtils, bccUtils } from '@evan.network/ui';
import { Prop } from 'vue-property-decorator';

@Component
export default class DelegatesComponent extends mixins(EvanComponent) {
  @Prop() delegates: string[];

  @Prop() isEditMode;

  @Prop() isLoading;

  contacts: ContactInterface[] = [];

  columns: EvanTableColumn[] = [
    {
      key: 'did',
      label: this.$t('_profile.did.did'),
      tdClass: 'truncate',
    },
    {
      key: 'action',
      label: '',
      thClass: 'th-icon',
    },
  ]

  async created(): Promise<void> {
    this.contacts = await profileUtils.getContacts(this.getRuntime());
    // Attach DID instead of accountId / identity
    this.contacts = await Promise.all(this.contacts.map(async (contact) => ({
      label: contact.label,
      value: await bccUtils.getDidFromAddress(this.getRuntime(), contact.value),
    })));
  }

  /**
   * Filter out already set delegates
   */
  get filteredContacts(): ContactInterface[] {
    return this.contacts.filter((contact) => !this.delegates.includes(contact.value));
  }

  onSelectContact(contact: ContactInterface): void {
    this.$emit('addDelegate', contact.value);
  }

  deleteDelegate(index: number): void {
    this.$emit('deleteDelegate', index);
  }
}
