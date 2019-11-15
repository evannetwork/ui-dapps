/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/
*/

import axios from 'axios';
import { debounce } from '@evan.network/lodash.libs';

interface VatValidationInterface {
  isValidVat: boolean;
  tax: number;
}

interface CustomerInterface {
  email: string;
  shipping: {
    name: string;
    company: string;
    street: string;
    zip: string;
    city: string;
    country: string;
  };
  tax_info: {
    type: string;
    tax_id: string
  };
}

interface StatusInterface {
  status: string;
  code: string;
  result?: string;
}

interface OptionsInterface {
  type: string;
  currency: string;
}

export class PaymentService {
  private static PAYMENT_TIMEOUT = 1000 * 60 * 10; // 10 minutes
  private static PAYMENT_RETRY = 5000; // 5 seconds

  private intervalTimer = null;
  private requestId = null;
  private agentUrl = null;
  private stripe: null;
  private headers: {};

  /**
   * Initialise the payment service with the agent url.
   *
   * @param stripe
   * @param agentUrl
   */
  constructor(stripe: any, agentUrl = 'https://agents.test.evan.network/api') {
    this.agentUrl = agentUrl;
    this.stripe = stripe;
    // TODO: init with stripe API key and auth headers ?
  }

  private getErrorCode(code: string) {
    const translatedCodes = [
      'unknown_state',
      'transaction_failed',
      'charge_failed',
      'invalid_customer',
      'price_not_okay',
      'too_many_accounts',
      'wallet_not_enough_funds'
    ];

    return translatedCodes.indexOf(code) !== -1 ? code : 'unknown_state';
  }

  /**
   * Check current payment state against smart agent.
   *
   * @param id
   * @param amount
   * @param customer
   */
  private async checkStatus(id: string, amount: number, customer: any): Promise<StatusInterface> {
    const {data: {status, code}} = await axios.post(
      `${ this.agentUrl }/smart-agents/payment-processor/executePayment`, {
        token: id,
        amount,
        customer,
        requestId: this.requestId
      }, {
        headers: this.headers
      }
    );

    return {status, code};
  }

  // TODO: call: authorization = await bcc.utils.getSmartAgentAuthHeaders(this.bcc.coreRuntime); from outside and
  // setAuthHeaders(authorization) to set the headers

  /**
   * Set auth header data to authenticate with current account against the payment smart agent.
   *
   * @param authorization
   */
  setAuthHeaders(authorization: string) {
    this.headers = { authorization };
  }

  /**
   * Request every X seconds and resolves when we got success or transferring status.
   * Reject on error response.
   *
   * @param id
   * @param amount
   * @param customer
   * @param headers
   */
  private async getStatus (id: string, amount: number, customer: any): Promise<StatusInterface> {
    return new Promise((resolve, reject) => {
      this.intervalTimer = setInterval( async () => {
        const response = await this.checkStatus(id, amount, customer);

        switch (response.status) {
          case 'error': {
            clearInterval(this.intervalTimer);
            reject(response);

            break;
          }
          case 'new': {
            this.requestId = response.result;
            break;
          }
          case 'transferring':
          case 'success': {
            clearInterval(this.intervalTimer);
            resolve(response);

            break;
          }
        }
      }, PaymentService.PAYMENT_RETRY);
    });
  }

  /**
   * Execute the payment incl. polling of the result.
   *
   * @param      {string}  id        the token for the payment
   * @param      {number}  amount    the eve amount to buy
   * @param      {object}  customer  the customer object
   * @return     {promise}  resolved when done
   */
  private async executePayment(id: string, amount: number, customer: any): Promise<StatusInterface|Error> {
    // return the first resolving promise
    return Promise.race([
      this.getStatus(id, amount, customer),
      new Promise((_, reject) =>
          setTimeout(() => {
            clearInterval(this.intervalTimer);
            reject(new Error('timeout for payment'));
          }, PaymentService.PAYMENT_TIMEOUT)
      )
    ]);
  }

  /**
   * Returns stripe source data object.
   *
   * @param customer
   * @param param1
   */
  createStripeSourceData(customer, {type = 'card', currency = 'eur', notification_method = 'email'}) {
    const usageTypes = {
      card: 'single_use',
      sepa_debit: 'resuable'
    };

    return {
      type,
      currency,
      owner: {
        name: customer.shipping.name,
        email: customer.email
      },
      usage: usageTypes[type],
      mandate: {
        // Automatically send a mandate notification to your customer once the source is charged.
        notification_method,
      },
    };
  }

  /**
   * Trigger an EVE payment.
   *
   * @param customer - CustomerInterface, may be created by getCustomer() method.
   * @param eveAmount - desired amount of EVE.
   * @param options - optional object to overwrite certain stripe options. @see: createStripeSourceData()
   */
  async buyEve(customer: CustomerInterface, eveAmount: number, options?: OptionsInterface): Promise<StatusInterface> {
    if (!this.stripe) {
      throw new Error('Stripe was not initialized, can not start payment process');
    }

    const sourceData = this.createStripeSourceData(customer, options);
    const { source, error } = await this.stripe.sources.create(sourceData);

    if (error) {
      return {
        status: 'error',
        code: this.getErrorCode(error.message)
      };
    }

    if (!source) {
      throw new Error('Received neither `source` nor `error` from stripe createSource().');
    }

    let result = {};

    try {
      result = await this.executePayment(source.id, eveAmount, customer);
    } catch (error) {
      result = {
        status: 'error',
        code: this.getErrorCode(error.code)
      };
    }

    return result;
  }

  /**
   * Check VAT number against backend.
   *
   * @param country
   * @param vat
   */
  private async requestVatValidation(country: string, vat?: string): Promise<VatValidationInterface> {
    const requestUrl = `${ this.agentUrl }/smart-agents/payment-processor/checkVat`;
    const params = { country, vat };
    const { data: { result: { isValidVat, tax, error }}} = await axios.get(requestUrl, { params });

    if (error) {
      throw new Error(`Problem validation VAT Tax-ID: ${error}`);
    }

    return { isValidVat, tax };
  }

  /**
   * Validate VAT number and return result.
   *
   * @param vat
   */
  async validateVat(country: string, vat: string): Promise<VatValidationInterface> {
    return debounce(() => this.requestVatValidation(country, vat), 500);
  }

    /**
   * Returns the tax information object if vat number is set;
   *
   * @param vat
   */
  getTaxInfo(vat?: string) {
    return vat ? {
      tax_id: vat,
      type: 'vat'
    } : undefined;
  }

  /**
   * Create customer object from given fields.
   *
   * @param customer
   * - name
   * - email
   * - company
   * - street
   * - city
   * - zip
   * - country
   * - vat
   */
  getCustomer({ name, email, company, street, city, zip, country, vat }) {
    const tax_info = this.getTaxInfo(vat);

    return {
      email,
      shipping: {
        name,
        address: {
          city,
          country,
          line1: company || name,
          line2: street,
          postal_code: zip,
        }
      },
      tax_info
    };
  }
}
