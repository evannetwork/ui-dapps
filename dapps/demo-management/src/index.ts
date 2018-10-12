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
import { OverviewComponent } from './components/overview/overview';
import { UsersComponent } from './components/users/users';
import { RentalComponent } from './components/types/rental/rental';
import { Translations } from './i18n/registry';

import { DemoManagementService } from './services/service';
import { handlingDispatcher } from './dispatchers/handling';
import { profilesDispatcher } from './dispatchers/profiles';
import { rentalDispatcher } from './dispatchers/rental';

export {
  DemoManagementService,
  handlingDispatcher,
  profilesDispatcher,
  rentalDispatcher,
}

/**************************************************************************************************/

function getRoutes(): Routes {
  return buildModuleRoutes(
    `demomanagement.${ getDomainName() }`,
    RootComponent,
    [
      {
        path: '',
        component: OverviewComponent,
        data: {
          navigateBack: true,
          state: 'overview',
          reload: true
        }
      },
      {
        path: 'rental/:address',
        component: RentalComponent,
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
      DemoManagementService,
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
      OverviewComponent,
      RentalComponent,
      RootComponent,
      UsersComponent,
    ];
  }

  return config;
}

@NgModule(getConfig(true))
export class DispatcherModule {
  constructor() { }
}

@NgModule(getConfig(false))
class DemoGeneratorModule {
  constructor(private translations: Translations) { }
}

export async function startDApp(container, dbcpName) {
  const ionicAppEl = createIonicAppElement(container, dbcpName);
  
  await startAngularApplication(DemoGeneratorModule, getRoutes());

  container.appendChild(ionicAppEl);
}
