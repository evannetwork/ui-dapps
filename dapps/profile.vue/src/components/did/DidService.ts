import { DidDocument, Runtime } from '@evan.network/api-blockchain-core';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { getDomainName } from '@evan.network/ui-vue-core';
import { ServiceEndpoint, Delegate } from './DidInterfaces';

/**
 * Handles logic for fetching and persisting DID documents
 */
export class DidService {
  runtime: Runtime;

  constructor(runtime: Runtime) {
    this.runtime = runtime;
  }

  async fetchDidDocument(identity: string): Promise<DidDocument> {
    const did = await this.runtime.did.convertIdentityToDid(identity);

    return this.runtime.did.getDidDocument(did);
  }

  /**
   * Persist changes to DID Document
   * @param newDidDoc updated DID Document
   */
  updateDidDocument(newDidDoc: DidDocument): Dispatcher {
    const dispatcher = new Dispatcher(
      `profile.vue.${getDomainName()}`,
      'updateDidDocumentDispatcher',
      60000,
      '_profile.dispatchers.did-document-update',
    );

    return dispatcher.step(async (instance: DispatcherInstance, data) => {
      await this.runtime.did.setDidDocument(newDidDoc.id, newDidDoc);
    });
  }

  /**
   * Returns the delegates excluding the owner entry
   * @param didDocument specified did document
   */
  static getDelegates(didDocument: DidDocument): Delegate[] {
    const keyIds = didDocument.publicKey.map((key) => key.id);

    return didDocument.authentication
      .filter((auth) => keyIds.includes(auth))
      .map((key) => didDocument.publicKey.find((entry) => entry.id === key))
      // Filter out "owner"
      .filter((delegate) => delegate.controller !== didDocument.id);
  }

  /**
   * Enhances a DID Document with given delegates
   * @param newDelegates Array of DIDs to be added as delegate
   * @param didDoc DID Document to be enhanced
   */
  async updateDelegates(newDelegates: string[], didDoc: DidDocument): Promise<DidDocument> {
    const delegateKeys = DidService.getDelegates(didDoc).map((delegate) => delegate.id);
    const type = 'Secp256k1VerificationKey2018';

    // DidDoc without delegates
    const cleanDidDoc = {
      ...didDoc,
      publicKey: didDoc.publicKey.filter((key) => !delegateKeys.includes(key.id)),
      authentication: didDoc.authentication.filter((auth) => !auth.includes('#delegate-')),
    };

    return {
      ...cleanDidDoc,
      publicKey: [
        ...cleanDidDoc.publicKey,
        ...await Promise.all(newDelegates.map(async (did, idx) => ({
          id: `${cleanDidDoc.id}#delegate-${idx}`,
          type,
          controller: did,
          ethereumAddress: await this.getAccountForDid(did),
        }))),
      ],
      authentication: [
        ...cleanDidDoc.authentication,
        ...newDelegates.map((_, idx) => `${cleanDidDoc.id}#delegate-${idx}`),
      ],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getServiceEndpoints(didDocument: DidDocument): ServiceEndpoint[] {
    if (!didDocument.service) {
      return [];
    }

    return didDocument.service.map((endpoint) => ({
      id: endpoint.id,
      type: endpoint.type,
      url: endpoint.serviceEndpoint,
    }));
  }

  /**
   * Writes given service endpoints to the DID Document
   * @param didDoc DID Document to be enhanced
   * @param endpoints Service Endpoints to add
   */
  static updateServiceEndpoints(didDoc: DidDocument, endpoints: ServiceEndpoint[]): DidDocument {
    return {
      ...didDoc,
      service: endpoints.map((endpoint) => ({
        id: endpoint.id,
        type: endpoint.type,
        serviceEndpoint: endpoint.url,
      })),
    };
  }

  /**
   * Currently we don't implement controller logic. Return empty array
   * @param didDoc
   */
  // eslint-disable-next-line class-methods-use-this
  getControllers(didDoc: DidDocument): any[] {
    return [];
  }

  /**
   * Return owner DID for a specific DID Document
   * @param didDoc DID Document to get the owner for
   */
  static getOwner(didDoc: DidDocument): string {
    return didDoc.id;
  }

  /**
   * Helper to convert DID to account id
   * @param did DID
   */
  async getAccountForDid(did: string): Promise<string> {
    const identity = await this.runtime.did.convertDidToIdentity(did);

    return this.runtime.verifications.getOwnerAddressForIdentity(identity);
  }

  /**
   * Trigger download of DID Document as JSON file.
   *
   * @param filename Name for the file
   * @param text Content of the text tile
   */
  static exportDocument(didDoc: DidDocument, filename: string): void {
    const element = document.createElement('a');
    const text = JSON.stringify(didDoc, null, 2);

    element.setAttribute(
      'href',
      `data:text/json;charset=utf-8,${encodeURIComponent(text)}`,
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
