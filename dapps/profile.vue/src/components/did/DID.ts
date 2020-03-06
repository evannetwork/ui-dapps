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
import { Delegate, ServiceEndpoint } from './DidInterfaces';
import { DidService } from './DidService';

@Component
export default class DIDComponent extends mixins(EvanComponent) {
  didDocument: DidDocument = null;

  delegates: Delegate[] = null;

  endpoints: ServiceEndpoint[] = null;

  runtime: Runtime = null;

  didService: DidService;

  onPageEntries = [
    {
      id: 'did',
      label: this.$t('_profile.did.did-title'),
    },
    {
      id: 'service-endpoints',
      label: this.$t('_profile.did.service-endpoint-title'),
    },
    {
      id: 'delegates',
      label: this.$t('_profile.did.delegates-title'),
    },
  ]

  async created(): Promise<void> {
    console.log('this.getRuntime()', this.getRuntime());
    this.didService = new DidService(this.getRuntime());
    this.didDocument = await this.didService.fetchDidDocument();
    this.delegates = await this.didService.getDelegates(this.didDocument);
    this.endpoints = await DidService.getServiceEndpoints(this.didDocument);
  }

  async updateDelegates(delegates: Delegate[]): Promise<void> {
    await this.didService.saveDelegates(delegates);
    console.log('updated');
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
