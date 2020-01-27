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
import axios from 'axios';
import { utils, Runtime } from '@evan.network/api-blockchain-core';
import { DAppTwin, TransactionsResponse, DigitalTwinResponse } from 'core/digital-twin-lib';

@Component
export default class DetailOverviewComponent extends mixins(EvanComponent) {
  twin: DAppTwin = null;

  runtime: Runtime = null;

  transactions = [
    {
      id: 0, amount: 0.01, name: 'Hans', date: '08.01.2020 13:01',
    },
    {
      id: 1, amount: 0.21, name: '0xfab7fc548d24dc0eae9aaf69ba4f8ced7bf18353', date: '03.01.2020 13:01',
    },
  ]

  async created(): Promise<void> {
    this.runtime = this.getRuntime();
    this.twin = this.$store.state.twin;
    await this.attachCreatedAt();
    // await this.getLastTransactions();
    console.log(this.twin);
  }

  async getLastTransactions() {
    const authHeaders = await utils.getSmartAgentAuthHeaders(this.runtime);
    const core = this.runtime.environment === 'testcore' ? '.test' : '';
    const url = `https://search${core}.evan.network/api/smart-agents/search`;

    const params = {
      count: 5,
      offset: 0,
      reverse: true,
      sortBy: 'timestamp',
      address: this.twin.contractAddress,
    };

    const { data } = await axios.get<TransactionsResponse>(
      `${url}/transactions/twin`,
      {
        headers: {
          Authorization: authHeaders,
        },
        params,
      },
    );
    console.log(data);
  }

  /**
   * Enhance the current twin with createdAt timestamp
   */
  async attachCreatedAt(): Promise<void> {
    const authHeaders = await utils.getSmartAgentAuthHeaders(this.runtime);
    const core = this.runtime.environment === 'testcore' ? '.test' : '';
    const url = `https://search${core}.evan.network/api/smart-agents/search`;

    const { data } = await axios.get<DigitalTwinResponse>(
      `${url}/twins`,
      {
        headers: {
          Authorization: authHeaders,
        },
        params: { searchTerm: this.twin.contractAddress },
      },
    );
    console.log(data);

    this.$store.state.twin.createdAt = data.results[0].created;
    this.twin = this.$store.state.twin;
  }
}
