import { Address } from './StripeSource.interface';

export interface StatusResponse {
    result?:               string;
    status:               string;
    serverInformation:    ServerInformation;
    requesterInformation: RequesterInformation;
  }

  export interface RequesterInformation {
    id:             string;
    fingerprint:    string;
    messageId:      string;
    remoteIP:       string;
    receivedParams: ReceivedParams;
  }

  export interface ReceivedParams {
    token:    string;
    amount:   string;
    customer: Customer;
    action:   string;
  }

  export interface Customer {
    email:    string;
    shipping: Shipping;
    tax_info: TaxInfo;
  }

  export interface Shipping {
    name:    string;
    address: Address;
  }

  export interface TaxInfo {
    tax_id: string;
    type:   string;
  }

  export interface ServerInformation {
    serverName:      string;
    apiVersion:      string;
    requestDuration: number;
    currentTime:     number;
  }
