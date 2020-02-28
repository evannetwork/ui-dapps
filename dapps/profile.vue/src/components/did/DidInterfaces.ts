import { DidProof } from '@evan.network/api-blockchain-core';

export interface Delegate {
  did: string;
  note: string;
}

export interface ServiceEndpoint {
  label: string;
  url: string;
}

// TODO: temporary fix until bcc fixed the interface
export interface DidDocumentTemplate {
  '@context': string;
  id: string;
  controller?: string;
  authentication: string[];
  publicKey?: {
      id: string;
      type: string;
      publicKeyHex: string;
  }[] | {
      id: string;
      type: string;
      controller: string;
      ethereumAddress: string;
  }[];
  updated?: string;
  created?: string;
  proof?: DidProof;
  service?: {
      id: string;
      type: string;
      serviceEndpoint: string;
  }[];
}
