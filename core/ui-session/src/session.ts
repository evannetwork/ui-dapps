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

import { config, routing } from '@evan.network/ui-dapp-browser';
import {
  ExecutorAgent,
  logLog,
  logLogLevel,
  Runtime,
} from '@evan.network/api-blockchain-core';

import lightwallet from './lightwallet';
import bccHelper from './bccHelper';

// external executor variables
let agentExecutor;
// save the current account for later usage
let lastAccount = '';
// save the current account for later usage
let lastIdentity = '';
// used to check for url overwritten account / identity parameters
const queryParams = routing.getQueryParameters();
// used to only start runtime resolve once
const runtimeLoadCache = { };

export default class EvanSession {
  /**
   * Runtime, started for the current account (configured in localStorage) and it's profile
   * identity.
   */
  static accountRuntime: Runtime;

  /**
   * Runtime, started for the current account (configured in localStorage) and the localStorage
   * configured identity.
   */
  static identityRuntime: Runtime;

  /**
   * identity address of the activeAccount
   */
  static accountIdentity: string;

  /**
   * Has the account a old profile, that is bount to the account and not to the identity?
   */
  static isOldProfile: boolean;

  static get activeAccount(): string {
    switch (EvanSession.provider) {
      case 'agent-executor': {
        return agentExecutor.accountId;
      }
      // internal
      default: {
        // if the url was opened using an specific accountId, use this one!
        if (queryParams.accountId) {
          return queryParams.accountId;
        }
      }
    }

    return window.localStorage['evan-account'];
  }

  static set activeAccount(accountId: string) {
    lastAccount = accountId;
    window.localStorage['evan-account'] = accountId;
  }

  static get activeIdentity(): string {
    switch (EvanSession.provider) {
      case 'agent-executor': {
        return agentExecutor.identity;
      }
      // internal
      default: {
        // if the url was opened using an specific identity, use this one!
        if (queryParams.identity) {
          return queryParams.identity;
        }

        break;
      }
    }

    return window.localStorage['evan-identity'] || EvanSession.accountIdentity;
  }

  static set activeIdentity(identity: string) {
    lastIdentity = identity;
    window.localStorage['evan-identity'] = identity;
  }

  static get provider(): string {
    let provider = 'internal';

    if (agentExecutor) {
      provider = 'agent-executor';
    } else if (queryParams.provider) {
      provider = queryParams.provider;
    }

    return provider;
  }

  static set provider(value: string) {
    window.localStorage['evan-provider'] = value;
  }

  /**
   * Checks the current url parameters if agent executor login parameters are given.
   *
   * @return     {any}  all agent-exeutor parameters for requesting smart-agents and decrypting the
   *                    profile ({ accountId, agentUrl, key, token, })
   */
  static async getAgentExecutor(): Promise<any> {
    // if the agentExecutor wasn't loaded before, check if the query parameter was specified
    if (typeof agentExecutor === 'undefined') {
      const token = queryParams['agent-executor'];
      const agentUrl = queryParams['agent-executor-url']
        || 'https://agents.test.evan.network';

      /* if an token is specified, load the data from the edge-server
         TODO: currently the parameters are specified via query parameters => load it via edge-server */
      if (token) {
        /* use a promise await to implement an timeout (this function will be called at the beginning
           of the page load, so everything will stop working, when agent not responds) */
        await (new Promise((resolve) => {
          // dont resolve twice
          let timedOut = false;

          // break loading after 10 seconds
          const agentTimeout: any = setTimeout(() => {
            agentExecutor = false;
            timedOut = true;

            resolve();
          }, 10 * 1000);

          // load data from edge-server
          const accountId = queryParams['agent-executor-account-id'];
          const key = queryParams['agent-executor-key'];

          // if all parameters are valid, set the executor agent
          if (accountId && key) {
            agentExecutor = {
              accountId, agentUrl, key, token,
            };
          } else {
            agentExecutor = false;
          }

          // if the timeout wasn't triggered => resolve it normally
          if (!timedOut) {
            window.clearTimeout(agentTimeout);
            resolve();
          }
        }));
      } else {
        agentExecutor = false;
      }
    }

    return agentExecutor;
  }

  /**
   * Logout the current user. Removes the active account, provider and terms of use acceptance.
   *
   * @param      {boolean}  disabledReload  disable window reload
   */
  static logout(reload = true): void {
    // reset account and providers
    EvanSession.provider = '';
    EvanSession.activeAccount = '';
    EvanSession.activeIdentity = '';

    // clear localStorage values
    delete window.localStorage['evan-terms-of-use'];
    delete window.localStorage['evan-account'];
    delete window.localStorage['evan-provider'];
    delete window.localStorage['evan-alias'];

    // remove decrypted vault from runtime and localStorage
    lightwallet.deleteActiveVault();

    // reload the window
    if (reload) {
      setTimeout(() => window.location.reload());
    }
  }

  /**
   * Watches for account changes and reload the page if nessecary
   */
  static onAccountChange(callback: Function): Function {
    const storage = window.localStorage;
    const watcher = (event: StorageEvent): void => {
      if (event.key === 'evan-account' && lastAccount !== storage['evan-account']) {
        EvanSession.isOldProfile = false;
        callback(EvanSession.activeAccount);
      }
    };

    lastAccount = storage['evan-account'];
    window.addEventListener('storage', watcher);
    return (): void => window.removeEventListener('storage', watcher);
  }

  /**
   * Watches for account changes and reload the page if nessecary
   */
  static onIdentityChange(callback: Function): Function {
    const storage = window.localStorage;
    const watcher = (event: StorageEvent): void => {
      if (event.key === 'evan-identity' && lastIdentity !== storage['evan-identity']) {
        callback(EvanSession.activeAccount);
      }
    };

    lastIdentity = storage['evan-identity'];
    window.addEventListener('storage', watcher);
    return (): void => window.removeEventListener('storage', watcher);
  }

  /**
   * Create the runtimes for the current session and uses the event handler to handle login /
   * onboarding processes.
   *
   * @param      {Function}  eventHandler  function that is called with several events types as
   *                                       first parameter (onboarding, password, ...)
   */
  static async setRuntimes(eventHandler: Function): Promise<void> {
    const { activeAccount, activeIdentity } = EvanSession;
    const cacheKey = `${activeAccount}${activeIdentity}`;

    if (!runtimeLoadCache[cacheKey]) {
      runtimeLoadCache[cacheKey] = (async (): Promise<void> => {
        let loggedIn = false;
        let isOnboarded = false;

        // check if a user is already logged in, if yes, navigate to the signed in route
        if (activeAccount && window.localStorage['evan-vault']) {
          loggedIn = true;

          isOnboarded = await bccHelper.isOnboarded(activeAccount, activeIdentity);
          // check for old profile
          if (isOnboarded) {
            EvanSession.isOldProfile = await bccHelper.checkUseIdentity(activeAccount, activeIdentity);
          }
        }

        if (!isOnboarded || !loggedIn) {
          await eventHandler('onboarding');
          await EvanSession.setRuntimes(eventHandler);
        } else {
          let encryptionKey; let privateKey; let executor;

          if (EvanSession.provider === 'agent-executor') {
            await EvanSession.getAgentExecutor();
            const coreRuntime = await bccHelper.createRuntime();

            encryptionKey = agentExecutor.key;
            executor = new ExecutorAgent({
              agentUrl: agentExecutor.agentUrl,
              config: {},
              contractLoader: coreRuntime.contractLoader,
              logLog,
              logLogLevel,
              signer: coreRuntime.signer,
              token: agentExecutor.token,
              web3: coreRuntime.web3,
            });
          } else {
            // set the password function
            lightwallet.setPasswordFunction(() => eventHandler('password'));
            // unlock the profile directly
            const vault = await lightwallet.loadUnlockedVault();
            encryptionKey = vault.encryptionKey;
            privateKey = lightwallet.getPrivateKey(vault, activeAccount);
          }

          EvanSession.accountRuntime = await bccHelper.createRuntime(
            activeAccount,
            EvanSession.accountIdentity,
            encryptionKey,
            privateKey,
            JSON.parse(JSON.stringify(config)),
            null,
            { executor },
          );
          EvanSession.identityRuntime = await bccHelper.createRuntime(
            activeAccount,
            activeIdentity,
            encryptionKey,
            privateKey,
            JSON.parse(JSON.stringify(config)),
            null,
            { executor },
          );
        }
      })();

      // reset runtime loading cache
      setTimeout(() => {
        delete runtimeLoadCache[cacheKey];
      });
    }

    await runtimeLoadCache[cacheKey];
  }

  /**
   * Checks if currently a active account and a identity is set, so we can check for old / new
   * profiles to enable useIdentity. If useIdentity is false, force activeIdentity to activeAccount.
   */
  static async initialCheck(): Promise<void> {
    if (EvanSession.activeAccount) {
      const useIdentity = await bccHelper.checkUseIdentity(
        EvanSession.activeAccount,
        EvanSession.accountIdentity,
      );

      if (useIdentity) {
        EvanSession.activeIdentity = await bccHelper.getIdentityForAccount(EvanSession.activeAccount);
      } else {
        EvanSession.activeIdentity = EvanSession.activeAccount;
      }
    } else {
      EvanSession.activeIdentity = '';
    }
  }

  /**
   * if no session was started before, initialize everything!
   */
  static async start(eventHandler: Function, watchForChanges = true): Promise<Function> {
    await EvanSession.initialCheck();
    // early exit, when session was already started
    if (!(EvanSession.accountRuntime && EvanSession.identityRuntime)) {
      await EvanSession.setRuntimes(eventHandler);
    }
    eventHandler('runtimeUpdate');

    // create watchers, so runtimes will update on account / identity switches
    let watchers = [];
    if (watchForChanges) {
      const onChange = async (): Promise<void> => {
        await EvanSession.initialCheck();
        EvanSession.identityRuntime = null;
        await EvanSession.setRuntimes(eventHandler);
      };

      watchers = [
        EvanSession.onAccountChange(async () => {
          // reset current session runtimes
          EvanSession.accountRuntime = null;
          await onChange();
          eventHandler('account');
          eventHandler('runtimeUpdate');
        }),
        EvanSession.onIdentityChange(async () => {
          await onChange();
          eventHandler('identity');
          eventHandler('runtimeUpdate');
        }),
      ];
    }
    return (): void => watchers.forEach((watcher) => watcher());
  }
}
