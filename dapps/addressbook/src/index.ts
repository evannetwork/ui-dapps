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

export { ContactsDispatcher, ContactsDispatcherService } from './dispatcher/contacts';
import { AccountDetailComponent } from './components/account-detail/account-detail';
import { AccountListComponent } from './components/accounts-list/accounts-list';
import { ContactsDispatcherService } from './dispatcher/contacts';
import { ContactsRootComponent } from './components/root/root';
import { ContactsTranslations } from './i18n/registry';

/**************************************************************************************************/

function getRoutes(): Routes {
  return buildModuleRoutes(
    `addressbook.${ getDomainName() }`,
    ContactsRootComponent,
    [
      {
        path: '',
        component: AccountListComponent,
        data: {
          reload: true,
          state: 'account-list',
        }
      },
      {
        path: 'add-via-mail',
        component: AccountDetailComponent,
        data: {
          state: 'add-via-mail',
          navigateBack : true,
          reload: true,
        }
      },
      {
        path: 'add-via-accountid',
        component: AccountDetailComponent,
        data: {
          state: 'add-via-accountid',
          navigateBack : true,
          reload: true,
        }
      },
      {
        path: 'add-via-qrcode',
        component: AccountDetailComponent,
        data: {
          state: 'add-via-qrcode',
          navigateBack : true,
          reload: true,
        }
      },
      {
        path: ':id',
        component: AccountDetailComponent,
        data: {
          state: 'account-detail',
          navigateBack : true,
          reload: true,
        }
      },
    ]
  );
};

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
      IonicModule,
      AngularCore,
    ],
    providers: [
      ContactsTranslations,
      ContactsDispatcherService,
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
      AccountDetailComponent,
      AccountListComponent,
      BootstrapComponent,
      ContactsRootComponent,
    ];
  }

  return config;
}

@NgModule(getConfig(true))
export class DispatcherModule {
  constructor() { }
}

@NgModule(getConfig(false))
class ContactsModule {
  constructor(private translations: ContactsTranslations) { }
}

export async function startDApp(container, dbcpName) {
  const ionicAppEl = createIonicAppElement(container, dbcpName);

  await startAngularApplication(ContactsModule, getRoutes());

  container.appendChild(ionicAppEl);
}
