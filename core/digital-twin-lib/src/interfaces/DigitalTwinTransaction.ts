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
