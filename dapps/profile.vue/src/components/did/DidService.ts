import { ServiceEndpoint, DidDocumentTemplate, Delegate } from './DidInterfaces';

// TODO remove this
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
  authentication: [
    'did:evan:testcore:0x96da854df34f5dcd25793b75e170b3d8c63a95ad#key-1',
    // mock delegate
    'did:evan:testcore:0x96da854df34f5dcd25793b75e170b3d8c63a95ae#key-2',
  ],
  created: '2020-02-17T09:14:25.915Z',
  updated: '2020-02-17T09:14:25.915Z',
  proof: {
    type: 'EcdsaPublicKeySecp256k1',
    created: '2020-02-17T09:14:25.933Z',
    proofPurpose: 'assertionMethod',
    verificationMethod: 'did:evan:testcore:0x96da854df34f5dcd25793b75e170b3d8c63a95ad#key-1',
    jws: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1ODE5MzA4NjUsImRpZERvY3VtZW50Ijp7IkBjb250ZXh0IjoiaHR0cHM6Ly93M2lkLm9yZy9kaWQvdjEiLCJpZCI6ImRpZDpldmFuOnRlc3Rjb3JlOjB4OTZkYTg1NGRmMzRmNWRjZDI1NzkzYjc1ZTE3MGIzZDhjNjNhOTVhZCIsInB1YmxpY0tleSI6W3siaWQiOiJkaWQ6ZXZhbjp0ZXN0Y29yZToweDk2ZGE4NTRkZjM0ZjVkY2QyNTc5M2I3NWUxNzBiM2Q4YzYzYTk1YWQja2V5LTEiLCJ0eXBlIjoiU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOCIsIm93bmVyIjoiZGlkOmV2YW46dGVzdGNvcmU6MHg5NmRhODU0ZGYzNGY1ZGNkMjU3OTNiNzVlMTcwYjNkOGM2M2E5NWFkIiwiZXRoZXJldW1BZGRyZXNzIjoiMHgwMDFkZTgyODkzNWU4YzdlNGNiNTZmZTYxMDQ5NWNhZTYzZmIyNjEyIn1dLCJhdXRoZW50aWNhdGlvbiI6WyJkaWQ6ZXZhbjp0ZXN0Y29yZToweDk2ZGE4NTRkZjM0ZjVkY2QyNTc5M2I3NWUxNzBiM2Q4YzYzYTk1YWQja2V5LTEiXSwiY3JlYXRlZCI6IjIwMjAtMDItMTdUMDk6MTQ6MjUuOTE1WiIsInVwZGF0ZWQiOiIyMDIwLTAyLTE3VDA5OjE0OjI1LjkxNVoifSwiaXNzIjoiZGlkOmV2YW46dGVzdGNvcmU6MHg5NmRhODU0ZGYzNGY1ZGNkMjU3OTNiNzVlMTcwYjNkOGM2M2E5NWFkIn0.yBMpk9cQikhHv3MEEXr4w3po9AZWLRtqhbW7iQ0L0e0Ylxkg5R4z9niOXuVpwueVjNP-tCNOa5HBCIJqnDts6wA',
  },
  service: [{
    serviceEndpoint: 'http:/dsadsadasdasdsadassda',
    id: 'MOCK ID',
    type: 'MOCK TYPE',
  }],
};

/**
 * Handles logic for fetching and persisting DID documents
 */
export class DidService {
  /**
   * TODO: handle profiles without created did?
   */
  static async fetchDidDocument(): Promise<DidDocumentTemplate> {
    // this.runtime = this.getRuntime();

    // console.log(this.runtime.nameResolver.config);

    // const didInstance = new Did(this.runtime as DidOptions);

    /* console.log('didInstance', didInstance);
       const did = await didInstance.convertIdentityToDid(this.runtime.activeIdentity); */

    /* console.log('did', did);
       this.didDocument = await didInstance.getDidDocument(did);
       // this.didDocument = await this.runtime.did.getDidDocument(did); */

    // console.log('didDocument', this.didDocument);

    return Promise.resolve(TEST_DID_DOC);
  }

  static async getDelegates(didDocument: DidDocumentTemplate): Promise<Delegate[]> {
    // regex to remove #key suffixes
    const regex = /([#])(key-)(\d)+/;

    return Promise.all(didDocument.authentication
      .map((item) => item.replace(regex, ''))
      .filter((item) => item !== didDocument.id)
      .map(async (delegateId) => ({
        did: delegateId,
        /* TODO getUserAlias doesn't handle DIDs yet
           note: await profileUtils.getUserAlias(this.getRuntime(), delegateId), */
        note: await Promise.resolve('MOCK NOTE'),
      })));
  }

  static saveDelegates(delegates: Delegate[]): void {
    // TODO logic
    console.log('Updating delegates...', delegates);
  }

  static async getServiceEndpoints(didDocument: DidDocumentTemplate): Promise<ServiceEndpoint[]> {
    return didDocument.service.map((endpoint) => ({
      label: endpoint.id,
      url: endpoint.serviceEndpoint,
    }));
  }

  static saveServiceEndpoints(endpoints: ServiceEndpoint[]): void {
    // TODO logic
    console.log('Updating endpoints...', endpoints);
  }
}
