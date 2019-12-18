import { Address } from './StripeSource.interface';

export interface VatValidationInterface {
  isValidVat: boolean;
  tax: number;
}

export interface CustomerInterface {
  email: string;
  shipping: {
    name: string;
    address: Address;
  };
  tax_info: {
    type: string;
    tax_id: string;
  };
}

export interface CustomerParams {
  name?: string;
  email?: string;
  company?: string;
  street?: string;
  city?: string;
  zip?: string;
  country?: string;
  vat?: string;
}

export interface ErrorStatus {
  status: string;
  code: string;
  result?: string;
}

export interface OptionsInterface {
  type?: string;
  currency?: string;
  notification_method?: string;
}

export interface TransferringTransactionInterface {
  token: string;
  amount: number;
  timestamp: number;
  customer: CustomerInterface;
  requestId: string;
  type: string;
}
