/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

import {
  getDomainName
} from '@evan.network/ui-dapp-browser';

import {
  NgModule,                    // @angular/core
  CommonModule,                // @angular/common
  RouterModule, Routes,        // @angular/router
  IonicModule, IonicApp,       // ionic-angular
  BrowserAnimationsModule,     // @angular/platform-browser/animations
} from '@evan.network/ui-angular-libs';

import {
  AngularCore,
  DAppLoaderComponent,
  buildModuleRoutes,
  BootstrapComponent,
  startAngularApplication, createIonicAppElement
} from '@evan.network/ui-angular-core';

import { AnswerMailDispatcher } from './dispatcher/answerMail';
import { CommKeyComponent } from './components/attachment-cards/comm-key/comm-key';
import { ContractComponent } from './components/attachment-cards/contract/contract';
import { KeyExchangeDispatcher, } from './dispatcher/keyExchange';
import { MailboxComponent } from './components/mailbox/mailbox';
import { MailboxRootComponent } from './components/root/root';
import { MailboxTranslations } from './i18n/registry';
import { MailDetailComponent } from './components/mail-detail/mail-detail';
import { MailDispatcherService } from './services/service';
import { MailSendComponent } from './components/mail-send/mail-send';
import { SendMailDispatcher, } from './dispatcher/sendMail';
import { UrlAttachmentComponent } from './components/attachment-cards/url/url';

export {
  AnswerMailDispatcher,
  KeyExchangeDispatcher,
  MailDispatcherService,
  SendMailDispatcher,
}

/**************************************************************************************************/

function getRoutes(): Routes {
  return buildModuleRoutes(
    `mailbox.${ getDomainName() }`,
    MailboxRootComponent,
    [
      {
        path: '',
        component: MailboxComponent,
        data: {
          state: 'mailbox-list',
          reload: true
        },
        children: [
          {
            path: 'send-mail',
            component: MailSendComponent,
            data: {
              state: 'mail-send',
              navigateBack : '..',
              reload: true
            },
          },
          {
            path: ':id',
            component: MailDetailComponent,
            data: {
              state: 'mail-detail',
              navigateBack : '..',
              reload: true
            },
          },
        ]
      }
    ]
  );
}

/**
 * Returns the module configuration for the normal or dispatcher module.
 * In case of the dispatcher module, Router configurations and BrowserModule imports are excluded
 * to load the module during runtime by the dispatcher service.
 *
 * @param isDispatcher  boolean value if the config is used for the dispatcher module
 */
function getConfig(isDispatcher?: boolean) {
  let config: any = {
    imports: [
      CommonModule,
      AngularCore,
    ],
    providers: [
      MailboxTranslations,
      MailDispatcherService,
    ],
    entryComponents: [ IonicApp ]
  };

  if (!isDispatcher) {
    config.imports.unshift(BrowserAnimationsModule);
    config.imports.unshift(RouterModule.forRoot(getRoutes(), { enableTracing: false, }));
    config.imports.push(IonicModule.forRoot(BootstrapComponent, {
      mode: 'md'
    }));

    config.bootstrap = [
      IonicApp
    ];

    config.declarations = [
      BootstrapComponent,
      CommKeyComponent,
      ContractComponent,
      MailboxComponent,
      MailboxRootComponent,
      MailDetailComponent,
      MailSendComponent,
    ];
  }

  return config;
}

@NgModule(getConfig(true))
export class DispatcherModule {
  constructor() { }
}

@NgModule(getConfig(false))
class MailboxModule {
  constructor(private translations: MailboxTranslations) { }
}

export async function startDApp(container, dbcpName) {
  const ionicAppEl = createIonicAppElement(container, dbcpName);

  await startAngularApplication(MailboxModule, getRoutes());

  container.appendChild(ionicAppEl);
}
