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
} from 'dapp-browser';

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
        for (let entry of queueEntry.data) {
          switch (entry.type) {
            // open a new payment channel for the active account
            case 'openChannel': {
              // transform eve to gwei
              const eveToSend = service.bcc.web3.utils.toWei(entry.eve, 'milliether');
              await service.bcc.payments.openChannel(activeAccount, service.agentAccountId,
                eveToSend);

              break;
            }
            // charge an channel using an specific amount of eve
            case 'topUp': {
              // prepare channel for top tup
              const channel = entry.channel;
              channel.account = activeAccount;
              channel.proof = {};
              channel.block = channel.openBlockNumber;
              service.bcc.payments.setChannel(channel);

              // transform eve value to gwei
              const eveToSend = service.bcc.web3.utils.toWei(entry.eve, 'milliether');
              await service.bcc.payments.topUpChannel(eveToSend);

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

