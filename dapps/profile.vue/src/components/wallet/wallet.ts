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

import { sendEveDispatcher } from '../../dispatchers/registry';

@Component({})
export default class WalletComponent extends mixins(EvanComponent) {
  /**
   * Current display mode in side panel.
   */
  activeMode = 0;

  /**
   * Show loading symbol
   */
  loading = false;

  /**
   * Watch for dispatcher updates
   */
  listeners: Array<any> = [];

  /**
   * Unbind window resize watcher
   */
  beforeDestroy() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Bin window resize watcher to handle side panel state and handle send eve events.
   */
  async created() {
    // setup dispatcher watchers
    this.listeners.push(sendEveDispatcher.watch(async ($event: any) => {
      // if dispatcher was finished, reload data and reset formular
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        // force ui rerendering
        this.loading = true;
        this.$nextTick(() => this.loading = false);
      }
    }));

    const runtime = (this as any).getRuntime();
    const web3 = runtime.web3;
    const bRC = web3.eth.Contract([{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":true,"name":"receiver","type":"address"}],"name":"AddedReceiver","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"receivers","type":"address[]"},{"indexed":false,"name":"rewards","type":"uint256[]"}],"name":"Rewarded","type":"event"}], '0xdccb7f7ec90c99ba744986539dd73b897401954b')
    const paymentEvents = await bRC.getPastEvents('AddedReceiver', {
      filter: { receiver: runtime.activeAccount },
      fromBlock: 0,
      toBlock: 'latest'
    });
    const receivedPayments = await Promise.all(paymentEvents.map(async (entry) => {
      const block = await web3.eth.getBlock(entry.blockNumber);
      const amount = web3.utils.fromWei(entry.returnValues.amount.toString());
      return {
        timestamp: block.timestamp,
        amount
      }
    }));
  }
}
