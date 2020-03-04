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

import {
  createDefaultRuntime,
  Ipfs,
  logLog,
  logLogLevel,
  Runtime,
} from '@evan.network/api-blockchain-core';
import { config, ipfs, routing } from '@evan.network/ui-dapp-browser';
import * as SmartContracts from '@evan.network/smart-contracts-core';

import { getWeb3Instance } from './web3Helper';
import EvanlightWallet from './lightwallet';

/**
 * Runtime, started with 0x0000
 */
let contextlessRuntime: Runtime;

const accountIdentityCache = {};
const nullAddress = '0x0000000000000000000000000000000000000000';

export default class BccHelper {
  /**
   * Check if a account id and it's corresponding identity is an old profile.
   *
   * @param      {string}  accountId  account address to checkout
   * @param      {string}  identity   identity to check
   */
  static async checkUseIdentity(accountId: string, passedIdentity?: string): Promise<boolean> {
    if (accountId !== nullAddress) {
      // resolve empty identity and load the identity for the account id as default
      const identity = await BccHelper.getIdentityForAccount(accountId, passedIdentity);
      if (identity !== nullAddress) {
        // check if profile exists for identity
        const identityProfile = await BccHelper.getProfileAddressFromIndex(identity);
        if (identityProfile !== nullAddress) {
          return true;
        }

        return false;
      }
    }

    return !!window.localStorage['evan-use-identity'];
  }

  /**
   * Wraps the original create default runtime bcc function to simplify key and account map
   * management.
   *
   * @param      {string}  accountId      account id to create the runtime for
   * @param      {string}  identity       identity id that should be used
   * @param      {string}  encryptionKey  enryption key of the users profile
   * @param      {string}  privateKey     account id's private key
   * @param      {any}     config         overwrite the ui configuration with a custom config
   * @param      {any}     web3           overwrite the CoreRuntime web3 with a new one
   * @param      {any}     dfs            overwrite the CoreRuntime dfs with a new one
   * @return     {any}     the new bcc defaultruntime
   */
  static async createRuntime(
    accountId = nullAddress,
    identity = nullAddress,
    encryptionKey?: string,
    privateKey?: string,
    inputConfig?: any,
    dfs?: any,
    inputOptions: any = {},
  ): Promise<Runtime> {
    // fill web3 per default with the core runtime web3
    const web3 = getWeb3Instance();
    const { soliditySha3 } = web3.utils;
    const options = inputOptions;
    const useIdentity = await BccHelper.checkUseIdentity(accountId, identity);

    /**
     * TODO: Use identity encryption key here! Keep in mind: When onboarding a new account, identity
     * is created within the blockchain-core/onboarding createOfflineProfile function. If we want to
     * use the identity for encryption key generation salting, we need to split these functions or
     * the blockchain-core must force this specific key generation.
     */

    // get accounthash for easy acces within keyConfig
    const accountHash = soliditySha3(accountId);
    const runtimeConfig = {
      ...(inputConfig || JSON.parse(JSON.stringify(config))),
      useIdentity,
    };
    runtimeConfig.keyConfig = {};
    runtimeConfig.accountMap = {};

    // set key config for the user accountId
    runtimeConfig.keyConfig[accountHash] = encryptionKey;
    runtimeConfig.keyConfig[soliditySha3(accountHash, accountHash)] = encryptionKey;
    // set mailbox edge key
    runtimeConfig.keyConfig[soliditySha3('mailboxKeyExchange')] = '346c22768f84f3050f5c94cec98349b3c5cbfa0b7315304e13647a4918ffff22';

    // set private key
    runtimeConfig.accountMap[accountId] = privateKey;

    // create the new runtime
    options.contracts = options.contracts || SmartContracts;
    const runtime = await createDefaultRuntime(
      web3,
      dfs || new Ipfs({
        web3,
        dfsConfig: ipfs.ipfsConfig,
        cache: ipfs.getIpfsCache(),
        logLog,
        logLogLevel,
      }),
      runtimeConfig,
      options,
    );

    if (privateKey) {
      let correctPrivateKey = privateKey;
      if (!privateKey.startsWith('0x')) {
        correctPrivateKey = `0x${privateKey}`;
      }

      await (runtime.dfs as any).setAccountAndPrivateKey(accountId, correctPrivateKey);
    }

    // TODO: fix temporary payments for agent-executors and disable file pinnging
    if (routing.getQueryParameters()['agent-executor']) {
      delete (runtime.dfs as any).accountId;
      // runtime.executor.signer.accountStore = runtime.accountStore;
    }

    /* // initialize empy profile, when no profile could be load
       if (!runtime.profile) {
         runtime.profile = new Profile({
           accountId,
           ...runtime as any,
         });
       } */

    return runtime;
  }

  /**
   * Returns the profile address from the profile index for the given address.
   *
   * @param      {string}  address  address for that the profile address should be resolved
   */
  static async getProfileAddressFromIndex(address: string): Promise<string> {
    const runtime = await BccHelper.getContextLessRuntime();
    const ensName = runtime.nameResolver.getDomainName(runtime.nameResolver.config.domains.profile);
    const profileIndexAddress = await runtime.nameResolver.getAddress(ensName);
    const profileIndex = runtime.nameResolver.contractLoader
      .loadContract('ProfileIndexInterface', profileIndexAddress);

    // Check if a account / identity address has a underlying profile
    return runtime.nameResolver.executor.executeContractCall(
      profileIndex,
      'getProfile',
      address,
      { from: address },
    );
  }

  /**
   * Returns a bcc runtime without any user context.
   */
  static async getContextLessRuntime(): Promise<Runtime> {
    contextlessRuntime = contextlessRuntime || await BccHelper.createRuntime(
      nullAddress,
      nullAddress,
      null,
      null,
      JSON.parse(JSON.stringify(config)),
      null,
    );

    return contextlessRuntime;
  }

  /**
   * Returns the identity address for a account
   *
   * @param      {string}  address   account id, for that the default identity should be resolved
   * @param      {string}  identity  optional identity, that should be checked (if null address or
   *                                 empty, default address will be loaded)
   */
  static async getIdentityForAccount(account: string, identity?: string): Promise<string> {
    if (!identity || account === identity || identity === nullAddress) {
      try {
        const runtime = await BccHelper.getContextLessRuntime();
        return accountIdentityCache[account]
          || await runtime.verifications.getIdentityForAccount(account, true);
      } catch (ex) {
        return nullAddress;
      }
    }

    return identity;
  }

  /**
   * Gets the balance of the provided or current account id
   *
   * @param      {string}  accountId  account id to get the balance from
   * @return     {number}  The balance for the specific account id
   */
  static async getBalance(accountId: string): Promise<number> {
    const web3 = getWeb3Instance();

    return new Promise((resolve, reject) => web3.eth.getBalance(accountId, (err, balance) => {
      if (err) {
        reject(err);
      } else {
        resolve(parseFloat(web3.utils.fromWei(balance, 'ether')));
      }
    }));
  }

  /**
   * Check if the password for a given account id and its profile is valid and returns boolean value,
   * that represents the status, if the password was correct. Also adds the encryption key for this
   * account to the lightwallet, if password is correct.
   *
   * @param      {string}  accountId  account id to check
   * @param      {string}  password   password to check
   * @return     {Promise<boolean>}  True if account password valid, False otherwise
   */
  static async setEncryptionKeyForAccount(accountId: string, password: string): Promise<boolean> {
    const accountIdentity = await BccHelper.getIdentityForAccount(accountId);
    const useIdentity = await BccHelper.checkUseIdentity(accountId, accountIdentity);
    const passwordCheck = async (encryptionSalt): Promise<boolean> => {
      const encryptionKey = EvanlightWallet.getEncryptionKeyFromPassword(encryptionSalt, password);
      const runtime = await BccHelper.createRuntime(accountId, accountIdentity, encryptionKey);

      /* let targetPrivateKey;
         try {
           targetPrivateKey = await runtime.profile.getContactKey(
             accountId,
             'dataKey',
           );
         } catch (ex) {
           // password incorrect
           console.log(ex)
         } */

      /* if the private key for this account could be loaded, the password is valid
         const isCorrect = !!targetPrivateKey; */
      if (runtime.profile) {
        // directly overwrite the latest encryption key for this account
        await EvanlightWallet.overwriteVaultEncryptionKey(
          accountId,
          EvanlightWallet.getEncryptionKeyFromPassword(encryptionSalt, password),
        );
      }

      return !!runtime.profile;
    };

    let checks: Function[];
    if (useIdentity) {
      /* 1. Check for new identity logic
         TODO: use account identity salting! (passwordCheck(accountIdentity)) */
      checks = [(): Promise<boolean> => passwordCheck(accountId)];
    } else {
      checks = [
        // 2. check for password salting with account id
        (): Promise<boolean> => passwordCheck(accountId),
        // 3. support very old passwords
        (): Promise<boolean> => passwordCheck(''),
      ];
    }

    for (let i = 0; i < checks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      if (await checks[i]()) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a account is onboarded
   *
   * @param      {string}  account   account id to test
   * @param      {string}  identity  identity that should be controlled by the user
   * @return     {boolean}  True if account onboarded, False otherwise
   */
  static async isOnboarded(address: string, identity?: string): Promise<boolean> {
    const useIdentity = await BccHelper.checkUseIdentity(address, identity);
    let profileAddress = nullAddress;

    try {
      if (useIdentity) {
        const checkidentity = !identity || identity === nullAddress
          ? await BccHelper.getIdentityForAccount(address, identity)
          : identity;
        profileAddress = await BccHelper.getProfileAddressFromIndex(checkidentity);
      } else {
        profileAddress = await BccHelper.getProfileAddressFromIndex(address);
      }
    } catch (ex) {
      // could not be resolved?
    }

    return profileAddress !== nullAddress;
  }
}
