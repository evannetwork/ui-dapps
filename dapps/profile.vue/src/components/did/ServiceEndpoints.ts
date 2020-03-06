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
import { DidDocument } from '@evan.network/api-blockchain-core';
import { DidService } from './DidService';
import { ServiceEndpoint } from './DidInterfaces';

@Component
export default class ServiceEndpointsComponent extends mixins(EvanComponent) {
  endpoints: ServiceEndpoint[] = null;

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

  didService: DidService;

  didDocument: DidDocument;

  isLoading: boolean;

  async created(): Promise<void> {
    this.didService = new DidService(this.getRuntime());
    this.didDocument = await this.didService.fetchDidDocument();
    this.endpoints = this.didService.getServiceEndpoints(this.didDocument);
    this.isLoading = false;
  }

  /**
   * Temporarily add new entry to row  and add new empty row
   */
  addEndpointRow(): void {
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

  async saveEndpoints(): Promise<void> {
    if (this.newLabel && this.newUrl) {
      this.addEndpointRow();
    }

    this.isLoading = true;
    await this.didService.saveServiceEndpoints(this.endpoints);
    this.isLoading = false;

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
