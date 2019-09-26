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

import { RootComponent } from './components/root/root';
import { EvanVerificationsOverviewComponent } from './components/verifications/verifications';
import { EvanIdentityMissingComponent } from './components/identity-missing/identity-missing';
import { VerificationsTranslations } from './i18n/registry';

import { acceptDispatcher } from './dispatchers/accept';
import { VerificationService } from './services/service';
import { deleteDispatcher } from './dispatchers/delete';
import { descriptionDispatcher } from './dispatchers/description';
import { identityDispatcher } from './dispatchers/identity';
import { issueDispatcher } from './dispatchers/issue';
import { rejectDispatcher } from './dispatchers/reject';

export {
  acceptDispatcher,
  VerificationService,
  VerificationsTranslations,
  deleteDispatcher,
  descriptionDispatcher,
  identityDispatcher,
  issueDispatcher,
  rejectDispatcher,
}

/**************************************************************************************************/

function getRoutes(): Routes {
  return buildModuleRoutes(
    `demomanagement.${ getDomainName() }`,
    RootComponent,
    [
      {
        path: '',
        component: EvanVerificationsOverviewComponent,
        data: {
          state: 'overview',
          reload: true
        }
      },
      {
        path: ':address',
        component: EvanVerificationsOverviewComponent,
        data: {
          navigateBack: true,
          state: 'overview',
          reload: true
        }
      },
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
function getConfig(isDispatcher?: boolean, isLibrary?: boolean) {
  let config: any = {
    imports: [
      CommonModule,
      AngularCore,
    ],
    providers: [
      VerificationsTranslations,
      VerificationService,
    ],
  };

  if (!isDispatcher) {
    config.imports = config.imports.concat([
      RouterModule.forRoot(getRoutes(), { }),
      IonicModule.forRoot(BootstrapComponent, {
        mode: 'md'
      }),
      BrowserAnimationsModule,
    ]);

    config.bootstrap = [
      IonicApp
    ];

    config.declarations = [
      BootstrapComponent,
      EvanVerificationsOverviewComponent,
      EvanIdentityMissingComponent,
      RootComponent,
    ];
  } if (isLibrary) {
    config.declarations = [
      EvanVerificationsOverviewComponent,
      EvanIdentityMissingComponent,
    ];

    config.exports = [
      EvanVerificationsOverviewComponent,
      EvanIdentityMissingComponent,
    ];
  }

  return config;
}

@NgModule(getConfig(true))
export class DispatcherModule {
  constructor() { }
}

@NgModule(getConfig(true, true))
export class VerificationLibraryModule {
  constructor() { }
}

@NgModule(getConfig(false))
class VerificationsModule {
  constructor(private translations: VerificationsTranslations) { }
}

export async function startDApp(container, dbcpName) {
  const ionicAppEl = createIonicAppElement(container, dbcpName);
  
  await startAngularApplication(VerificationsModule, getRoutes());

  container.appendChild(ionicAppEl);
}
