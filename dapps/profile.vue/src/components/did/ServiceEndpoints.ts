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
import { EvanComponent, EvanTableColumn, EvanTableItem } from '@evan.network/ui-vue-core';
import { Prop } from 'vue-property-decorator';
import { ServiceEndpoint } from './DidInterfaces';

@Component
export default class ServiceEndpointsComponent extends mixins(EvanComponent) {
  @Prop() isEditMode;

  @Prop() isLoading;

  @Prop() endpoints: ServiceEndpoint[];

  newUrl = null;

  newId = null;

  newType = null;

  columns: EvanTableColumn[] = [
    {
      key: 'id',
      label: this.$t('_profile.did.id'),
      tdClass: 'truncate',
    },
    {
      key: 'type',
      label: this.$t('_profile.did.type'),
      tdClass: 'truncate',
    },
    {
      key: 'url',
      label: this.$t('_profile.did.url'),
      tdClass: 'truncate',
    },
    {
      key: 'action',
      label: '',
      thClass: 'th-icon',
    },
  ]

  addEndpointRow(): void {
    const newEndpoint: ServiceEndpoint = {
      id: this.newId,
      type: this.newType,
      url: this.newUrl,
    };
    this.newId = null;
    this.newUrl = null;
    this.newType = null;

    this.$emit('addEndpoint', newEndpoint);
  }

  /**
   * Removes the selected endpoint temporarily
   * @param index row index of the item to be removed
   */
  deleteEndpoint(index: number): void {
    this.$emit('deleteEndpoint', index);
  }

  editId(value: string, tableData: EvanTableItem<ServiceEndpoint>): void {
    this.$emit('updateEndpoint', tableData.index, {
      id: value,
      type: tableData.item.type,
      url: tableData.item.url,
    });
  }

  editType(value: string, tableData: EvanTableItem<ServiceEndpoint>): void {
    this.$emit('updateEndpoint', tableData.index, {
      id: tableData.item.id,
      type: value,
      url: tableData.item.url,
    });
  }

  editUrl(value: string, tableData: EvanTableItem<ServiceEndpoint>): void {
    this.$emit('updateEndpoint', tableData.index, {
      id: tableData.item.id,
      type: tableData.item.type,
      url: value,
    });
  }
}
