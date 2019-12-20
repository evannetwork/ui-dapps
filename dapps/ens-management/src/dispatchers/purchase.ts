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
  ENSManagementService
} from '../services/service';

/**************************************************************************************************/

export const purchaseDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_verifications.purchase-dispatcher.title',
      '_verifications.purchase-dispatcher.description',
      async (service: ENSManagementService, queueEntry: any) => {
        const results = [ ];
        const activeAccount = service.core.activeAccount();

        for (let entry of queueEntry.data) {
          // purchaser the ens address
          await service.nameResolver.claimAddress(
            entry.ensAddress,
            activeAccount,
            activeAccount,
            await service.nameResolver.getPrice(entry.ensAddress)
          );

          // add the ens address to your favorites list
          await service.bcc.profile.addBcContract('evan-ens-management', entry.ensAddress, { });
        }

        // store profile contracts
        await service.bcc.profile.storeForAccount(service.bcc.profile.treeLabels.contracts);
      }
    )
  ],
  translations,
  'ENSManagementService'
);

