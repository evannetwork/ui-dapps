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
