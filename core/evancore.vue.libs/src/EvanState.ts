import { Dispatcher } from '@evan.network/ui/src';
import { Runtime } from '@evan.network/api-blockchain-core';
import { StartedDAppInfo } from './interfaces';

export interface EvanState {
  dispatcher: Dispatcher;
  dapp: StartedDAppInfo;
  runtime: Runtime;
}
