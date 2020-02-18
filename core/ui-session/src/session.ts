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

import { utils, routing } from '@evan.network/ui-dapp-browser';

import lightwallet from './lightwallet';
import { getWeb3Instance } from './web3Helper';

/**
 * is inserted when the application was bundled, used to prevent window usage
 */
declare let evanGlobals: any;

/**
 * valid login providers
 */
const validProviders = [
  'metamask',
  'internal',
];

/**
 * external executor variables
 */
let agentExecutor;

/**
 * save the current account for later usage
 */
let lastAccount = '';

export default class EvanSession {
  /**
   * Logout the current user. Removes the active account, provider and terms of use acceptance.
   *
   * @param      {boolean}  disabledReload  disable window reload
   */
  static logout(disabledReload?: boolean) {
    // reset account and providers
    EvanSession.setCurrentProvider('');
    EvanSession.setAccountId('');

    // clear localStorage values
    delete window.localStorage['evan-terms-of-use'];
    delete window.localStorage['evan-account'];
    delete window.localStorage['evan-provider'];
    delete window.localStorage['evan-alias'];

    // remove decrypted vault from runtime and localStorage
    lightwallet.deleteActiveVault();

    // unregister notifications
    window.localStorage['evan-notifications'] = 'false';
    utils.sendEvent('evan-notifications-toggled');

    // reload the window
    setTimeout(() => {
      window.location.reload();
    });
  }

  /**
   * Get the current, in local storage, configured provider.
   *
   * @return     {string}  The current provider (internal, external, agent-executor).
   */
  static getCurrentProvider() {
    let provider;

    if (agentExecutor) {
      provider = 'agent-executor';
    } else if (evanGlobals.queryParams.provider) {
      provider = evanGlobals.queryParams.provider;
    } else {
      const currentProvider = window.localStorage['evan-provider'];

      if (currentProvider && validProviders.indexOf(currentProvider) !== -1) {
        provider = currentProvider;
      }
    }

    return provider || 'internal';
  }

  /**
   * Check if we should use internal provider.
   *
   * @return     {boolean}  True if internal provider, False otherwise.
   */
  static isInternalProvider() {
    return EvanSession.getCurrentProvider();
  }

  /**
   * Sets the current provider that should be used.
   *
   * @param      {string}  provider  provider to switch to
   */
  static setCurrentProvider(provider: string) {
    window.localStorage['evan-provider'] = provider;
  }

  /**
   * Get the current selected account included the check of the current provider.
   *
   * @return     {string}  account id of the current user (0x0...)
   */
  static activeAccount(): string {
    switch (EvanSession.getCurrentProvider()) {
      case 'agent-executor': {
        return agentExecutor.accountId;
      }
      // internal
      default: {
        // if the url was opened using an specific accountId, use this one!
        if (evanGlobals.queryParams.accountId) {
          return evanGlobals.queryParams.accountId;
        }

        const vault = lightwallet.loadVault();

        // get the first account from the vault and set it as evan-account to localStorage
        if (vault) {
          const accounts = lightwallet.getAccounts(vault);
          const accountId = EvanSession.getAccountId();

          if (accountId && accounts.indexOf(accountId) === -1) {
            if (accounts.length > 0) {
              EvanSession.setAccountId(accounts[0]);
            } else {
              delete window.localStorage['evan-account'];
            }
          }
        } else {
          delete window.localStorage['evan-account'];
        }

        break;
      }
    }

    return EvanSession.getAccountId();
  }

  /**
   * Checks the current url parameters if agent executor login parameters are given.
   *
   * @return     {any}  all agent-exeutor parameters for requesting smart-agents and decrypting the
   *                    profile ({ accountId, agentUrl, key, token, })
   */
  static async getAgentExecutor() {
    // if the agentExecutor wasn't loaded before, check if the query parameter was specified
    if (typeof agentExecutor === 'undefined') {
      const token = routing.getQueryParameterValue('agent-executor');
      const agentUrl = routing.getQueryParameterValue('agent-executor-url')
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
          const accountId = routing.getQueryParameterValue('agent-executor-account-id');
          const key = routing.getQueryParameterValue('agent-executor-key');

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

      evanGlobals.agentExecutor = agentExecutor;
    }

    return agentExecutor;
  }

  /**
   * Returns the current (in the localStorage) saved account id
   *
   * @return     {string}  account id;
   */
  static getAccountId() {
    if (agentExecutor) {
      return agentExecutor.accountId;
    }

    if (window.localStorage['evan-account']) {
      const checkSumAddress = getWeb3Instance().utils.toChecksumAddress(
        window.localStorage['evan-account'],
      );
      return checkSumAddress;
    }
    return '';
  }

  /**
   * Sets an account id as active one to the local storage.
   *
   * @param      {string}  accountId  account id to set to the localStorage
   */
  static setAccountId(accountId: string) {
    lastAccount = accountId;
    window.localStorage['evan-account'] = accountId;
  }

  /**
   * Watches for account changes and reload the page if nessecary
   */
  static watchAccountChange() {
    lastAccount = EvanSession.getAccountId();

    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === 'evan-account') {
        if (lastAccount !== EvanSession.getAccountId()) {
          window.location.reload();
        }
      }
    });
  }

  /**
   * Return the name of the current used browser =>
   * https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
   *
   * @return     {string}  opera / firefox / safari / ie / edge / chrome
   */
  static currentBrowser() {
    const win: any = window;
    if ((!!win.opr && !!win.opr.addons) || !!win.opera
      || navigator.userAgent.indexOf(' OPR/') >= 0) {
      return 'opera';
    }
    if (typeof win.InstallTrigger !== 'undefined') {
      return 'firefox';
    }
    const isSafari = ((p) => p.toString() === '[object SafariRemoteNotification]')(!win.safari || (typeof win.safari !== 'undefined' && win.safari.pushNotification));
    if (/constructor/i.test(win.HTMLElement) || isSafari) {
      return 'safari';
    }
    // eslint-disable-next-line
    if (/*@cc_on!@*/false || !!(document as any).documentMode) {
      return 'ie';
    }
    if (win.StyleMedia) {
      return 'edge';
    }
    if (!!win.chrome && !!win.chrome.webstore) {
      return 'chrome';
    }

    return '';
  }

  /**
   * Gets the balance of the provided or current account id
   *
   * @param      {string}  accountId  account id to get the balance from
   * @return     {number}  The balance for the specific account id
   */
  static getBalance(accountId = EvanSession.activeAccount()): Promise<number> {
    const web3 = getWeb3Instance();

    return new Promise((resolve, reject) => web3.eth.getBalance(accountId, (err, balance) => {
      if (err) {
        reject(err);
      } else {
        resolve(parseFloat(web3.utils.fromWei(balance, 'ether')));
      }
    }));
  }
}
