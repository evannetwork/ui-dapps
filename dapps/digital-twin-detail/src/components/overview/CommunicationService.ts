import axios from 'axios';
import { utils, Runtime } from '@evan.network/api-blockchain-core';
import {
  TransactionsResponse,
  DigitalTwinResponse,
  TwinTransaction,
} from '@evan.network/digital-twin-lib';

export class CommunicationService {
  runtime: Runtime;

  constructor(runtime: Runtime) {
    this.runtime = runtime;
  }

  async getLastTransactions(twinId: string, options = {}): Promise<TwinTransaction[]> {
    const authHeaders = await utils.getSmartAgentAuthHeaders(this.runtime);
    const core = this.runtime.environment === 'testcore' ? '.test' : '';
    const url = `https://search${core}.evan.network/api/smart-agents/search`;

    const defaultOptions = {
      count: 5,
      offset: 0,
      reverse: true,
      sortBy: 'timestamp',
      address: twinId,
    };

    const { data } = await axios.get<TransactionsResponse>(
      `${url}/transactions/twin`,
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
    const core = this.runtime.environment === 'testcore' ? '.test' : '';
    const url = `https://search${core}.evan.network/api/smart-agents/search`;

    const { data } = await axios.get<DigitalTwinResponse>(`${url}/twins`, {
      headers: {
        Authorization: authHeaders,
      },
      params: { searchTerm: twinId },
    });

    return data.result[0].created;
  }
}
