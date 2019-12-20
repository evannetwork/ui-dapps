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
  VerificationService
} from '../services/service';

/**************************************************************************************************/

export const rejectDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_verifications.reject-dispatcher.title',
      '_verifications.reject-dispatcher.description',
      async (service: VerificationService, queueEntry: any) => {
        const results = [ ];

        // get businessCenter instance
        for (let entry of queueEntry.data) {
          entry.rejectReason.date = Date.now();
          entry.rejectReason.rejector = service.core.activeAccount();

          await service.bcc.verifications.rejectVerification(
            service.core.activeAccount(),
            entry.address,
            entry.id,
            entry.rejectReason
          );
        }
      }
    )
  ],
  translations,
  'VerificationService'
);
