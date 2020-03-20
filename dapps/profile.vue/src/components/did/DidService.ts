import {
  DidDocument, Runtime,
} from '@evan.network/api-blockchain-core';
import { profileUtils, Dispatcher, DispatcherInstance } from '@evan.network/ui';
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
  async getDelegates(didDocument: DidDocument): Promise<Delegate[]> {
    // regex to remove #key suffixes
    const regex = /([#])(key-)(\d)+/;

    return Promise.all(didDocument.authentication
      // Filter out owner
      .filter((auth) => auth !== DidService.getOwner(didDocument))
      .map((auth) => auth.replace(regex, ''))
      .map(async (did) => ({
        did,
        note: await profileUtils.getUserAlias(this.runtime, await this.runtime.did.convertDidToIdentity(did)),
      })));
  }

  static updateDelegates(didDoc: DidDocument, delegates: Delegate[]): DidDocument {
    // Preserve the owner
    const ownerEntry = DidService.getOwner(didDoc);
    const newDoc = didDoc;
    newDoc.authentication = [
      ownerEntry,
      ...delegates.map((delegate) => delegate.did),
    ];
    return newDoc;
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
   * TODO: Currently we don't implement controller logic. Return empty array
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
    return didDoc.authentication.find((item) => didDoc.publicKey
      .map((key) => key.id).includes(item));
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
