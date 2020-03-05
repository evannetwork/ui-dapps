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

import { bccHelper } from '@evan.network/ui-session';
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
   * Currents users eve balances
   */
  balance = 0.0;

  /**
   * Unbind window resize watcher
   */
  beforeDestroy(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Bin window resize watcher to handle side panel state and handle send eve events.
   */
  async created(): Promise<void> {
    await this.loadBalance();

    // setup dispatcher watchers
    this.listeners.push(sendEveDispatcher.watch(async ($event: any) => {
      // if dispatcher was finished, reload data and reset form
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        // force ui to re-render
        this.loading = true;
        this.$nextTick(() => { this.loading = false; });
      }
    }));
  }

  async loadBalance(): Promise<void> {
    const balance = await bccHelper.getBalance(this.getRuntime().activeAccount);
    this.balance = parseFloat(balance.toString());
  }
}
