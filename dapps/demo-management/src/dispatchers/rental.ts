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
  DemoManagementService
} from '../services/service';

import {
  RentalPreset,
} from '../presets/rental';

/**************************************************************************************************/

export const rentalDispatcher = new QueueDispatcher(
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
          const runtimes = await Promise.all([
            service.getRuntimeForUser(copy.users[0]),
            service.getRuntimeForUser(copy.users[1])
          ]);

          // create a new preset and run everything!
          const preset = new RentalPreset(copy.users, runtimes, service);

          // make users known to each other, run the contract creation, invite and share everything,
          // add bookmarks.
          const result = await preset.run();
          copy.contractAddress = result.address;
          copy.ensAddress = result.ensAddress;

          // clear the data for saving and set the contract address
          copy.users = copy.users.map(user => service.getClearUser(user));

          // update the demo data
          await service.bcc.profile.loadForAccount(service.bcc.profile.treeLabels.contracts);
          await service.bcc.profile.addBcContract(service.demoStorage, copy.address, copy);
          await service.bcc.profile.storeForAccount(service.bcc.profile.treeLabels.contracts);
          await service.bcc.profile.loadForAccount(service.bcc.profile.treeLabels.contracts);
        }
      }
    )
  ],
  translations,
  'DemoManagementService'
);

