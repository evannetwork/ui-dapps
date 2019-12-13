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
import { utils } from '@evan.network/api-blockchain-core';

interface QueryOptions {
  count?: number;
  offset?: number;
  page?: number;
  reverse?: boolean;
  searchTerm?: string;
  sortBy?: string;
}

interface SearchResult {
  address: string;
  containers: string[]
  created: number;
  description: string;
  name: string;
  owner: string;
  updated: number;
}

interface SearchResponse {
  data: {
    requesterInformation?: any;
    result: SearchResult[];
    serverInformation?: any;
    status: string;
    total: number;
  }
}

class SearchService {
  runtime = null;
  searchUrl: string;

  constructor(runtime: any) {
    if (!runtime) {
      throw new Error('Initialized search Service without runtime.');
    }
    this.runtime = runtime;

    const core =  runtime.environment === 'testcore' ? '.test' : '';
    const agentUrl = `https://search${ core }.evan.network/api/smart-agents`;

    this.searchUrl = `${agentUrl}/search`;
  }

  async query(type = 'twins', options: QueryOptions) {
    const authHeaders = await utils.getSmartAgentAuthHeaders(this.runtime);

    const defaultOptions = {
      count: 20,
      offset: 0,
      reverse: true,
      sortBy: 'timestamp',
      searchTerm: '*',
      page: null
    }
    const params = Object.assign({}, defaultOptions, options);

    // prefer paging over offset
    if (params.page) {
      params.offset = params.page * params.count;
      delete params.page;
    }

    // wrap with wildcards if defined
    params.searchTerm = !params.searchTerm || params.searchTerm === '*'
      ? '*'
      :`*${ params.searchTerm }*`;

    const { data } = await axios.get<SearchResponse>(`${ this.searchUrl }/${ type }`, {
      headers: {
        'Authorization': authHeaders,
      },
      params,
    });

    // TODO: error handling in request etc.. ..

    return { ...data };
  }
}

export default SearchService