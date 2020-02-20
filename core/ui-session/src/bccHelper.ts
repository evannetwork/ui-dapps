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
  Profile,
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

const accountIdentityCache = { };

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
async function createRuntime(
  accountId = '0x0000000000000000000000000000000000000000',
  identity = '0x0000000000000000000000000000000000000000',
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

  // TODO: use identity!

  // get accounthash for easy acces within keyConfig
  const accountHash = soliditySha3(accountId);
  const runtimeConfig = { ...(inputConfig || JSON.parse(JSON.stringify(config))) };
  runtimeConfig.keyConfig = { };
  runtimeConfig.accountMap = { };

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

  if (runtimeConfig.useIdentity && runtime.activeIdentity === runtime.activeAccount) {
    runtime.activeIdentity = '0x0000000000000000000000000000000000000000';
  }

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

  // initialize empy profile, when no profile could be load
  if (!runtime.profile) {
    runtime.profile = new Profile({
      accountId,
      ...runtime as any,
    });
  }

  return runtime;
}

/**
 * Gets the balance of the provided or current account id
 *
 * @param      {string}  accountId  account id to get the balance from
 * @return     {number}  The balance for the specific account id
 */
async function getBalance(accountId: string): Promise<number> {
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
 * Returns a bcc runtime without any user context.
 */
async function getContextLessRuntime(): Promise<Runtime> {
  contextlessRuntime = contextlessRuntime || await createRuntime(
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000',
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
 * @param      {string}   address  The address
 * @param      {Runtime}  runtime  The runtime
 * @return     {string}   The identity for account.
 */
async function getIdentityForAccount(address: string, runtime: Runtime): Promise<string> {
  return accountIdentityCache[address]
    || runtime.verifications.getIdentityForAccount(address, true);
}

/**
 * Check if the password for a given account id and its profile is valid.
 *
 * @param      {string}  accountId       account id to check
 * @param      {string}  password        password to check
 * @param      {string}  encryptionSalt  encryption salt to retrieve the encryption key with
 *                                       (default account id)
 * @return     {boolean}  True if account password valid, False otherwise
 */
async function isAccountPasswordValid(accountId: string, password: string,
  encryptionSalt = accountId): Promise<boolean> {
  const encryptionkey = EvanlightWallet.getEncryptionKeyFromPassword(encryptionSalt, password);
  const accountIdentity = await getIdentityForAccount(accountId, await getContextLessRuntime());
  const runtime = await createRuntime(accountId, accountIdentity, encryptionkey);

  let targetPrivateKey;
  try {
    targetPrivateKey = await runtime.profile.getContactKey(
      accountId,
      'dataKey',
    );
  } catch (ex) {
    // password incorrect
  }

  // if the private key for this account could be loaded, the password is valid
  if (targetPrivateKey) {
    return true;
    // TODO: remove duplicated check, when old profiles without accountId salt are gone
  }


  // WARNING: for old accounts: overwrite current encryption key, to use the key without a accountId
  if (encryptionSalt && await isAccountPasswordValid(accountId, password, '')) {
    await EvanlightWallet.overwriteVaultEncryptionKey(
      accountId,
      EvanlightWallet.getEncryptionKeyFromPassword('', password),
    );

    return true;
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
async function isOnboarded(address: string): Promise<boolean> {
  try {
    // load profile index
    const runtime = await createRuntime(address);
    const ensName = runtime.nameResolver.getDomainName(runtime.nameResolver.config.domains.profile);
    const profileIndexAddress = await runtime.nameResolver.getAddress(ensName);
    const profileIndex = runtime.nameResolver.contractLoader
      .loadContract('ProfileIndexInterface', profileIndexAddress);

    // Check if a account / identity address has a underlying profile
    const profileAddress = await runtime.nameResolver.executor.executeContractCall(
      profileIndex,
      'getProfile',
      address,
      { from: address },
    );

    return profileAddress !== '0x0000000000000000000000000000000000000000';
  } catch (ex) {
    return false;
  }

  return true;
}

export {
  createRuntime,
  getBalance,
  getContextLessRuntime,
  getIdentityForAccount,
  isAccountPasswordValid,
  isOnboarded,
};
