export interface Delegate {
  id: string;
  type: string;
  controller: string;
  ethereumAddress: string;
}

export interface ServiceEndpoint {
  id: string;
  type: string;
  url: string;
}
