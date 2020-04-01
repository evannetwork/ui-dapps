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

/**
 * Response from edge server /api/smart-agents/search/transactions/twin
 * https://github.com/evannetwork/edge-server-search/tree/feature/CORE-849-twin-transactions#apismart-agentssearchtransactionstwin
 */
export interface TransactionsResponse {
  total: number;
  result: TwinTransaction[];
}

export interface TwinTransaction {
  blockHash: string;
  blockNumber: number;
  feeInEve?: string;
  from: string;
  initiator?: string;
  method: Method;
  gas: number;
  gasPrice: string;
  hash: string;
  to: string;
  timestamp: number;
  transactionIndex: number;
  relatedTransactionHash?: string;
  relatedTransactionGas?: number;
  relatedTransactionGasPrice?: string;
}

export interface Method {
  name: string;
  params: Param[];
}

export interface Param {
  name: string;
  type: string;
  value: string;
}
