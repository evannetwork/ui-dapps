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

import Component, { mixins } from 'vue-class-component';
import { EvanComponent } from '@evan.network/ui-vue-core';
import { bccHelper, session, lightwallet } from '@evan.network/ui-session';

@Component
export default class AccountSettingsComponent extends mixins(EvanComponent) {
  loading = true;

  /**
   * List with infos about the current logged in user.
   */
  loginInfoList: Array<any> = null;

  /**
   * Current connection config for the specific network (core / testcore)
   */
  connectionConfig: any = null;

  /**
   * Current localStorage params
   */
  localstorage = null;

  /**
   * All localstorage params, so we can show them in the ui
   */
  localStorageParams: Array<string>;

  /**
   * Show localstorage variables only in dev mode
   */
  isDeveloperModeEnabled = window.localStorage['evan-developer-mode'] === 'true';

  async created(): void {
    const runtime = this.getRuntime();
    this.connectionConfig = {
      // ipfs configuration for evan.network storage
      ipfs: {
        host: `ipfs.${runtime.environment !== 'core' ? 'test' : ''}.evan.network`,
        port: '443',
        protocol: 'https',
      },
      // web3 provider config (currently evan.network testcore)
      web3Provider: `wss://${runtime.environment !== 'core' ? 'test' : ''}core.evan.network/ws`,
    };

    const [
      accountIdentity,
      activeIdentityOwner,
      balance,
    ] = await Promise.all([
      runtime.verifications.getIdentityForAccount(runtime.underlyingAccount, true),
      runtime.verifications.getOwnerAddressForIdentity(runtime.activeIdentity),
      bccHelper.getBalance(runtime.activeAccount),
    ]);

    this.loginInfoList = [
      {
        title: '_settings.account.info.underlyingAccount',
        value: runtime.underlyingAccount,
      },
      {
        title: '_settings.account.info.activeIdentity',
        value: runtime.activeIdentity,
      },
      {
        title: '_settings.account.info.accountIdentity',
        value: accountIdentity,
      },
      {
        title: '_settings.account.info.activeIdentityOwner',
        value: activeIdentityOwner,
      },
      {
        title: '_settings.account.info.balance',
        value: `${parseFloat(balance.toString())} EVE`,
      },
    ];

    this.localStorage = window.localStorage;
    this.localStorageParams = [
      'bc-dev-logs',
      'bcc-dev-log',
      'evan-account',
      'evan-alias',
      'evan-dev-log',
      'evan-ens-cache',
      'evan-identity',
      'evan-language',
      'evan-mail-read',
      'evan-mail-read-count',
      'evan-provider',
      'evan-test-password',
      'evan-vault',
      'evan-warnings-disabled',
    ];

    this.loading = false;
  }

  // TODO refactor to (renderless) vue component
  copyToClipboard(text: string, toastText: string): void {
    const textArea = document.createElement('textarea');

    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    this.$toasted.show(
      this.$t(toastText),
      {
        duration: 3000,
        type: 'success',
      },
    );
  }

  /**
   * Export the private key for the current logged in account
   */
  async exportPrivateKey(): Promise<void> {
    const vault = await lightwallet.loadUnlockedVault();
    const privateKey = lightwallet.getPrivateKey(vault, session.activeAccount);

    this.copyToClipboard(privateKey, '_settings.account.private-key.exported');
  }

  /**
   * Export the private key for the current logged in account
   */
  async exportEncryptionKey(): Promise<void> {
    await lightwallet.loadUnlockedVault();
    const encryptionKey = await lightwallet.getEncryptionKey();

    this.copyToClipboard(encryptionKey, '_settings.account.encryption-key.exported');
  }

  /**
   * Export the runtime configuration for the current logged in account
   */
  async exportRuntimeConfig(): Promise<void> {
    const runtime = this.getRuntime();
    const vault = await lightwallet.loadUnlockedVault();
    const privateKey = lightwallet.getPrivateKey(vault, session.activeAccount);
    const encryptionKey = await lightwallet.getEncryptionKey();
    const accountSha3 = runtime.web3.utils.soliditySha3(runtime.activeAccount);
    const accountSha9 = runtime.web3.utils.soliditySha3(accountSha3, accountSha3);
    const toCopy = {
      // account map to blockchain accounts with their private key
      accountMap: {
        [runtime.activeAccount]: privateKey,
      },
      // key configuration for private data handling
      keyConfig: {
        [accountSha3]: encryptionKey,
        [accountSha9]: encryptionKey,
      },
      ...this.connectionConfig,
    };

    this.copyToClipboard(
      JSON.stringify(toCopy, null, 2),
      '_settings.account.runtime-config.exported',
    );
  }

  /**
   * updates a localStorage entry with a specific value
   *
   * @param      {string}  entry   localStorage key
   * @param      {string}  value   value to set
   */
  // eslint-disable-next-line class-methods-use-this
  onLocalStorageChange(key: string, value): void {
    window.localStorage.setItem(key, value);
  }
}
