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

import * as bcc from '@evan.network/api-blockchain-core';
import axios from 'axios';
import { agentUrl } from '@evan.network/ui';

import {
  ErrorStatus,
  CustomerInterface,
  OptionsInterface,
  VatValidationInterface,
  TransferringTransactionInterface,
  CustomerParams
} from './interfaces';
import { PUB_KEY, stripeScriptId, stripeScriptPath } from './stripe-config';
import { StatusResponse } from './StatusResponse.interface';
import { StripeSource } from './StripeSource.interface';
import moment from 'moment';

declare var Stripe: any;

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
  constructor(runtime: any) {
    this.agentUrl = `${ agentUrl }/api`;
    this.runtime = runtime;
  }

  /**
   * Ensure that stripe is loaded.
   */
  async ensureStripe() {
    return new Promise((resolve) => {
      if (document.getElementById(stripeScriptId) !== null) {
        this.initStripe();
        return resolve();
      } else {
        const s = document.createElement('script');

        s.setAttribute('id', stripeScriptId);
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', stripeScriptPath);

        s.onload = () => {
          this.initStripe();
          resolve();
        };

        document.head.append(s);
      }
    });
  }

  private initStripe() {
    this.stripe = Stripe(PUB_KEY);
  }

  /**
   * Returns stripe source data object.
   *
   * @param customer
   * @param options
   */
  createStripeSourceData(
    customer: CustomerInterface,
    { type = 'card', currency = 'eur', notification_method = 'email' }
  ): StripeSource {
    const usageTypes = {
      card: 'single_use',
      sepa_debit: 'reusable'
    };

    return {
      type: type,
      currency: currency,
      owner: {
        name: customer.shipping.name,
        email: customer.email,
        address: customer.shipping.address
      },
      usage: usageTypes[type],
      mandate: {
        notification_method: notification_method
      }
    };
  }

  /**
   * Trigger an EVE payment.
   *
   * @param customer - CustomerInterface, may be created by getCustomer() method.
   * @param eveAmount - desired amount of EVE.
   * @param stripeElement stripe element containing data (iban or credit card)
   * @param options - optional object to overwrite certain stripe options. @see: createStripeSourceData()
   */
  async buyEve(
    customer: CustomerInterface,
    eveAmount: string,
    stripeElement: any,
    options?: OptionsInterface
  ): Promise<StatusResponse | ErrorStatus> {
    let source, error;

    try {
      const sourceData = this.createStripeSourceData(customer, options);
      const stripeSourceResult = await this.stripe.createSource(stripeElement, sourceData);

      source = stripeSourceResult.source;
      error = stripeSourceResult.error;
    } catch (ex) {
      error = this.getErrorCode(ex.message);
      console.error(ex.message);
    }

    // do not continue with an error
    if (!error) {
      if (!source) {
        throw new Error(
          'Received neither `source` nor `error` from stripe createSource().'
        );
      }

      try {
        return await this.executePayment(source.id, eveAmount, customer);
      } catch (ex) {
        error = this.getErrorCode(ex.message);
        console.error(ex.message);
      }
    }

    // ensure central error handling
    if (error) {
      return {
        status: 'error',
        code: this.getErrorCode(error.message)
      };
    }
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
    customer: any,
    requestId = this.requestId
  ): Promise<StatusResponse> {
    return new Promise(async resolve => {
      const res = await axios.post<StatusResponse>(
        `${this.agentUrl}/smart-agents/payment-processor/executePayment`,
        {
          token: id,
          amount,
          customer,
          requestId
        },
        {
          headers: {
            authorization: await this.getAuthHeaders()
          }
        }
      );
      resolve(res.data);
    });
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

        switch (response.status) {
          case 'error':
            clearInterval(this.intervalTimer);
            reject(response);
            break;
          case 'new':
            this.requestId = response.result;
            break;
          case 'transferring':
            this.setTransactionIntoLocalStorage(response);
          // tslint:disable-next-line: no-switch-case-fall-through
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
   * set transfering transaction into local storage for later status queries
   */
  private setTransactionIntoLocalStorage(response: StatusResponse): void {
    const transaction: TransferringTransactionInterface = {
      token: response.requesterInformation.receivedParams.token,
      amount: parseFloat(response.requesterInformation.receivedParams.amount),
      customer: response.requesterInformation.receivedParams.customer,
      requestId: this.requestId,
      timestamp: response.serverInformation.currentTime,
      type: 'transferringTransaction'
    };

    // get all transferring transactions from local storage
    const transactions = window.localStorage['evan-credit-recharge']
      ? JSON.parse(window.localStorage['evan-credit-recharge'])
      : [];
    // add new element
    transactions.push(transaction);
    // save all transactions into local storage again
    window.localStorage['evan-credit-recharge'] = JSON.stringify(transactions);
  }

  /**
   * get all transferring transactions from local storage
   */
  async getTransactionsFromLocalStorage(): Promise<TransferringTransactionInterface[]> {
    // get transactions from local storage
    let transactions = window.localStorage['evan-credit-recharge']
      ? JSON.parse(window.localStorage['evan-credit-recharge'])
      : [];
    // filter null objects
    transactions = transactions.filter(e => e);

    // check transferring transaction status
    let transferringTransactions = await this.checkTransferringTransactions(transactions);
    // filter null objects
    transferringTransactions = transferringTransactions.filter(e => e);

    // write transaction back to local storage
    if (transferringTransactions.length > 0) {
      window.localStorage['evan-credit-recharge'] = JSON.stringify(transferringTransactions);
    } else {
      delete window.localStorage['evan-credit-recharge'];
    }

    return transferringTransactions;
  }

  /**
   * check the current states of transferring transactions and
   * filter out old transactions
   *
   * @param {TransferringTransaction[]} transactions
   */
  private async checkTransferringTransactions(
    transactions: TransferringTransactionInterface[]
  ): Promise<TransferringTransactionInterface[]> {
    return transactions.length <= 0 ? [] : Promise.all(
      transactions.map(async element => {
        // delete transaction from local storage
        // if type is failedTransaction and timestamp is older than 1 week
        if (element.type === 'failedTransaction') {
          if (moment(element.timestamp).add(1, 'week').isBefore(moment())) {
            return null;
          }
          return element;
        }

        const response = await this.checkStatus(
          element.token,
          element.amount.toString(),
          element.customer,
          element.requestId
        );

        // delete transaction from local storage if status is "success"
        if (response.status === 'success') {
          return null;
        }

        // rename type from 'transferringTransaction' to 'failedTransaction'
        if (response.status === 'error') {
          element.type = 'failedTransaction';
        }

        return element;
      })
    );
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
    const requestUrl = `${ this.agentUrl }/smart-agents/payment-processor/checkVat`;
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

  getStripeElements(locale) {
    return this.stripe.elements({ locale, });
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
