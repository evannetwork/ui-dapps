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
import { utils, Runtime } from '@evan.network/api-blockchain-core';
import { DigitalTwinResponse } from './interfaces/DigitalTwinResponse';
import { QueryOptions } from './interfaces/SearchInterface';
import { TwinTransaction, TransactionsResponse } from './interfaces/DigitalTwinTransaction';

export class SearchService {
  runtime: Runtime = null;

  requestUrl: string = null;

  constructor(runtime: Runtime) {
    this.runtime = runtime;
    const core = runtime.environment === 'testcore' ? '.test' : '';
    this.requestUrl = `https://search${core}.evan.network/api/smart-agents/search`;
  }

  async query(
    type = 'twins',
    options: QueryOptions = {},
  ): Promise<DigitalTwinResponse> {
    const authHeaders = await utils.getSmartAgentAuthHeaders(this.runtime);

    const defaultOptions = {
      count: 20,
      offset: 0,
      reverse: true,
      sortBy: 'updated',
      searchTerm: '',
      page: null,
    };
    const params = { ...defaultOptions, ...options };

    // prefer paging over offset
    if (params.page) {
      params.offset = params.page * params.count;
      delete params.page;
    }

    const { data } = await axios.get<DigitalTwinResponse>(
      `${this.requestUrl}/${type}`,
      {
        headers: {
          Authorization: authHeaders,
        },
        params,
      },
    );

    // TODO: error handling in request etc...

    return data;
  }

  /**
   * Fetch the latest transactions of a twin
   * @param twinId hash id of twin
   * @param options optional options to extend/override default
   */
  async getLastTransactions(twinAddress: string, options = {}): Promise<TwinTransaction[]> {
    const authHeaders = await utils.getSmartAgentAuthHeaders(this.runtime);
    const defaultOptions = {
      count: 5,
      offset: 0,
      reverse: true,
      sortBy: 'timestamp',
      address: twinAddress,
    };

    const { data } = await axios.get<TransactionsResponse>(
      `${this.requestUrl}/transactions/twin`,
      {
        headers: {
          Authorization: authHeaders,
        },
        params: { ...defaultOptions, ...options },
      },
    );
    return data.result;
  }

  /**
   * Enhance the current twin with createdAt timestamp
   * TODO: Use getTwinById API (WIP)
   */
  async getCreatedTimestamp(twinId: string): Promise<number> {
    const authHeaders = await utils.getSmartAgentAuthHeaders(this.runtime);
    const { data } = await axios.get<DigitalTwinResponse>(`${this.requestUrl}/twins`, {
      headers: {
        Authorization: authHeaders,
      },
      params: { searchTerm: twinId },
    });

    return data.result[0]?.created;
  }
}
