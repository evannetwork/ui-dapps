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

import { EvanComponent } from '@evan.network/ui-vue-core';

import Component, { mixins } from 'vue-class-component';
import blockRewardContractInterface from './blockRewardContractInterface';
import { PaymentService } from '../paymentService';

interface TransactionInterface {
  amount: number;
  from?: string;
  timestamp: number;
  to?: string;
  type: string; // empty, creditCharged, send, received
}

@Component({})
export default class TransactionsComponent extends mixins(EvanComponent) {
  /**
   * Show loading symbol.
   */
  loading = true;

  /**
   * All transactions that are done / received by the user.
   */
  transactions: Array<TransactionInterface> = null;

  /**
   * Url of the evan.network explorer, related to the selected chain.
   */
  explorerTransactionsUrl: string = null;

  /**
   * amount of displayed transactions
   */
  displayedTransactions = 5;

  /**
   * payment service instance
   */
  paymentService: PaymentService;

  /**
   * Watch for dispatcher updates
   */
  listeners: Array<any> = [];

  /**
   * Clear dispatcher listeners
   */
  beforeDestroy(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Load last transactions.
   */
  async created(): Promise<void> {
    const runtime = this.getRuntime();

    // setup payment service
    this.paymentService = new PaymentService(runtime);

    // use this link for viewing all transactions on explorer
    this.explorerTransactionsUrl = runtime.environment === 'core'
      ? 'https://explorer.evan.network'
      : 'https://testexplorer.evan.network';

    this.explorerTransactionsUrl = `${this.explorerTransactionsUrl}/address/${runtime.activeIdentity}/transactions`;

    // watch for buy eve events
    const reload = () => this.loadTransactions();
    window.addEventListener('evan-credit-recharge', reload);
    this.listeners.push(() => window.removeEventListener('evan-credit-recharge', reload));

    // load all the transactions and show the ui
    await this.loadTransactions();
  }

  /**
   * Load all transactions from charged credits. (add search integration later)
   */
  async loadTransactions(): Promise<void> {
    this.loading = true;

    // load last credits
    const charged = await this.loadChargedCredits();
    // load transferring transactions from local storage
    const transferringTransactions = await this.paymentService.getTransactionsFromLocalStorage();

    this.transactions = [...charged, ...transferringTransactions];

    this.transactions = this.transactions
      // filter null object
      .filter((item) => item)
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

    this.loading = false;
  }

  /**
   * Load all transactions where the current user buyed eve.
   */
  async loadChargedCredits(): Promise<Array<TransactionInterface>> {
    const runtime = this.getRuntime();
    const { web3 } = runtime;
    const bRC = web3.eth.Contract(
      blockRewardContractInterface,
      runtime.environment === 'core'
        ? '0x1000000000000000000000000000000000000002'
        : '0xdccb7f7ec90c99ba744986539dd73b897401954b',
    );

    const paymentEvents = await bRC.getPastEvents('AddedReceiver', {
      filter: { receiver: runtime.activeIdentity },
      fromBlock: 0,
      toBlock: 'latest',
    });

    const receivedPayments: Array<TransactionInterface> = await Promise.all(
      paymentEvents.map(async (entry) => {
        const block = await web3.eth.getBlock(entry.blockNumber);
        const amount = web3.utils.fromWei(entry.returnValues.amount.toString());
        return {
          amount: parseFloat(amount),
          timestamp: block.timestamp,
          type: 'creditCharged',
        };
      }),
    );

    return receivedPayments;
  }

  /**
   * Render only X transactions.
   */
  renderedTransactions(): TransactionInterface[] {
    return this.transactions.slice(0, this.displayedTransactions);
  }
}
