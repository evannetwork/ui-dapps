export interface TransactionsInterface {
    total: number;
    results: Result[];
  }

export interface Result {
    blockHash: string;
    blockNumber: number;
    from: string;
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
