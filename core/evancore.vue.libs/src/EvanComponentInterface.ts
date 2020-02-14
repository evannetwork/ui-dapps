import { Dispatcher } from '@evan.network/ui/src';
import { Runtime } from '@evan.network/api-blockchain-core';
import { StartedDAppInfo } from './interfaces';

export interface EvanState {
  dispatcher: Dispatcher;
  dapp: StartedDAppInfo;
  runtime: Runtime;
  reloadFlags: any[];
  twin: any;
  uiState: {
    profile: {
      selectedSharedContacts: any;
    };
    swipePanel: string;
  };
  isLoggedin: boolean;
  uiLibBaseUrl: string;
}

export interface TranslateFunc {
  (key: string, options?: any, pluralization?: number): string | undefined;
  (key: string, defaultValue: string, options?: any, pluralization?: number): string | undefined;
}
