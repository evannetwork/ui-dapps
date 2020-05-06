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
import { utils } from '@evan.network/api-blockchain-core';
import axios from 'axios';

import { ipfsPaymentDispatcher } from '../../dispatchers';
import { getAgentUrl } from '../../ipfs-utils';

interface ChannelStatus {
  fundsAvailable: number;
  monthlyPayments: number;
  overallSize: number;
  pinnedHashes: number;
}

@Component({})
export default class IpfsComponent extends mixins(EvanComponent) {
  /**
   * Current account to show the wallet for
   */
  accountId: string = null;

  channelStatus: ChannelStatus = {
    fundsAvailable: 0,
    monthlyPayments: 0,
    overallSize: 0,
    pinnedHashes: 0,
  };

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Watch for dispatcher updates
   */
  listeners: Array<any> = [];

  /**
   * amount of EVE which should be stored on the payment channel
   */
  amount = 0;

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
    this.accountId = this.getRuntime().activeAccount;
    this.channelStatus = await this.getStatus();

    // setup dispatcher watchers
    this.listeners.push(ipfsPaymentDispatcher.watch(async ($event: any) => {
      // if dispatcher was finished, reload data and reset form
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        // force ui to re-render
        this.loading = true;
        this.channelStatus = await this.getStatus();
        this.$nextTick(() => { this.loading = false; });
      }
    }));

    this.loading = false;
  }

  renderedOverview(): Array<any> {
    return [
      {
        title: '_wallet.ipfs.available-funds',
        icon: 'credit-card-outline',
        value: `${this.getReadableBalance(this.channelStatus.fundsAvailable)} EVE`,
      },
      {
        title: '_wallet.ipfs.monthly-costs',
        icon: 'calendar-month-outline',
        value: `${this.getReadableBalance(this.channelStatus.monthlyPayments)} EVE`,
      },
      {
        title: '_wallet.ipfs.stored-files',
        icon: 'file-sync-outline',
        value: this.channelStatus.pinnedHashes,
      },
      {
        title: '_wallet.ipfs.stored-size',
        icon: 'file-upload-outline',
        value: IpfsComponent.formatBytes(this.channelStatus.overallSize, 2),
      },
    ];
  }

  /**
   * Transform incoming bytes to a displayable version.
   *
   * @param      {number}  bytes     bytes that should be parsed
   * @param      {number}  decimals  amount of decimals, that should be displayed
   * @return     {string}  parsed displayable size
   */
  static formatBytes(bytes: number, decimals: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  }

  /**
   * Takes a amount of eve and parse them to be readable.
   *
   * @param      {number}  amount  amount of eve
   */
  getReadableBalance(amount: number): string {
    // load balance and parse it to 3 decimal places
    return ((Math.floor(amount * 100000) / 100000).toFixed(5) as any).toLocaleString(this.$i18n.locale());
  }

  async getStatus(): Promise<ChannelStatus> {
    const { data } = await axios({
      method: 'POST',
      url: `${getAgentUrl(this.getRuntime().environment)}/api/smart-agents/ipfs-payments/status/get`,
      headers: {
        Authorization: await utils.getSmartAgentAuthHeaders(this.getRuntime()),
      },
    });

    data.fundsAvailable = this.getRuntime().web3.utils.fromWei(data.fundsAvailable);
    data.monthlyPayments = this.getRuntime().web3.utils.fromWei(data.monthlyPayments);
    return data;
  }
}
