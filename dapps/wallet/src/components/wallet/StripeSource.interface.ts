export interface StripeSource {
  id?: string;
  object?: string;
  amount?: number;
  card?: Card;
  client_secret?: string;
  created?: number;
  currency: string;
  flow?: string;
  livemode?: boolean;
  metadata?: Metadata;
  owner: Owner;
  statement_descriptor?: string;
  status?: string;
  type: string;
  usage: string;
  mandate?: any;
}

export interface Card {
  exp_month: number;
  exp_year: number;
  last4: string;
  country: string;
  brand: string;
  address_zip_check: string;
  cvc_check: string;
  funding: string;
  three_d_secure: string;
  name: string;
  address_line1_check: string;
  tokenization_method: string;
  dynamic_last4: string;
}

export interface Metadata {}

export interface Owner {
  address: Address;
  email: string;
  name: string;
  phone?: string;
  verified_address?: string;
  verified_email?: string;
  verified_name?: string;
  verified_phone?: string;
}

export interface Address {
  city: string;
  country: string;
  line1: string;
  line2?: string;
  postal_code: string;
  state?: string;
}
