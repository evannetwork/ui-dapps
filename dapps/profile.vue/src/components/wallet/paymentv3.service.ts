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
import * as bcc from '@evan.network/api-blockchain-core';

import { CustomerInterface, CustomerParams } from './interfaces';

/**
 * TODO: v3 version!
 *
 * Backend:
 * https://github.com/stripe-samples/accept-a-card-payment/blob/master/using-webhooks/server/node/server.js
 *
 * Frontend: https://github.com/stripe-samples/accept-a-card-payment/tree/master/using-webhooks/client/web
 *
 */

declare let Stripe: any;

export class PaymentServiceV3 {
  private agentUrl = null;
  private stripe;
  private authorization;
  private runtime;

  card;

  private elementStyles = {
    // TODO: evan styles
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  /**
   * Initialize the payment service with the agent url.
   *
   * @param stripe
   * @param agentUrl
   */
  constructor(runtime: any, agentUrl = 'https://agents.test.evan.network/api') {
    this.agentUrl = agentUrl;
    this.runtime = runtime;

    this.initStripe('pk_test_kpO3T5fXA7aaftg9D0OO0w3S');
  }

  initStripe(apiKey: string) {
    this.stripe = Stripe(apiKey);
    // let elements = this.stripe.elements();

    console.log(this.stripe);
    console.log(this.card);
  }

  /**
   * Check current payment state against smart agent.
   *
   * @param id
   * @param amount in EVE
   * @param customer customer data necessary for calculating VAT and stuff...
   */
  public async createPaymentIntent(
    amount: number,
    customer: any
  ): Promise<any> {
    const {
      data: { publishableKey, clientSecret }
    } = await axios.post(
      `${this.agentUrl}/smart-agents/payment-processor/createPaymentIntent`,
      {
        amount,
        customer
      },
      {
        headers: {
          authorization: await this.getAuthHeaders()
        }
      }
    );

    console.log('pub', publishableKey);
    console.log('priv', clientSecret);

    // Set up Stripe.js and Elements to use in checkout form
    return this.setupElements(publishableKey, clientSecret);
  }

  private setupElements(publishableKey: string, clientSecret: string) {
    this.stripe = Stripe(publishableKey);

    const elements = this.stripe.elements();

    // TODO: card vs sepa
    const card = elements.create('card', { style: this.elementStyles });
    // const sepa = elements.create('sepa...?', { style: this.elementStyles });
    // card.mount('#card'); // TODO: call in FE

    return {
      stripe: this.stripe,
      card,
      clientSecret
    };
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

  /*
   * Calls stripe.confirmCardPayment which creates a pop-up modal to
   * prompt the user to enter extra authentication details without leaving your page
   */
  pay(stripe, card, clientSecret, method = 'card') {
    // Initiate the payment.
    // If authentication is required, confirmCardPayment will automatically display a modal
    return stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card // TODO
      }
    });
  }

  orderComplete(clientSecret) {
    return this.stripe.retrievePaymentIntent(clientSecret); // TODO: check success in UI, disable loading state
  }

  /**
   * Create customer object from given fields.
   *
   * @param customer
   */
  getCustomer(customer: CustomerParams): CustomerInterface {
    const { name, email, company, street, city, zip, country, vat } = customer;
    let tax_info = undefined;

    if (vat) {
      tax_info = {
        tax_id: vat,
        type: 'vat'
      };
    }

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
}
