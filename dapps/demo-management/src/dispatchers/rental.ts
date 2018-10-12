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
  getDomainName
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
  PresetLindig,
  presetLindigDefaultConfig,
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
          const preset = new PresetLindig();
          const runtimes = await Promise.all([
            service.getBCCProfileForUser(entry.users[0]),
            service.getBCCProfileForUser(entry.users[1])
          ]);
          const supplierAccountId = entry.users[1].accountId;

          let input = {
            nextSteps: ['init'],
            accountId: supplierAccountId,
          };

          // parties take turns with executing their parts of the preset setup
          // even turns are executed by the 'server', odd turns are executed by the 'client'
          let turn = 0;
          while (input && input.nextSteps && input.nextSteps.length) {
            input = await preset.applyPreset(runtimes[turn++ % 2], presetLindigDefaultConfig, input)
            input.accountId = supplierAccountId
          }

          console.dir(input);
        }
      }
    )
  ],
  translations,
  'DemoManagementService'
);

