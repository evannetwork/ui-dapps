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
 * Before you start using the several functions of the mighty lightwallet
 * functions, be sure that you have set an global password functions that
 * handles the user interactions and returns a valid password for the mnemonic
 * and the underlying profile.
 */

import {
  keystore,
  KeyStoreInterface,
  Mnemonic,
} from '@evan.network/api-blockchain-core';
import { routing } from '@evan.network/ui-dapp-browser';

import { getWeb3Instance } from './web3Helper';
import session from './session';

// !IMPORTANT: dont export it to avoid security leaks!
/**
 * cache existing vault locally
 */
let cachedVault;

/**
 * custom encryption keys, to overwrite the default one (password salted using accountId)
 */
const customEncryptionKeys = { };

/**
 * cached password function, can set during the application runtime to implement
 * own password retrieve functions
 */
let passwordFunction;

export default class EvanLightWallet {
  /**
   * returns CoreBundle.keystore (eth-lightwallet/lib/keystore)
   *
   * @return     {any}  CoreBundle.keystore
   */
  static getKeyStore(): KeyStoreInterface {
    return keystore;
  }

  /**
   * Generates a new random seed.
   *
   * @return     {string}  12 word mnemomnic
   */
  static generateMnemonic(): string {
    return keystore.generateRandomSeed();
  }

  /**
   * Creates a new vault instance to handle lightwallet interactions.
   *
   * @param      {string}  mnemonic  mnemonic to create new vault.
   * @param      {string}  password  password to encrypt the vault.
   * @return     {vault}   vault created using mnemonic, encrypted via password
   */
  static createVault(mnemonic: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      keystore.createVault({
        hdPathString: 'm/45\'/62\'/13\'/7',
        password,
        seedPhrase: mnemonic,
      }, (err, vault) => {
        if (err) {
          reject(err);
        } else {
          resolve(vault);
        }
      });
    });
  }

  /**
   * Gets the pwDerivedKey to interact with the vault.
   *
   * @param      {any}           vault         vault to unlock
   * @param      {string}        password      password of the locked vault
   * @return     {Promise<any>}  pwDerivedKey
   */
  static keyFromPassword(vault: any, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      vault.keyFromPassword(password, (err, pwDerivedKey) => {
        if (err) {
          reject();
        } else {
          resolve(pwDerivedKey);
        }
      });
    });
  }

  /**
   * Serializes a specific vault and saves it to the local storage.
   *
   * @param      {any}     vault   vault to save locally
   */
  static setVaultActive(vault: any) {
    window.localStorage['evan-vault'] = vault.serialize();

    cachedVault = vault;
  }

  /**
   * Get an specific amount of accounts from the vault.
   *
   * @param      {any}            vault   vault to get accounts from
   * @param      {number}         amount  number of accounts to return
   * @return     {Array<string>}  The accounts.
   */
  static getAccounts(vault: any, amount?: number): Array<string> {
    let accounts = vault.getAddresses();
    const web3 = getWeb3Instance();

    /* only generate so much accounts, that are realy needed, do not generate new ones, if the amount
       of addresses are already loaded */
    if (amount && (!accounts || accounts.length < amount)) {
      if (!vault.pwDerivedKey) {
        throw new Error('could not generate new addresses on locked vault!');
      }

      // generate new ones and reload
      vault.generateNewAddress(vault.pwDerivedKey, amount - accounts.length);
      accounts = vault.getAddresses();
    }

    return accounts.map((account: string) => web3.utils.toChecksumAddress(account));
  }

  /**
   * Get the first account from the vault.
   *
   * @param      {any}  vault   vault to get accounts from
   * @return     {string}  The account.
   */
  static getPrimaryAccount(vault: any): string {
    return EvanLightWallet.getAccounts(vault, 1)[0];
  }

  /**
   * Returns the encryption key for the current password.
   *
   * @return     {string}  encryption key
   */
  static async getEncryptionKey(): Promise<string> {
    const agentExecutor = await session.getAgentExecutor();
    // if an executor agent should be used, return the key instantly
    if (agentExecutor) {
      return agentExecutor.key;
    // if the url was opened using an specific mnemonic and password, use this one!
    }

    const vault = await EvanLightWallet.loadUnlockedVault();
    if (vault) {
      return vault.encryptionKey;
    }

    return '';
  }

  /**
   * Hashes a password using sha3.
   *
   * @param      {string}  password  password that should be hashed
   * @return     {string}  The encryption key from password.
   */
  static getEncryptionKeyFromPassword(accountId: string, password: string): string {
    return getWeb3Instance().utils
      .sha3(accountId + password)
      .replace(/0x/g, '');
  }

  /**
   * Creates an new vault and unlocks it
   *
   * @param      {string}  mnemonic  mnemonic to use for the vault
   * @param      {string}  password  password to encrypt the vault
   * @return     {any}  The new vault.
   */
  static async getNewVault(mnemonic: string, password: string): Promise<any> {
    const vault = await EvanLightWallet.createVault(mnemonic, password);

    vault.pwDerivedKey = await EvanLightWallet.keyFromPassword(vault, password);

    // TODO: shall we use identity here?
    const primaryAccount = EvanLightWallet.getPrimaryAccount(vault);
    vault.encryptionKey = customEncryptionKeys[primaryAccount]
      || EvanLightWallet.getEncryptionKeyFromPassword(primaryAccount, password);

    /* if the accountId was specified externally, we should load the first account to be able to run
       calls for this account */
    EvanLightWallet.getAccounts(vault, 1);

    return vault;
  }

  /**
   * Create new vault, set it active and set first account id
   *
   * @param      {string}  mnemonic  mnemonic to use
   * @param      {string}  password  password to encrypt mnemonic
   */
  static async createVaultAndSetActive(mnemonic: string, password: string): Promise<void> {
    const vault = await EvanLightWallet.getNewVault(mnemonic, password);
    const accounts = EvanLightWallet.getAccounts(vault, 1);

    EvanLightWallet.setVaultActive(vault);
    // eslint-disable-next-line prefer-destructuring
    window.localStorage['evan-account'] = accounts[0];
  }

  /**
   * Gets the private key for an account.Given the derived key, decrypts and returns the private key
   * corresponding to address. This should be done sparingly as the recommended practice is for the
   * keystore to sign transactions using signing.signTx, so there is normally no need to export
   * private keys.
   *
   * @param      {any}     vault      vault where the account lives
   * @param      {string}  accountId  account to get the private key from
   * @return     {<type>}  The private key.
   */
  static getPrivateKey(vault: any, accountId: string): string {
    return vault.exportPrivateKey(accountId.toLowerCase(), vault.pwDerivedKey);
  }

  /**
   * Load locked vault from localStorage or unlocked memory vault.
   *
   * @return     {any}  deserialized, cached vault
   */
  static loadVault(): any {
    if (!cachedVault && window.localStorage['evan-vault']) {
      try {
        cachedVault = keystore.deserialize(window.localStorage['evan-vault']);
      } catch (ex) {
        // could not deserialize
      }
    }

    return cachedVault;
  }

  /**
   * Sets the password function. The dapp-browser does not includes any library / framework / css that
   * handles a good and nice ui development (e.g. angular, react, bootstrap, ...). To handle coporate
   * design and a better DApp development freedom, each DApp must specify its own password dialog. In
   * case of Angular 5 development have a look at the default one, provided by the angular-core:
   * globalPasswordDialog
   * https://github.com/evannetwork/ui-angular-core/blob/4f539a2f5492b137d6be82c133427871073c3929/src/services/evan/bcc.ts#L300
   *
   * @param      {Function}  newPasswordFunction  The new password function
   */
  static setPasswordFunction(newPasswordFunction: Function): void {
    passwordFunction = newPasswordFunction;
  }

  /**
   * Shows the global-password modal.
   *
   * @param      {string}           accountId  additional account id to get the
   *                                           password from
   * @return     {Promise<string>}  password input
   */
  static async getPassword(accountId?: string): Promise<string> {
    const queryParams = routing.getQueryParameters();
    // if a password was specified over the url, use this one
    if (queryParams.password) {
      return queryParams.password;
    }
    if (passwordFunction) {
      return passwordFunction(accountId);
    }
    console.error('No password function for lightwallet service set...');
    throw new Error('No password function for lightwallet service set...');
  }

  /**
   * Return current unlocked vault. Asks for password when vault is locked.
   *
   * @return     {Promise<any>}  unlocked vault
   */
  static async loadUnlockedVault(): Promise<any> {
    const queryParams = routing.getQueryParameters();
    let vault;
    let primaryAccount;

    // if a mnemonic and a password were specified over the url, load the vault with this values
    if (queryParams.mnemonic && queryParams.password) {
      vault = await EvanLightWallet.getNewVault(queryParams.mnemonic, queryParams.password);
    } else {
      vault = EvanLightWallet.loadVault();
    }

    if (vault && !vault.pwDerivedKey) {
      const password = await EvanLightWallet.getPassword();
      vault.pwDerivedKey = await EvanLightWallet.keyFromPassword(vault, password);

      /* only load the encryption key, when it wasn't set before (could be overwritten by using
         overwriteVaultEncryptionKey for old or custom logic accounts) */
      primaryAccount = EvanLightWallet.getPrimaryAccount(vault);
      if (!customEncryptionKeys[primaryAccount]) {
        console.warn(`No encryption key is set for ${primaryAccount}!`
          + 'Please use overwriteVaultEncryptionKey function or run bccHelper.setEncryptionKeyForAccount before.');
        vault.encryptionKey = EvanLightWallet.getEncryptionKeyFromPassword(
          EvanLightWallet.getPrimaryAccount(vault),
          password,
        );
      }
    }

    /* if the accountId was specified externally, we should load the first account to be able to run
       calls for this account */
    primaryAccount = primaryAccount || EvanLightWallet.getPrimaryAccount(vault);
    if (customEncryptionKeys[primaryAccount]) {
      vault.encryptionKey = customEncryptionKeys[primaryAccount];
    }

    return vault;
  }

  /**
   * Overwrites the encryption key for the current vault.
   *
   * @param      {string}  encryptionKey  the encryption key that should be used
   */
  static overwriteVaultEncryptionKey(accountId: string, encryptionKey: string): void {
    customEncryptionKeys[accountId] = encryptionKey;
  }

  /**
   * Remove current active vault from browser.
   */
  static deleteActiveVault(): void {
    cachedVault = '';

    delete window.localStorage['evan-vault'];
  }

  /**
   * Returns if an mnemonic is a valid mnemonic. (wrapper for getKeyStore().isSeedValid)
   *
   * @param      {string}   mnemonic  The mnemonic
   * @return     {boolean}  True if valid mnemonic, False otherwise.
   */
  static isValidMnemonic(mnemonic: string): boolean {
    try {
      return keystore.isSeedValid(mnemonic);
    } catch (ex) {
      return false;
    }
  }

  /**
   * Returns if an word is a valid mnemonic word.
   *
   * @param      {string}   word    word to check
   * @return     {boolean}  True if valid mnemonic word, False otherwise.
   */
  static isValidMnemonicWord(word: string): boolean {
    return Mnemonic.Words.ENGLISH.indexOf(word) !== -1;
  }
}
