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
import { EvanComponent, EvanTableColumn } from '@evan.network/ui-vue-core';
import { isEqual } from 'lodash';
import { Prop } from 'vue-property-decorator';
import { DidService } from './DidService';

@Component
export default class ServiceEndpointsComponent extends mixins(EvanComponent) {
  @Prop() endpoints: { label: string; url: string }[];

  isEditMode = false;

  newUrl = '';

  newLabel = '';

  columns: EvanTableColumn[] = [
    {
      key: 'label',
      label: this.$t('_profile.did.label'),
    },
    {
      key: 'url',
      label: 'URL',
    },
    {
      key: 'action',
      label: '',
      thClass: 'th-icon',
    },
  ]

  previousData = [];

  /**
   * Temporarily add new entry to row  and add new empty row
   */
  addEndpointRow(): void {
    if (!this.newLabel || !this.newUrl) {
      return;
    }

    this.endpoints = [...this.endpoints, {
      label: this.newLabel,
      url: this.newUrl,
    }];
    this.newLabel = '';
    this.newUrl = '';
  }

  /**
   * Removes the selected endpoint temporarily
   * @param index row index of the item to be removed
   */
  deleteEndpoint(index: number): void {
    this.endpoints = this.endpoints.filter((_, i) => i !== index);
  }

  saveEndpoints(): void {
    this.addEndpointRow();

    DidService.saveServiceEndpoints(this.endpoints);

    this.isEditMode = false;
  }

  /**
   * Enable edit mode and save current data
   */
  onEditStart(): void {
    this.previousData = this.endpoints;
    this.isEditMode = true;
  }

  /**
   * Disable edit mode and recover previous data
   */
  onEditCancel(): void {
    this.endpoints = this.previousData;
    this.isEditMode = false;
  }

  /**
   * Checks for any real change made
   */
  get hasChanges(): boolean {
    // check for filled new row
    if (this.newLabel && this.newUrl) {
      return true;
    }
    // otherwise deep object comparison
    return !isEqual(this.previousData, this.endpoints);
  }
}
