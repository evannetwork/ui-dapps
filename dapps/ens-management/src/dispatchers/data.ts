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
  ENSManagementService
} from '../services/service';

/**************************************************************************************************/

export const dataDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_claims.data-dispatcher.title',
      '_claims.data-dispatcher.description',
      async (service: ENSManagementService, queueEntry: any) => {
        const results = [ ];
        const bcc = service.bcc;

        for (let entry of queueEntry.data) {
          const activeAccount = service.core.activeAccount();

          // save the contract address
          if (entry.originData.owner !== entry.ensData.owner ||
              entry.originData.address !== entry.ensData.address) {
            await service.nameResolver.setAddress(entry.ensAddress, entry.ensData.address, activeAccount,
              entry.ensData.owner);
          }

          // save the content address
          if (entry.originData.contentAddress !== entry.ensData.contentAddress) {
            await service.nameResolver.setContent(entry.ensAddress, entry.ensData.contentAddress,
              activeAccount, entry.ensData.owner);
          }
          
          // save the content address
          if (entry.originData.resolver !== entry.ensData.resolver) {
            const ensContract = bcc.contractLoader.loadContract('ENS',
              service.nameResolver.config.ensAddress);

            // overwrite the ens resolver
            await bcc.executor.executeContractTransaction(
              ensContract, 
              'setResolver', 
              {
                from: activeAccount,
                gas: 4000000
              },
              service.nameResolver.namehash(entry.ensAddress),
              entry.ensData.resolver
            );     
          }
        }
      }
    )
  ],
  translations,
  'ENSManagementService'
);

