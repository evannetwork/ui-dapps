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
  VerificationService
} from '../services/service';

/**************************************************************************************************/

export const descriptionDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_verifications.description-dispatcher.title',
      '_verifications.description-dispatcher.description',
      async (service: VerificationService, queueEntry: any) => {
        const results = [ ];
        const activeAccount = service.core.activeAccount();
        const nameResolver = service.bcc.nameResolver;

        // get businessCenter instance
        for (let entry of queueEntry.data) {
          // split the current address, and remove the first entry to get the parent element
          const splitParentAddress = entry.ensAddress.split('.');
          splitParentAddress.splice(0, 1);

          // load all owners
          const owners = await Promise.all(splitParentAddress.map((address, index) => 
            service.bcc.executor.executeContractCall(
              nameResolver.ensContract,
              'owner',
              // get the corresponding concadinated address
              nameResolver.namehash(splitParentAddress.slice(index, splitParentAddress.length)
                .join('.'))
            )
          ));

          // check the full path, if every parent level has set a owner, else, try to set it
          for (let i = splitParentAddress.length - 2; i > -1; i--) {
            // if the parent is owned by me and the current one is not owned by me, set the address
            if (activeAccount === owners[i + 1] && activeAccount !== owners[i]) {
              const ensAddress = splitParentAddress.slice(i, splitParentAddress.length)
                .join('.');

              // reset the current address by setting the current user as owner
              await nameResolver.setAddress(
                ensAddress,
                await nameResolver.getAddress(ensAddress),
                activeAccount
              );

              // override owners array to check the correct new value
              owners[i] = activeAccount;
            }
          }

          // set the description
          await service.bcc.description.setDescription(
            entry.ensAddress,
            { public: entry.description, },
            service.core.activeAccount()
          );

          // clear the cache
          delete service.descriptionService.descriptions[entry.ensAddress];

          // clear cache for verifications using this description ens address
          service.verifications.deleteFromVerificationCache('*', entry.topic);
        }
      }
    )
  ],
  translations,
  'VerificationService'
);
