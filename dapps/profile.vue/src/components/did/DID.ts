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
  id: 'did:evan:testcore:0x96da854df34f5dcd25793b75e170b3d8c63a95ad',
  publicKey: [
    {
      id: 'did:evan:testcore:0x96da854df34f5dcd25793b75e170b3d8c63a95ad#key-1',
      type: 'Secp256k1VerificationKey2018',
      controller: 'did:evan:testcore:0x96da854df34f5dcd25793b75e170b3d8c63a95ad',
      ethereumAddress: '0x001de828935e8c7e4cb56fe610495cae63fb2612',
    },
  ],
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  authentication: [
    'did:evan:testcore:0x96da854df34f5dcd25793b75e170b3d8c63a95ad#key-1',
  ],
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  created: '2020-02-17T09:14:25.915Z',
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  updated: '2020-02-17T09:14:25.915Z',
  proof: {
    type: 'EcdsaPublicKeySecp256k1',
    created: '2020-02-17T09:14:25.933Z',
    proofPurpose: 'assertionMethod',
    verificationMethod: 'did:evan:testcore:0x96da854df34f5dcd25793b75e170b3d8c63a95ad#key-1',
    jws: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1ODE5MzA4NjUsImRpZERvY3VtZW50Ijp7IkBjb250ZXh0IjoiaHR0cHM6Ly93M2lkLm9yZy9kaWQvdjEiLCJpZCI6ImRpZDpldmFuOnRlc3Rjb3JlOjB4OTZkYTg1NGRmMzRmNWRjZDI1NzkzYjc1ZTE3MGIzZDhjNjNhOTVhZCIsInB1YmxpY0tleSI6W3siaWQiOiJkaWQ6ZXZhbjp0ZXN0Y29yZToweDk2ZGE4NTRkZjM0ZjVkY2QyNTc5M2I3NWUxNzBiM2Q4YzYzYTk1YWQja2V5LTEiLCJ0eXBlIjoiU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOCIsIm93bmVyIjoiZGlkOmV2YW46dGVzdGNvcmU6MHg5NmRhODU0ZGYzNGY1ZGNkMjU3OTNiNzVlMTcwYjNkOGM2M2E5NWFkIiwiZXRoZXJldW1BZGRyZXNzIjoiMHgwMDFkZTgyODkzNWU4YzdlNGNiNTZmZTYxMDQ5NWNhZTYzZmIyNjEyIn1dLCJhdXRoZW50aWNhdGlvbiI6WyJkaWQ6ZXZhbjp0ZXN0Y29yZToweDk2ZGE4NTRkZjM0ZjVkY2QyNTc5M2I3NWUxNzBiM2Q4YzYzYTk1YWQja2V5LTEiXSwiY3JlYXRlZCI6IjIwMjAtMDItMTdUMDk6MTQ6MjUuOTE1WiIsInVwZGF0ZWQiOiIyMDIwLTAyLTE3VDA5OjE0OjI1LjkxNVoifSwiaXNzIjoiZGlkOmV2YW46dGVzdGNvcmU6MHg5NmRhODU0ZGYzNGY1ZGNkMjU3OTNiNzVlMTcwYjNkOGM2M2E5NWFkIn0.yBMpk9cQikhHv3MEEXr4w3po9AZWLRtqhbW7iQ0L0e0Ylxkg5R4z9niOXuVpwueVjNP-tCNOa5HBCIJqnDts6wA',
  },
};

@Component
export default class DIDComponent extends mixins(EvanComponent) {
  didDocument = null;

  runtime: Runtime = null;

  /**
   * TODO: handle profiles without creatded did?
   */
  // eslint-disable-next-line class-methods-use-this
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

    return TEST_DID_DOC;
  }

  async created(): Promise<void> {
    this.didDocument = await this.fetchDidDocument();
    console.log('this.didDocument', this.didDocument);
    /* // TODO: switch after complete identity switch to: runtime.did.getDidDocument();
       const identity = await this.runtime.verifications.getIdentityForAccount(this.runtime.activeAccount, true);
       const did = await this.runtime.did.convertIdentityToDid(identity);
       const document = await this.runtime.did.getDidDocumentTemplate();
       await this.runtime.did.setDidDocument(did, document);
       const retrieved = await this.runtime.did.getDidDocument(did); */
  }

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
