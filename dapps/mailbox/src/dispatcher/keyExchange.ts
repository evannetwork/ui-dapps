/*
  Copyright (C) 2018-present evan GmbH. 
  
  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3, 
  as published by the Free Software Foundation. 
  
  This program is distributed in the hope that it will be useful, 
  but WITHOUT ANY WARRANTY; without even the implied warranty of 
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details. 
  
  You should have received a copy of the GNU Affero General Public License along with this program.
  If not, see http://www.gnu.org/licenses/ or write to the
  
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA, 02110-1301 USA,
  
  or download the license from the following URL: https://evan.network/license/ 
  
  You can be released from the requirements of the GNU Affero General Public License
  by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts of it
  on other blockchains than evan.network. 
  
  For more information, please contact evan GmbH at this address: https://evan.network/license/ 
*/

import {
  Injectable,
  Component, OnInit, Input,            // @angular/core
  Validators, FormBuilder, FormGroup,  // @angular/forms
  DomSanitizer
} from 'angular-libs';

import {
  QueueSequence,
  QueueDispatcher,
  EvanBCCService,
  SingletonService
} from 'angular-core';

import {
  translations
} from '../i18n/registry';

/**************************************************************************************************/
@Injectable()
export class KeyExchangeDispatcherService {
  static providers = [
    EvanBCCService,
    SingletonService
  ];

  constructor(
    public bcc: EvanBCCService,
    public singleton: SingletonService
  ) {
    return singleton.create(KeyExchangeDispatcherService, this);
  }
}
export const KeyExchangeDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_dappmailbox.dispatcher.add-key',
      '_dappmailbox.dispatcher.add-key-description',
      async (service: KeyExchangeDispatcherService, data: any) => {
        const queueData = data.data;        
        for (let queueDataEntry of queueData) {
          await service.bcc.profile.storeForAccount(service.bcc.profile.treeLabels.addressBook);
          if (queueDataEntry.type === 'storeContracts') {
            await service.bcc.profile.storeForAccount(service.bcc.profile.treeLabels.contracts);
          }
        }
      }
    ),
    new QueueSequence(
      '_dappmailbox.dispatcher.send-commkey',
      '_dappmailbox.dispatcher.send-commkey-description',
      async (service: KeyExchangeDispatcherService, data: any) => {
        const queueData = data.data;
        for (let queueDataEntry of queueData) {
          if (queueDataEntry.type === 'send') {
           await service.bcc.keyExchange.sendCommKey(
             queueDataEntry.commSecret,
             queueDataEntry.from,
             queueDataEntry.mail,
             queueDataEntry.commKey
            );
          }
        }
      }
    )
  ],
  translations
);
