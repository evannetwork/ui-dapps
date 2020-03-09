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
import { Runtime, DidDocument } from '@evan.network/api-blockchain-core';
import { isEqual } from 'lodash';
import { Delegate, ServiceEndpoint } from './DidInterfaces';
import { DidService } from './DidService';

@Component
export default class DIDComponent extends mixins(EvanComponent) {
  didDocument: DidDocument = null;

  delegates: Delegate[] = null;

  endpoints: ServiceEndpoint[] = null;

  isEditMode = false;

  isLoading = false;

  previousDelegates: Delegate[] = null;

  previousEndpoints: ServiceEndpoint[] = null;

  runtime: Runtime = null;

  didService: DidService;

  onPageEntries = [
    {
      id: 'did',
      label: this.$t('_profile.did.did-title'),
    },
    {
      id: 'service-endpoints',
      label: this.$t('_profile.did.service-endpoints-title'),
    },
    {
      id: 'delegates',
      label: this.$t('_profile.did.delegates-title'),
    },
  ]

  get hasEditRights(): boolean {
    // Check if owner
    if (this.runtime.activeIdentity === this.didDocument.id) {
      return true;
    }
    // Check if current user is controller
    if (this.didService.getControllers(this.didDocument).indexOf(this.runtime.activeIdentity)) {
      return true;
    }
    return false;
  }

  async created(): Promise<void> {
    this.didService = new DidService(this.getRuntime());
    this.didDocument = await this.didService.fetchDidDocument();
    this.delegates = await this.didService.getDelegates(this.didDocument);
    this.endpoints = this.didService.getServiceEndpoints(this.didDocument);
  }

  /**
   * Enable edit mode and save current data
   */
  onEditStart(): void {
    this.previousDelegates = this.delegates;
    this.previousEndpoints = this.endpoints;
    this.isEditMode = true;
  }

  /**
   * Disable edit mode and recover previous data
   */
  async onEditCancel(): Promise<void> {
    this.delegates = this.previousDelegates;
    this.endpoints = this.previousEndpoints;
    this.isEditMode = false;
  }

  /**
   * Update delegates and endpoints and persist using the service
   */
  async saveDidDocument(): Promise<void> {
    this.isLoading = true;
    let updatedDidDocument = DidService.updateServiceEndpoints(this.didDocument, this.endpoints);
    updatedDidDocument = DidService.updateDelegates(updatedDidDocument, this.delegates);

    await this.didService.updateDidDocument(updatedDidDocument);

    this.didDocument = updatedDidDocument;
    this.isLoading = false;
    this.isEditMode = false;
  }

  /**
   * Temporarily add new delegate
   */
  onAddDelegate(newDelegate: Delegate): void {
    this.delegates = [...this.delegates, newDelegate];
  }

  /**
   * Removes the selected delegate temporarily
   * @param index row index of the item to be removed
   */
  onDeleteDelegate(index: number): void {
    this.delegates = this.delegates.filter((_, i) => i !== index);
  }

  /**
   * Temporarily add new endpoint and add new empty row
   */
  onAddEndpoint(newEndpoint: ServiceEndpoint): void {
    this.endpoints = [...this.endpoints, newEndpoint];
  }

  /**
   * Removes the selected endpoint temporarily
   * @param index row index of the item to be removed
   */
  onDeleteEndpoint(index: number): void {
    this.endpoints = this.endpoints.filter((_, i) => i !== index);
  }

  /**
   * Checks for any real change made
   */
  get hasChanges(): boolean {
    // deep object comparison
    return !isEqual(this.delegates, this.previousDelegates)
      || !isEqual(this.endpoints, this.previousEndpoints);
  }

  /**
   * Export DID Document as JSON and trigger its download
   */
  exportDidDoc(): void {
    DidService.exportDocument(this.didDocument, this.didDocument.id);
  }

  // TODO refactor to (renderless) vue component
  copyToClipboard(text: string): void {
    const textArea = document.createElement('textarea');

    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    this.$toasted.show(
      this.$t('_evan.did.copied'),
      {
        duration: 3000,
        type: 'success',
      },
    );
  }
}
