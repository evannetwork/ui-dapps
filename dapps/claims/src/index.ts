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
} from 'dapp-browser';

import {
  NgModule,                    // @angular/core
  CommonModule,                // @angular/common
  RouterModule, Routes,        // @angular/router
  IonicModule, IonicApp,       // ionic-angular
  BrowserAnimationsModule,     // @angular/platform-browser/animations
} from 'angular-libs';

import {
  AngularCore,
  DAppLoaderComponent,
  buildModuleRoutes,
  BootstrapComponent,
  startAngularApplication, createIonicAppElement
} from 'angular-core';

import { RootComponent } from './components/root/root';
import { EvanClaimsOverviewComponent } from './components/claims/claims';
import { EvanIdentityMissingComponent } from './components/identity-missing/identity-missing';
import { Translations } from './i18n/registry';

import { ClaimService } from './services/service';
import { acceptDispatcher } from './dispatchers/accept';
import { deleteDispatcher } from './dispatchers/delete';
import { identityDispatcher } from './dispatchers/identity';
import { issueDispatcher } from './dispatchers/issue';

export {
  acceptDispatcher,
  ClaimService,
  deleteDispatcher,
  identityDispatcher,
  issueDispatcher,
}

/**************************************************************************************************/

function getRoutes(): Routes {
  return buildModuleRoutes(
    `demomanagement.${ getDomainName() }`,
    RootComponent,
    [
      {
        path: '',
        component: EvanClaimsOverviewComponent,
        data: {
          state: 'overview',
          reload: true
        }
      },
      {
        path: ':address',
        component: EvanClaimsOverviewComponent,
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
function getConfig(isDispatcher?: boolean) {
  let config: any = {
    imports: [
      CommonModule,
      AngularCore,
    ],
    providers: [
      Translations,
      ClaimService,
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
      EvanClaimsOverviewComponent,
      EvanIdentityMissingComponent,
      RootComponent,
    ];
  }

  return config;
}

@NgModule(getConfig(true))
export class DispatcherModule {
  constructor() { }
}

@NgModule(getConfig(true))
export class ClaimLibraryModule {
  constructor() { }
}

@NgModule(getConfig(false))
class ClaimsModule {
  constructor(private translations: Translations) { }
}

export async function startDApp(container, dbcpName) {
  const ionicAppEl = createIonicAppElement(container, dbcpName);
  
  await startAngularApplication(ClaimsModule, getRoutes());

  container.appendChild(ionicAppEl);
}
