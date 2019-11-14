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

// TODO: customer interface, response interface (https://github.com/axios/axios/issues/1510)

export class PaymentService {
  private static PAYMENT_TIMEOUT = 1000 * 60 * 10; // 10 minutes
  private static PAYMENT_RETRY = 5000; // 5 seconds

  private intervalTimer = null;
  private requestId = null;
  private agentUrl = null;

  /**
   * Initialise the payment service with the agent url.
   *
   * @param agentUrl
   */
  constructor(agentUrl = 'https://agents.test.evan.network/api') {
    this.agentUrl = agentUrl;
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
   * Check current payment state against smart agent
   *
   * @param id
   * @param amount
   * @param customer
   * @param headers
   */
  private async checkStatus(id: string, amount: number, customer: any, headers = {}): Promise<any> {
    return axios.post(`${ this.agentUrl }/smart-agents/payment-processor/executePayment`, {
      token: id,
      amount,
      customer,
      requestId: this.requestId
    }, {
      headers
    });
  }

  /**
   * Request every 5 seconds and resolves when we got success or transferring status.
   * Reject on error response.
   *
   * @param id
   * @param amount
   * @param customer
   * @param headers
   */
  private async getStatus (id: string, amount: number, customer: any, headers?: any) {
    return new Promise((resolve, reject) => {
      this.intervalTimer = setInterval( async () => {
        const response = await this.checkStatus(id, amount, customer, headers);

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

  // try {
  //   this.paymentResponse = await this.executePayment(source.id, amount, customer, headers)
  // } catch (error) {
  //   this.paymentResponse = {
  //     status: 'error',
  //     code: this.getErrorCode(error.code)
  //   }
  // };

  /**
   * Execute the payment incl. polling of the result.
   *
   * @param      {string}  id        the token for the payment
   * @param      {number}  amount    the eve amount to buy
   * @param      {object}  customer  the customer object
   * @param      {object}  headers   additional headers to send
   * @return     {promise}  resolved when done
   */
  public async executePayment(id: string, amount: number, customer: any, headers?: any) {
    // return the first resolving promise
    return Promise.race([
      this.getStatus(id, amount, customer, headers),
      new Promise((_, reject) =>
          setTimeout(() => {
            clearInterval(this.intervalTimer);
            reject(new Error('timeout for payment'));
          }, PaymentService.PAYMENT_TIMEOUT)
      )
    ]);
  }

  /**
   *
   * @param country
   * @param vat
   */
  async requestVatValidation(country: string, vat: string) {
    // const requestUrl = `${ this.agentUrl }/smart-agents/payment-processor/checkVat?country=${country}${vat ? '&vat=' + vat : ''}`;
    const requestUrl = `${ this.agentUrl }/smart-agents/payment-processor/checkVat`;
    const params = {
      country,
      vat  /// TODO check without vat is possible???
    };
    const { result: {isValidVat, tax, error} } = await axios.get(requestUrl, { params });

    if (error) {
      throw new Error(`Problem validation VAT Tax-ID: ${error}`);
    }

    return {isValidVat, tax, error};

  }

  /**
   * Validate VAT number and update UI.
   *
   * @param vat
   */
  public async validateVat(vat: string) {
    const timeout = 500;

    return debounce(this.requestVatValidation, 500);
  }
}
