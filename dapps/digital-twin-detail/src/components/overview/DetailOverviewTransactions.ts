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
import { Prop } from 'vue-property-decorator';
import { TwinTransaction } from '@evan.network/digital-twin-lib';

@Component
export default class DetailOverviewTransactionsComponent extends mixins(EvanComponent) {
  @Prop() transactions: TwinTransaction[];

  columns = [
    {
      key: 'feeInEve',
      label: this.$t('_twin-detail.overview.fee'),
    },
    {
      key: 'initiator',
      label: this.$t('_twin-detail.overview.initiator'),
    },
    {
      key: 'timestamp',
      label: this.$t('_twin-detail.overview.date'),
      thClass: 'th-date',
    },
  ];

  onRowClicked(row: TwinTransaction): void {
    const hash = row.relatedTransactionHash || row.hash;
    window.open(this.getRouteToTransactionExplorer(hash), '_blank');
  }

  getRouteToTransactionExplorer(transactionId: string): string {
    const baseUrl = this.getRuntime().environment === 'core'
      ? 'https://explorer.evan.network'
      : 'https://testexplorer.evan.network';

    return `${baseUrl}/tx/${transactionId}`;
  }
}
