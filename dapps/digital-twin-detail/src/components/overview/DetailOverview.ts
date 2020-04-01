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

import Component, { mixins } from 'vue-class-component';
import { EvanComponent } from '@evan.network/ui-vue-core';
import {
  Runtime,
} from '@evan.network/api-blockchain-core';

import { DAppTwin, TwinTransaction, SearchService } from '@evan.network/digital-twin-lib';
import { bccUtils, profileUtils } from '@evan.network/ui';

@Component
export default class DetailOverviewComponent extends mixins(EvanComponent) {
  twin: DAppTwin = null;

  runtime: Runtime = this.getRuntime();

  transactions: TwinTransaction[] = null;

  search: SearchService = null;

  did = '';

  async created(): Promise<void> {
    this.search = new SearchService(this.runtime);

    if (!this.$store.state.twin.createdAt) {
      this.$store.state.twin = await this.attachCreatedAt(this.$store.state.twin);
    }
    this.twin = this.$store.state.twin;
    this.transactions = await this.getLastTransactions(this.twin);
    this.did = bccUtils.getDidFromIdentity(this.getRuntime(), this.twin.description.identity);
  }

  /**
   * Fetch last transactions for given twin and enhance them with useful info
   */
  async getLastTransactions(twin: DAppTwin): Promise<TwinTransaction[]> {
    const transactions = await this.search.getLastTransactions(
      twin.contractAddress,
    );

    return this.enhanceTransactions(transactions);
  }

  /**
   * Enhance the twin with createdAt timestamp
   */
  async attachCreatedAt(twin: DAppTwin): Promise<DAppTwin> {
    const enhancedTwin = twin;
    enhancedTwin.createdAt = await this.search.getCreatedTimestamp(
      twin.contractAddress,
    );

    return enhancedTwin;
  }

  /**
   * Adds and formats properties for displaying Transactions
   * @param transactions list of transactions to be transformed
   */
  async enhanceTransactions(
    transactions: TwinTransaction[],
  ): Promise<TwinTransaction[]> {
    const initiators: { [address: string]: Promise<string> } = { };

    return Promise.all(
      transactions.map(async (transaction) => {
        const enhancedTransaction = transaction;

        // load initiator only once
        if (!initiators[transaction.from]) {
          initiators[transaction.from] = profileUtils.getUserAlias(
            this.runtime, transaction.from,
          );
        }

        // Add alias of the initiator if known
        enhancedTransaction.initiator = await initiators[transaction.from];

        // Add fee in EVE
        try {
          const gasUsed = transaction.relatedTransactionGas || transaction.gas;
          const gasPrice = transaction.relatedTransactionGasPrice || transaction.gasPrice;
          enhancedTransaction.feeInEve = parseFloat(
            this.runtime.web3.utils.fromWei(
              (gasUsed * parseFloat(gasPrice)).toString(),
              'ether',
            ),
          ).toFixed(3);
        } catch (err) {
          this.runtime.logger.log(`Error while calculating EVE fee ${err.message}.`, 'error');
        }

        return enhancedTransaction;
      }),
    );
  }
}
