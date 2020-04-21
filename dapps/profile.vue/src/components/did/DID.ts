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
import { ServiceEndpoint } from './DidInterfaces';
import { DidService } from './DidService';
import updateDidDocDispatcher from './UpdateDidDocDispatcher';

@Component
export default class DIDComponent extends mixins(EvanComponent) {
  didDocument: DidDocument = null;

  // Delegate DIDs
  delegates: string[] = null;

  endpoints: ServiceEndpoint[] = null;

  isEditMode = false;

  isLoading = false;

  previousDelegates: string[] = null;

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
    if (this.runtime.activeIdentity === this.$route.params.address) {
      return true;
    }
    // Check if current user is controller
    if (this.didService.getControllers(this.didDocument).includes(this.runtime.activeIdentity)) {
      return true;
    }
    return false;
  }

  /**
   * Enable or disable save button
   */
  get canSave(): boolean {
    return this.hasChanges && !this.isLoading;
  }

  /**
   * Checks for any real change made
   */
  get hasChanges(): boolean {
    // deep object comparison
    return !isEqual(this.delegates, this.previousDelegates)
      || !isEqual(this.endpoints, this.previousEndpoints);
  }

  async created(): Promise<void> {
    this.runtime = this.getRuntime();
    this.didService = new DidService(this.runtime);

    this.didDocument = await this.didService.fetchDidDocument(this.$route.params.address);
    this.delegates = DidService.getDelegates(this.didDocument).map((delegate) => delegate.controller);
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
  onEditCancel(): void {
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
    updatedDidDocument = await this.didService.updateDelegates(this.delegates, updatedDidDocument);
    updatedDidDocument.updated = new Date().toISOString();

    try {
      await updateDidDocDispatcher.start(this.runtime, updatedDidDocument);
      this.didDocument = updatedDidDocument;
    } catch (e) {
      this.runtime.logger.log('Updating DID Document failed', 'error');
    }

    this.isLoading = false;
    this.isEditMode = false;
  }

  /**
   * Temporarily add new delegate
   */
  onAddDelegate(newDelegate: string): void {
    this.delegates = [...this.delegates, newDelegate];
  }

  /**
   * Removes the selected delegate temporarily
   * @param index row index of the item to be removed
   */
  onDeleteDelegate(index: number): void {
    this.delegates = this.delegates.filter((_, i) => i !== index);
  }

  onUpdateEndpoints(newEndpoints: ServiceEndpoint[]): void {
    this.endpoints = [...newEndpoints];
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
