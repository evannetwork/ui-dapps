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
} from '@evan.network/ui-dapp-browser';

import {
  Injectable,
  Component, OnInit, Input,            // @angular/core
  Validators, FormBuilder, FormGroup,  // @angular/forms
  DomSanitizer
} from '@evan.network/ui-angular-libs';

import {
  AngularCore,
  QueueSequence,
  QueueDispatcher,
  SingletonService
} from '@evan.network/ui-angular-core';

import {
  translations
} from '../i18n/registry';

import {
  ProfileService
} from '../services/service';

/**************************************************************************************************/

export const paymentDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_profile.profile-payment-dispatcher.title',
      '_profile.profile-payment-dispatcher.description',
      async (service: ProfileService, queueEntry: any) => {
        const results = [ ];

        // get businessCenter instance
        const activeAccount = service.core.activeAccount();

        // check if the account has already a key exchange with the payment account
        const hasAgentExchangeKey = await service.bcc.profile.getContactKey(
          service.paymentService.paymentAgentAccountId,
          'commKey'
        );

        if (!hasAgentExchangeKey) {
          try {
            // get the profile and public key
            const smartAgentAccountId = service.paymentService.paymentAgentAccountId;
            const profile = service.bcc.getProfileForAccount(smartAgentAccountId);
            const targetPubKey = await profile.getPublicKey();

            // generate new communication key and send to agent
            const commKey = await service.bcc.keyExchange.generateCommKey();
            await service.bcc.keyExchange.sendInvite(smartAgentAccountId, targetPubKey, commKey, {});

            // add key to profile
            await service.bcc.profile.addContactKey(
              smartAgentAccountId,
              'commKey',
              commKey
            );
            await service.bcc.profile.addProfileKey(
              smartAgentAccountId,
              'alias',
              'Storage Smart Agent'
            );
            await service.bcc.profile.addProfileKey(
              smartAgentAccountId,
              'tags',
              'Smart Agent'
            );

            // at least store the key on the account
            await service.bcc.profile.storeForAccount(service.bcc.profile.treeLabels.addressBook);
          } catch (ex) {
            console.log('error occured')
          }
        }
        for (let entry of queueEntry.data) {
          switch (entry.type) {
            // open a new payment channel for the active account
            case 'openChannel': {
              // transform eve to gwei
              const eveToSend = service.bcc.web3.utils.toWei(entry.eve, 'ether');
              const createdChannel = await service.bcc.payments.openChannel(
                activeAccount,
                service.paymentService.paymentAgentAccountId,
                eveToSend
              );
              const proof = await service.bcc.payments.incrementBalanceAndSign(eveToSend);

              // send proof to agent
              await service.paymentService.requestPaymentAgent(
                `channel/confirm?proof=${proof.sig}&openBlockNumber=${createdChannel.block}`
              );
              break;
            }
            // charge an channel using an specific amount of eve
            case 'topUp': {
              // prepare channel for top tup
              const channel = entry.channel;
              channel.account = activeAccount;
              channel.proof = {
                balance: service.bcc.payments.toBigNumber('0')
              };
              channel.block = channel.openBlockNumber;
              service.bcc.payments.setChannel(channel);

              // transform eve value to gwei
              const eveToSend = service.bcc.web3.utils.toWei(entry.eve, 'ether');
              await service.bcc.payments.topUpChannel(eveToSend);
              const eveBn = service.bcc.payments.toBigNumber(eveToSend).plus(channel.deposit);
              const proof = await service.bcc.payments.incrementBalanceAndSign(eveBn);
              // send proof to agent
              await service.paymentService.requestPaymentAgent(
                `channel/confirm?proof=${proof.sig}&openBlockNumber=${channel.openBlockNumber}`
              );
              break;
            }
            // unpin an ipfs hash
            case 'removeHash': {
              await service.bcc.dfs.remoteNode.pin.rm(entry.hash);

              break;
            }
          }
        }
      }
    )
  ],
  translations,
  'ProfileService'
);

