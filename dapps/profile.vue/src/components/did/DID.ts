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
import { Runtime, DidDocumentTemplate } from '@evan.network/api-blockchain-core';

const TEST_DID_DOC: DidDocumentTemplate = {
  '@context': 'https://w3id.org/did/v1',
  id: 'did:evan:testcore:0x126E901F6F408f5E260d95c62E7c73D9B60fd734',
  publicKey: [
    {
      id: 'did:evan:testcore:0x126E901F6F408f5E260d95c62E7c73D9B60fd734#key-1',
      type: 'Secp256k1SignatureVerificationKey2018',
      publicKeyHex: '045adfd502c0bc55f4fcb90eea36368d7e19c5b3045aa6f51dfa3699046e9751251d21bc6bdd06c1ff0014fcbbf9f1d83c714434f2b33d713aaf46760f2d53f10d',
    },
  ],
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  authentication: [
    'did:evan:testcore:0x126E901F6F408f5E260d95c62E7c73D9B60fd734#key-1',
  ],
  service: [
    {
      id: 'did:evan:testcore:0x126E901F6F408f5E260d95c62E7c73D9B60fd734#randomService',
      type: 'randomService-770853367',
      serviceEndpoint: 'https://openid.example.com/770853367',
    },
  ],
};

@Component
export default class DIDComponent extends mixins(EvanComponent) {
  didDocument = null;

  runtime: Runtime = null;

  // TODO: remove mock
  testDidDoc = TEST_DID_DOC;

  /**
   * TODO: handle profiles without creatded did?
   */
  async fetchDidDocument(): Promise<DidDocumentTemplate> {
    // this.runtime = this.getRuntime();

    // console.log(this.runtime.nameResolver.config);

    // const didInstance = new Did(this.runtime as DidOptions);

    /* console.log('didInstance', didInstance);
       const did = await didInstance.convertIdentityToDid(this.runtime.activeIdentity); */

    /* console.log('did', did);
       this.didDocument = await didInstance.getDidDocument(did);
       // this.didDocument = await this.runtime.did.getDidDocument(did); */

    // console.log('didDocument', this.didDocument);

    return this.testDidDoc;
  }

  async created(): Promise<void> {
    this.fetchDidDocument();
    /* // TODO: switch after complete identity switch to: runtime.did.getDidDocument();
       const identity = await this.runtime.verifications.getIdentityForAccount(this.runtime.activeAccount, true);
       const did = await this.runtime.did.convertIdentityToDid(identity);
       const document = await this.runtime.did.getDidDocumentTemplate();
       await this.runtime.did.setDidDocument(did, document);
       const retrieved = await this.runtime.did.getDidDocument(did); */
  }
}
