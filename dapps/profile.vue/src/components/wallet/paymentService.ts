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

import { StatusInterface, CustomerInterface, OptionsInterface, VatValidationInterface } from './interfaces';

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
   * @param stripe
   * @param agentUrl
   */
  constructor(stripe: any, runtime: any, agentUrl = 'https://agents.test.evan.network/api') {
    this.agentUrl = agentUrl;
    this.stripe = stripe;
    this.runtime = runtime;
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
    const { data: { status, code } } = await axios.post(
      `${this.agentUrl}/smart-agents/payment-processor/executePayment`, {
      token: id,
      amount,
      customer,
      requestId: this.requestId
    }, {
      headers: {
        authorization: await this.getAuthHeaders()
      }
    }
    );

    return { status, code };
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
  private async getStatus(id: string, amount: number, customer: any): Promise<StatusInterface> {
    return new Promise((resolve, reject) => {
      this.intervalTimer = setInterval(async () => {
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
  private async executePayment(id: string, amount: number, customer: any): Promise<StatusInterface> {
    // return the first resolving promise
    return Promise.race([
      this.getStatus(id, amount, customer),
      new Promise<StatusInterface>((resolve) =>
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
   * Returns stripe source data object.
   *
   * @param customer
   * @param param1
   */
  createStripeSourceData(customer, { type = 'card', currency = 'eur', notification_method = 'email' } = {}) {
    const usageTypes = {
      card: 'single_use',
      sepa_debit: 'reusable'
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

    return await this.executePayment(source.id, eveAmount, customer);
  }

  /**
   * Check VAT number against backend.
   *
   * @param country
   * @param vat
   */
  private async requestVatValidation(country: string, vat?: string): Promise<VatValidationInterface> {
    const requestUrl = `${this.agentUrl}/smart-agents/payment-processor/checkVat`;
    const params = { country, vat };
    const { data: { result: { isValidVat, tax, error } } } = await axios.get(requestUrl, { params });

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
  getCustomer({ name, email, company, street, city, zip, country, vat }): CustomerInterface {
    const tax_info = vat ? {
      tax_id: vat,
      type: 'vat'
    } : undefined;

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



/**
 * TODO: v3 version!
 *
 * Backend:
 * https://github.com/stripe-samples/accept-a-card-payment/blob/master/using-webhooks/server/node/server.js
 *
 * Frontend: https://github.com/stripe-samples/accept-a-card-payment/tree/master/using-webhooks/client/web
 *
 */

export class PaymentServiceV3 {
  private agentUrl = null;
  private stripe;
  private authorization;
  private runtime;

  private elementStyles = { // TODO: evvan styles
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
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
  }

  /**
   * Check current payment state against smart agent.
   *
   * @param id
   * @param amount
   * @param customer
   */
  public async createPaymentIntent(amount: number, customer: any, Stripe: any): Promise<any> {
    const { data: { publishableKey, clientSecret } } = await axios.post(
      `${this.agentUrl}/smart-agents/payment-processor/createPaymentIntent`, {
      amount,   // amount in EVE
      customer, // customer data necessary for calculating VAT and stuff...
    }, {
      headers: {
        authorization: await this.getAuthHeaders()
      }
    }
    );

    // Set up Stripe.js and Elements to use in checkout form
    return this.setupElements(publishableKey, clientSecret, Stripe);
  }

  private setupElements(publishableKey: string, clientSecret: string, Stripe: any) {
    this.stripe = Stripe(publishableKey);

    const elements = this.stripe.elements();

    // TODO: card vs sepa
    const card = elements.create('card', { style: this.elementStyles });
    const sepa = elements.create('sepa...?', { style: this.elementStyles });
    card.mount("#card-element"); // TODO: call in FE

    return {
      stripe: this.stripe,
      card,
      sepa,
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
    return stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: card // TODO
        }
      });
      // .then(function (result) {
      //   if (result.error) {
      //     // Show error to your customer
      //     showError(result.error.message); // TODO return
      //   } else {
      //     // The payment has been processed!
      //     orderComplete(clientSecret);
      //   }
      // });
  }

  orderComplete(clientSecret) {
    return this.stripe.retrievePaymentIntent(clientSecret);  // TODO: check success in UI, disable loading state
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
  getCustomer({ name, email, company, street, city, zip, country, vat }): CustomerInterface {
    const tax_info = vat ? {
      tax_id: vat,
      type: 'vat'
    } : undefined;

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

// // Disable the button until we have Stripe set up on the page
// // document.querySelector("button").disabled = true;

// fetch("/create-payment-intent", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify(orderData)
// })
//   .then(function (result) {
//     return result.json();
//   })
//   .then(function (data) {
//     return setupElements(data);
//   })
//   .then(function ({ stripe, card, clientSecret }) {
//     // document.querySelector("button").disabled = false;

//     // Handle form submission.
//     var form = document.getElementById("payment-form");
//     form.addEventListener("submit", function (event) {
//       event.preventDefault();
//       // Initiate payment when the submit button is clicked
//       pay(stripe, card, clientSecret);
//     });
//   });

// // Set up Stripe.js and Elements to use in checkout form
// var setupElements = function (data) {
//   stripe = Stripe(data.publishableKey);
//   var elements = stripe.elements();
//   var style = {
//     base: {
//       color: "#32325d",
//       fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//       fontSmoothing: "antialiased",
//       fontSize: "16px",
//       "::placeholder": {
//         color: "#aab7c4"
//       }
//     },
//     invalid: {
//       color: "#fa755a",
//       iconColor: "#fa755a"
//     }
//   };

//   var card = elements.create("card", { style: style });
//   card.mount("#card-element");

//   return {
//     stripe: stripe,
//     card: card,
//     clientSecret: data.clientSecret
//   };
// };

// /*
//  * Calls stripe.confirmCardPayment which creates a pop-up modal to
//  * prompt the user to enter extra authentication details without leaving your page
//  */
// var pay = function (stripe, card, clientSecret) {
//   changeLoadingState(true);

//   // Initiate the payment.
//   // If authentication is required, confirmCardPayment will automatically display a modal
//   stripe
//     .confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: card
//       }
//     })
//     .then(function (result) {
//       if (result.error) {
//         // Show error to your customer
//         showError(result.error.message);
//       } else {
//         // The payment has been processed!
//         orderComplete(clientSecret);
//       }
//     });
// };

// /* ------- Post-payment helpers ------- */

// /* Shows a success / error message when the payment is complete */
// var orderComplete = function (clientSecret) {
//   stripe.retrievePaymentIntent(clientSecret).then(function (result) {
//     var paymentIntent = result.paymentIntent;
//     var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

//     document.querySelector(".sr-payment-form").classList.add("hidden");
//     document.querySelector("pre").textContent = paymentIntentJson;

//     document.querySelector(".sr-result").classList.remove("hidden");
//     setTimeout(function () {
//       document.querySelector(".sr-result").classList.add("expand");
//     }, 200);

//     changeLoadingState(false);
//   });
// };

// // var showError = function (errorMsgText) {
// //   changeLoadingState(false);
// //   var errorMsg = document.querySelector(".sr-field-error");
// //   errorMsg.textContent = errorMsgText;
// //   setTimeout(function () {
// //     errorMsg.textContent = "";
// //   }, 4000);
// // };

// // Show a spinner on payment submission
// // var changeLoadingState = function (isLoading) {
// //   if (isLoading) {
// //     document.querySelector("button").disabled = true;
// //     document.querySelector("#spinner").classList.remove("hidden");
// //     document.querySelector("#button-text").classList.add("hidden");
// //   } else {
// //     document.querySelector("button").disabled = false;
// //     document.querySelector("#spinner").classList.add("hidden");
// //     document.querySelector("#button-text").classList.remove("hidden");
// //   }
// // };
