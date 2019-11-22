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
import { debounce } from 'lodash';
import * as bcc from '@evan.network/api-blockchain-core';

import {
  ErrorStatus,
  CustomerInterface,
  OptionsInterface,
  VatValidationInterface,
  CustomerParams  
} from './interfaces';
import { StatusResponse } from './StatusResponse.interface';
import { StripeSource } from './StripeSource.interface';

declare var Stripe: any;

const PUB_KEY = 'pk_test_kpO3T5fXA7aaftg9D0OO0w3S';

export class PaymentService {
  private static PAYMENT_TIMEOUT = 1000 * 60 * 10; // 10 minutes
  private static PAYMENT_RETRY = 5000; // 5 seconds

  private intervalTimer = null;
  private requestId = null;
  private agentUrl = null;
  private stripe;
  private authorization;
  private runtime;

  /**
   * Initialize the payment service with the agent url.
   *
   * @param agentUrl
   */
  constructor(
    runtime: any,
    agentUrl = 'https://agents.test.evan.network/api'
  ) {
    this.agentUrl = agentUrl;
    this.runtime = runtime;
  }

  initStripe() {
    this.stripe = Stripe(PUB_KEY);
  }  

  /**
   * Returns stripe source data object.
   * TODO: Params look weird still
   * @param customer
   * @param param1
   */
  createStripeSourceData(
    customer: CustomerInterface,
    { type = 'card', currency = 'eur', notification_method = 'email' } = {}
  ): StripeSource {
    const usageTypes = {
      card: 'single_use',
      sepa_debit: 'reusable'
    };

    return {
      type,
      currency,
      owner: {
        name: customer.shipping.name,
        email: customer.email,
        address: customer.shipping.address
      },
      usage: usageTypes[type],
      mandate: {
        // Automatically send a mandate notification to your customer once the source is charged.
        notification_method
      }
    };
  }

  /**
   * Trigger an EVE payment.
   *
   * @param customer - CustomerInterface, may be created by getCustomer() method.
   * @param eveAmount - desired amount of EVE.
   * @param options - optional object to overwrite certain stripe options. @see: createStripeSourceData()
   */
  async buyEve(
    customer: CustomerInterface,
    eveAmount: string,
    card: any,
    options?: OptionsInterface
  ): Promise<StatusResponse | ErrorStatus> {
    const sourceData = this.createStripeSourceData(customer, options);
    const { source, error } = await this.stripe.createSource(card, sourceData);

    if (error) {
      return {
        status: 'error',
        code: this.getErrorCode(error.message)
      };
    }

    if (!source) {
      throw new Error(
        'Received neither `source` nor `error` from stripe createSource().'
      );
    }

    return await this.executePayment(source.id, eveAmount, customer);
  }

  /**
   * Check current payment state against smart agent.
   *
   * @param id
   * @param amount
   * @param customer
   */
  private async checkStatus(
    id: string,
    amount: string,
    customer: any
  ): Promise<StatusResponse> {
    return new Promise(async(resolve) => {
      const res = await axios.post<StatusResponse>(
        `${this.agentUrl}/smart-agents/payment-processor/executePayment`,
        {
          token: id,
          amount,
          customer,
          requestId: this.requestId
        },
        {
          headers: {
            authorization: await this.getAuthHeaders()
          }
        }
      );
      resolve(res.data);
    })
  }

  /**
   * Set auth header data to authenticate with current account against the payment smart agent.
   *
   * @param authorization
   */
  private async getAuthHeaders(): Promise<string> {
    if (this.authorization) {
      return this.authorization;
    }

    this.authorization = await bcc.utils.getSmartAgentAuthHeaders(this.runtime);

    return this.authorization;
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
  private async getStatus(
    id: string,
    amount: string,
    customer: any
  ): Promise<StatusResponse> {
    return new Promise((resolve, reject) => {
      this.intervalTimer = setInterval(async () => {
        const response = await this.checkStatus(id, amount, customer); 

        console.log('this.requestId', this.requestId);
        console.log('response', response);
        
        switch (response.status) {
          case 'error':
            clearInterval(this.intervalTimer);
            reject(response);
            break;        
          case 'new':
            this.requestId = response.result;
            break;          
          case 'transferring':
          case 'success':
            clearInterval(this.intervalTimer);
            resolve(response);
            break;          
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
  private async executePayment(
    id: string,
    amount: string,
    customer: any
  ): Promise<StatusResponse | ErrorStatus> {
    // return the first resolving promise
    return Promise.race([
      this.getStatus(id, amount, customer),
      new Promise<ErrorStatus>(resolve =>
        setTimeout(() => {
          clearInterval(this.intervalTimer);
          resolve({
            code: 'timeout',
            status: 'error',
            result: 'timeout for payment'
          });
        }, PaymentService.PAYMENT_TIMEOUT)
      )
    ]);
  }

  /**
   * Check VAT number against backend.
   *
   * @param country
   * @param vat
   */
  private async requestVatValidation(
    country: string,
    vat?: string
  ): Promise<VatValidationInterface> {
    const requestUrl = `${this.agentUrl}/smart-agents/payment-processor/checkVat`;
    const params = { country, vat };
    const {
      data: {
        result: { isValidVat, tax, error }
      }
    } = await axios.get(requestUrl, { params });

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
  // async validateVat(
  //   country: string,
  //   vat: string
  // ): Promise<VatValidationInterface> {
  //   return debounce(() => this.requestVatValidation(country, vat), 500);
  // }

  /**
   * Create customer object from given fields.
   *
   * @param customer
   */
  getCustomer(customer: CustomerParams): CustomerInterface {
    const { name, email, company, street, city, zip, country, vat } = customer;
    const tax_info = vat
      ? {
          tax_id: vat,
          type: 'vat'
        }
      : undefined;

    return {
      email,
      shipping: {
        name,
        address: {
          city,
          country,
          line1: company || name,
          line2: street,
          postal_code: zip
        }
      },
      tax_info
    };
  }

  getStripeElements() {
    return this.stripe.elements();
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
}
