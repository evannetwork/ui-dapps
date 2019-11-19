export interface VatValidationInterface {
  isValidVat: boolean;
  tax: number;
}

export interface CustomerInterface {
  email: string;
  shipping: {
    name: string;
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      postal_code: string;
    }
  };
  tax_info: {
    type: string;
    tax_id: string
  };
}

export interface StatusInterface {
  status: string;
  code: string;
  result?: string;
}

export interface OptionsInterface {
  type: string;
  currency: string;
}
