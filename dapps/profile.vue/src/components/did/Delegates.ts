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
import { bccUtils } from '@evan.network/ui';
import { isEqual } from 'lodash';
import { Prop } from 'vue-property-decorator';
import { DidService } from './DidService';
import { Delegate } from './DidInterfaces';

@Component
export default class DelegatesComponent extends mixins(EvanComponent) {
  @Prop() delegates: Delegate[];

  isEditMode = false;

  contacts: ContactInterface[] = [];

  columns: EvanTableColumn[] = [
    {
      key: 'did',
      label: this.$t('_profile.did.did'),
    },
    {
      key: 'note',
      label: this.$t('_profile.did.note'),
    },
    {
      key: 'action',
      label: '',
      thClass: 'th-icon',
    },
  ]


  previousData: Delegate[] = [];

  async mounted(): Promise<void> {
    this.contacts = await bccUtils.getContacts(this.getRuntime());
  }

  /**
   * Temporarily add contact to delegates
   * @param contact selected contact
   */
  async onSelectContact(contact: ContactInterface): Promise<void> {
    this.delegates = [...this.delegates, {
      did: contact.value,
      note: contact.label,
    }];
  }

  saveDelegates(): void {
    DidService.saveDelegates(this.delegates);
    this.isEditMode = false;
  }

  /**
   * Removes the selected delegate temporarily
   * @param index row index of the item to be removed
   */
  deleteDelegate(index: number): void {
    this.delegates = this.delegates.filter((_, i) => i !== index);
  }

  /**
   * Enable edit mode and save current data
   */
  onEditStart(): void {
    this.previousData = this.delegates;
    this.isEditMode = true;
  }

  /**
   * Disable edit mode and recover previous data
   */
  onEditCancel(): void {
    this.delegates = this.previousData;
    this.isEditMode = false;
  }

  /**
   * Checks for any real change made
   */
  get hasChanges(): boolean {
    // deep object comparison
    return !isEqual(this.previousData, this.delegates);
  }
}
