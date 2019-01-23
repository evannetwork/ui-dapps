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

export const sendEveDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_profile.send-eve-dispatcher.title',
      '_profile.send-eve-dispatcher.description',
      async (service: ProfileService, queueEntry: any) => {
        const results = [ ];

        // get businessCenter instance
        for (let entry of queueEntry.data) {
          await service.bcc.executor.executeSend({
            from: service.core.activeAccount(),
            to: entry.receiver,
            value: service.bcc.web3.utils.toWei(entry.eve.toString(), 'ether')
          });
        }
      }
    )
  ],
  translations,
  'ProfileService'
);

