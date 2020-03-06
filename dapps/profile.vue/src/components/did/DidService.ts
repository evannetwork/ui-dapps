import {
  Did, DidOptions, DidDocument, Runtime,
} from '@evan.network/api-blockchain-core';
import { profileUtils } from '@evan.network/ui';
import { ServiceEndpoint, Delegate } from './DidInterfaces';

/**
 * Handles logic for fetching and persisting DID documents
 */
export class DidService {
  instance;

  runtime: Runtime;

  did: string;

  didDoc: DidDocument;

  constructor(runtime) {
    if (this.instance) {
      return this.instance;
    }
    this.runtime = runtime;
    this.instance = this;
  }

  async fetchDidDocument(): Promise<DidDocument> {
    this.did = await this.runtime.did.convertIdentityToDid(this.runtime.activeIdentity);
    this.didDoc = await this.runtime.did.getDidDocument(this.did);

    // this.didDoc = {
    //   '@context': 'https://w3id.org/did/v1',
    //   id: 'did:evan:testcore:0xa658d10781d9e043276cb44dd1191042548d4b2f',
    //   publicKey: [
    //     {
    //       id: 'did:evan:testcore:0xa658d10781d9e043276cb44dd1191042548d4b2f#key-1',
    //       type: 'Secp256k1VerificationKey2018',
    //       controller: 'did:evan:testcore:0xa658d10781d9e043276cb44dd1191042548d4b2f',
    //       ethereumAddress: '0x8E63039911ea0F0d562A8160fdb5b2aC48EA012F'.toLowerCase(),
    //     },
    //   ],
    //   authentication: [
    //     'did:evan:testcore:0xa658d10781d9e043276cb44dd1191042548d4b2f#key-1',
    //     'did:evan:testcore:0xa658d10781d9e043276cb44dd1191042548d4b2f#key-2',
    //   ],
    // };

    return this.didDoc;
  }

  async getDelegates(didDocument: DidDocument): Promise<Delegate[]> {
    // regex to remove #key suffixes
    const regex = /([#])(key-)(\d)+/;

    return Promise.all(didDocument.authentication
      // Filter out owner
      .filter((auth) => auth !== DidService.getOwner(this.didDoc))
      .map((auth) => auth.replace(regex, ''))
      .map(async (delegateId) => ({
        did: delegateId,
        note: await profileUtils.getUserAlias(this.runtime, delegateId),
      })));
  }

  async saveDelegates(delegates: Delegate[]): Promise<void> {
    // Preserve the owner
    const ownerEntry = DidService.getOwner(this.didDoc);
    console.log('ownerEntry', ownerEntry);
    this.didDoc.authentication = [
      ownerEntry,
      ...delegates.map((delegate) => delegate.did),
    ];

    return this.runtime.did.setDidDocument(this.did, this.didDoc);
  }

  static async getServiceEndpoints(didDocument: DidDocument): Promise<ServiceEndpoint[]> {
    if (!didDocument.service) {
      return [];
    }
    return didDocument.service.map((endpoint) => ({
      label: endpoint.id,
      url: endpoint.serviceEndpoint,
    }));
  }

  static saveServiceEndpoints(endpoints: ServiceEndpoint[]): void {
    // TODO logic
    console.log('Updating endpoints...', endpoints);
  }

  static getOwner(didDoc: DidDocument): string {
    return didDoc.authentication.find((item) => didDoc.publicKey
      .map((key) => key.id).includes(item));
  }
}
