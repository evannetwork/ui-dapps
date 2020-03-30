export interface Delegate {
  did: string;
  note?: string;
}

export interface ServiceEndpoint {
  id: string;
  type: string;
  url: string;
}
