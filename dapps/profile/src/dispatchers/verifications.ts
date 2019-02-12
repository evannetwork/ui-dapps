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

export const profileVerificationsDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_profile.profile-verifications-dispatcher.title',
      '_profile.profile-verifications-dispatcher.description',
      async (service: ProfileService, queueEntry: any) => {
        const results = [ ];

        // get businessCenter instance
        for (let entry of queueEntry.data) {
          const profile = service.bcc.profile;

          // load current data
          await profile.loadForAccount(profile.treeLabels.activeVerifications);

          // if data is returned, we do not need to set the operation permissions
          const exists = await profile.ipld.getLinkedGraph(
            profile.trees[profile.treeLabels.activeVerifications],
            profile.treeLabels.activeVerifications
          );

          // save the data
          await profile.setActiveVerifications(entry.verifications);

          // if no active verifications are set before, set them
          if (!exists) {
            await service.bcc.rightsAndRoles.setOperationPermission(
              profile.profileContract,              // contract to be updated
              service.core.activeAccount(),         // account, that can change permissions
              0,                                    // role id, uint8 value
              profile.treeLabels.activeVerifications,      // name of the object
              service.bcc.web3.utils.sha3('entry'), // what type of element is modified
              service.bcc.web3.utils.sha3('set'),   // type of the modification
              true,                                 // grant this capability
            );
          }

          await profile.storeForAccount(profile.treeLabels.activeVerifications);
        }
      }
    )
  ],
  translations,
  'ProfileService'
);

