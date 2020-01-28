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
  Profile,
  ProfileOptions,
} from '@evan.network/api-blockchain-core';
import { DAppTwin, TwinTransaction } from 'core/digital-twin-lib';
import { bccUtils } from '@evan.network/ui';
import { CommunicationService } from './CommunicationService';

@Component
export default class DetailOverviewComponent extends mixins(EvanComponent) {
  twin: DAppTwin = null;

  runtime: Runtime = null;

  transactions: TwinTransaction[] = null;

  communicationService: CommunicationService = null;

  async created(): Promise<void> {
    this.runtime = this.getRuntime();
    this.communicationService = new CommunicationService(this.runtime);
    this.twin = this.$store.state.twin;
    await this.attachCreatedAt();
    await this.getLastTransactions();
  }

  async getLastTransactions(): Promise<void> {
    this.transactions = await this.communicationService.getLastTransactions(
      this.twin.contractAddress,
    );
    this.transactions = await this.enhanceTransactions(this.transactions);
  }

  /**
   * Enhance the current twin with createdAt timestamp
   */
  async attachCreatedAt(): Promise<void> {
    const timestamp = this.communicationService.getCreatedTimestamp(
      this.twin.contractAddress,
    );

    this.$store.state.twin.createdAt = timestamp;
    this.twin = this.$store.state.twin;
  }

  /**
   * Adds and formats properties for displaying Transactions
   * @param transactions list of transactions to be transformed
   */
  async enhanceTransactions(
    transactions: TwinTransaction[],
  ): Promise<TwinTransaction[]> {
    return Promise.all(
      transactions.map(async (transaction) => {
        const enhancedTransaction = transaction;

        // Add alias of the initiator if known
        enhancedTransaction.initiator = await bccUtils.getUserAlias(
          new Profile({
            accountId: this.runtime.activeAccount,
            profileOwner: transaction.from,
            ...(this.runtime as ProfileOptions),
          }),
        );

        // Add fee in EVE
        enhancedTransaction.feeInEve = parseFloat(
          this.runtime.web3.utils.fromWei(
            (transaction.gas * parseFloat(transaction.gasPrice)).toString(),
            'ether',
          ),
        ).toFixed(5);

        return enhancedTransaction;
      }),
    );
  }
}
