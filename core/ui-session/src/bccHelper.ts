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
  Profile,
  Runtime,
} from '@evan.network/api-blockchain-core';
import { config } from '@evan.network/ui-dapp-browser';

import { getWeb3Instance } from './web3Helper';
import EvanSession from './session';
import EvanlightWallet from './lightwallet';

/**
 * Wraps the original create default runtime bcc function to simplify key and account map
 * management.
 *
 * @param      {any}     CoreBundle     blockchain-core ipfs bundle
 * @param      {string}  accountId      account id to create the runtime for
 * @param      {string}  encryptionKey  enryption key of the users profile
 * @param      {string}  privateKey     account id's private key
 * @param      {any}     config         overwrite the ui configuration with a custom config
 * @param      {any}     web3           overwrite the CoreRuntime web3 with a new one
 * @param      {any}     dfs            overwrite the CoreRuntime dfs with a new one
 * @return     {any}     the new bcc defaultruntime
 */
async function shortHandCreateDefaultRuntime(
  accountId = '0x0000000000000000000000000000000000000000',
  encryptionKey?: string,
  privateKey?: string,
  inputConfig?: any,
  dfs?: any,
  options?: any,
): Promise<Runtime> {
  // fill web3 per default with the core runtime web3
  const web3 = getWeb3Instance();
  const { soliditySha3 } = web3.utils;

  // get accounthash for easy acces within keyConfig
  const accountHash = soliditySha3(accountId);
  const runtimeConfig = { ...(inputConfig || JSON.parse(JSON.stringify(config))) };
  runtimeConfig.keyConfig = { };
  runtimeConfig.accountMap = { };

  // set key config for the user accountId
  runtimeConfig.keyConfig[accountHash] = encryptionKey;
  runtimeConfig.keyConfig[soliditySha3(accountHash, accountHash)] = encryptionKey;
  // set mailbox edge key
  runtimeConfig.keyConfig[soliditySha3('mailboxKeyExchange')] =
    '346c22768f84f3050f5c94cec98349b3c5cbfa0b7315304e13647a4918ffff22';

  // set private key
  runtimeConfig.accountMap[accountId] = privateKey;

  // create the new runtime
  const runtime = await createDefaultRuntime(
    web3,
    dfs,
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
  if (EvanSession.getCurrentProvider() === 'agent-executor') {
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
 * Check if the password for a given account id and its profile is valid.
 *
 * @param      {any}      CoreBundle      blockchain-core ipfs bundle
 * @param      {string}   accountId       account id to check
 * @param      {string}   password        password to check
 * @param      {string}   encryptionSalt  encryption salt to retrieve the encryption key with
 *                                        (default account id)
 * @return     {boolean}  True if account password valid, False otherwise
 */
async function isAccountPasswordValid(accountId: string, password: string,
  encryptionSalt = accountId): Promise<boolean> {
  const encryptionkey = EvanlightWallet.getEncryptionKeyFromPassword(encryptionSalt, password);
  const runtime = await shortHandCreateDefaultRuntime(accountId, encryptionkey);

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
 * @param      {string}   account  account id to test
 * @return     {boolean}  True if account onboarded, False otherwise
 */
async function isAccountOnboarded(account: string): Promise<boolean> {
  try {
    const runtime = await shortHandCreateDefaultRuntime(account);
    const ensName = runtime.nameResolver.getDomainName(runtime.nameResolver.config.domains.profile);
    const address = await runtime.nameResolver.getAddress(ensName);
    const contract = runtime.nameResolver.contractLoader.loadContract('ProfileIndexInterface', address);
    const hash = await runtime.nameResolver.executor.executeContractCall(contract, 'getProfile',
      account, { from: account });

    if (hash === '0x0000000000000000000000000000000000000000') {
      const identity = await runtime.verifications.getIdentityForAccount(account, true);
      const identityProfile = await runtime.nameResolver.executor.executeContractCall(contract,
        'getProfile', identity, { from: account });
      if (identityProfile === '0x0000000000000000000000000000000000000000') {
        return false;
      }
    }
  } catch (ex) {
    return false;
  }

  return true;
}

export {
  createDefaultRuntime,
  isAccountOnboarded,
  isAccountPasswordValid,
  shortHandCreateDefaultRuntime,
};
