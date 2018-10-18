/*
  Copyright (c) 2018-present evan GmbH.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
      http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import {
  bccHelper,
  getDomainName,
  lightwallet,
} from 'dapp-browser';

import {
  buffer,
  prottle,
} from 'bcc';

import {
  Injectable,
  Component, OnInit, Input,            // @angular/core
  Validators, FormBuilder, FormGroup,  // @angular/forms
  DomSanitizer
} from 'angular-libs';

import {
  AngularCore,
  QueueSequence,
  QueueDispatcher,
  SingletonService
} from 'angular-core';

import {
  translations
} from '../i18n/registry';

import {
  DemoManagementService
} from '../services/service';

/**************************************************************************************************/

export const profilesDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_dm.handling-dispatcher.title',
      '_dm.handling-dispatcher.description',
      async (service: DemoManagementService, queueEntry: any) => {
        const results = [ ];
        const activeAccount = service.core.activeAccount();

        // get businessCenter instance
        for (let entry of queueEntry.data) {
          const copy = service.core.utils.deepCopy(entry);
          const captchaToken = copy.captchaToken;
          copy.users = copy.users.map(user => service.getClearUser(user));

          // clear the data
          delete copy.captchaToken;

          // update the demo data
          await service.bcc.profile.loadForAccount(service.bcc.profile.treeLabels.contracts);
          await service.bcc.profile.addBcContract(service.demoStorage, copy.address, copy);
          await service.bcc.profile.storeForAccount(service.bcc.profile.treeLabels.contracts);
          await service.bcc.profile.loadForAccount(service.bcc.profile.treeLabels.contracts);

          await prottle(10, copy.users.map(user => async () => {
            // load current data for the user
            await service.checkUserStatus(null, user);

            // only onboard the user, if no profile exists
            if (!user.isOnboared) {
              service.core.utils.log(
                `[Demo-Management]: onboarding user ${ user.alias }, ${ user.accountId }`, 'debug');

              // get a singleton profile instance
              const profileRuntime = await service.getRuntimeForUser(user);
              const profile = profileRuntime.profile;

              service.core.utils.log(`[Demo-Management] ${ user.accountId }: load new diffiehellman
                keys and set profile and contact specific data`, 'debug');
              // load new diffiehellman keys and set profile and contact specific data
              const dhKeys = profileRuntime.keyExchange.getDiffieHellmanKeys();
              await profile.addContactKey(user.accountId, 'dataKey', dhKeys.privateKey.toString('hex'));
              await profile.addProfileKey(user.accountId, 'alias', user.alias);
              await profile.addPublicKey(dhKeys.publicKey.toString('hex'));
              
              // load sharings and crypto info
              service.core.utils.log(`[Demo-Management] ${ user.accountId }: load sharings and
                crypto info`, 'debug');
              const sharing = await profileRuntime.dataContract.createSharing(user.accountId);
              const cryptor = profileRuntime.ipld.cryptoProvider.getCryptorByCryptoAlgo('aesEcb');

              // set ipld
              service.core.utils.log(`[Demo-Management] ${ user.accountId }: set ipld`, 'debug');
              const fileHashes = <any>{};
              fileHashes[profile.treeLabels.addressBook] = await profile.storeToIpld(profile.treeLabels.addressBook);
              fileHashes[profile.treeLabels.publicKey] = await profile.storeToIpld(profile.treeLabels.publicKey);
              fileHashes.sharingsHash = sharing.sharingsHash;

              // encrypt the data
              service.core.utils.log(`[Demo-Management] ${ user.accountId }: encrypt the data`,
                'debug');
              fileHashes[profile.treeLabels.addressBook] = await cryptor.encrypt(
                buffer.from(fileHashes[profile.treeLabels.addressBook].substr(2), 'hex'),
                { key: sharing.hashKey, }
              );
              fileHashes[profile.treeLabels.addressBook] = `0x${fileHashes[profile.treeLabels.addressBook].toString('hex')}`;
              
              // call the agent 
              service.core.utils.log(`[Demo-Management] ${ user.accountId }: call the agent`,
                'debug');
              var apiURL = 'https://agents.evan.network/api/smart-agents/faucet/handout?apiVersion=1';
              const signer = user.accountId.toLowerCase();
              const pk = '0x' + user.vault.exportPrivateKey(signer, user.vault.pwDerivedKey);
              const signature = service.bcc.web3.eth.accounts.sign('Gimme Gimme Gimme!', pk)
                .signature
              
              await service.http.post(
                'https://agents.evan.network/api/smart-agents/faucet/handout?apiVersion=1',
                {
                  accountId: user.accountId,
                  signature: signature,
                  profileInfo: fileHashes,
                  captchaToken: user.captchaToken,
                }
              ).toPromise();
            }
          }));
        }
      }
    )
  ],
  translations,
  'DemoManagementService'
);
