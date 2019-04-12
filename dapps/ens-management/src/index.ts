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
  BrowserAnimationsModule,     // @angular/platform-browser/animations
  CommonModule,                // @angular/common
  IonicModule, IonicApp,       // ionic-angular
  NgModule,                    // @angular/core
  RouterModule, Routes,        // @angular/router
} from '@evan.network/ui-angular-libs';

import {
  AngularCore,
  BootstrapComponent,
  buildModuleRoutes,
  createIonicAppElement,
  DAppLoaderComponent,
  startAngularApplication,
} from '@evan.network/ui-angular-core';

import {
  AceEditorModule,
  ExplorerDBCPComponent,
  ExplorerService,
  ExplorerTranslations,
} from 'explorer';

import { ENSCheckComponent } from './components/ens-check/ens-check';
import { ENSManagementDetailComponent } from './components/detail/detail';
import { ENSManagementOverviewComponent } from './components/overview/overview';
import { RootComponent } from './components/root/root';
import { Translations } from './i18n/registry';

import { addFavoriteDispatcher } from './dispatchers/addFavorite';
import { dataDispatcher } from './dispatchers/data';
import { ENSManagementService } from './services/service';
import { purchaseDispatcher } from './dispatchers/purchase';
import { removeFavoriteDispatcher } from './dispatchers/removeFavorite';

export {
  addFavoriteDispatcher,
  dataDispatcher,
  ENSManagementService,
  purchaseDispatcher,
  removeFavoriteDispatcher,
  Translations,
}

/**************************************************************************************************/

function getRoutes(): Routes {
  return buildModuleRoutes(
    `ensmanagement.${ getDomainName() }`,
    RootComponent,
    [
      {
        path: '',
        component: ENSManagementOverviewComponent,
        data: {
          state: 'overview',
          reload: true,
          navigateBack: true,
        }
      },
      {
        path: ':id',
        component: ENSManagementDetailComponent,
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
      AceEditorModule,
      AngularCore,
      CommonModule,
    ],
    providers: [
      ENSManagementService,
      ExplorerService,
      Translations,
      ExplorerTranslations,
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
      ENSCheckComponent,
      ENSManagementDetailComponent,
      ENSManagementOverviewComponent,
      ExplorerDBCPComponent,
      RootComponent,
    ];
  }

  return config;
}

@NgModule(getConfig(true))
export class DispatcherModule {
  constructor() { }
}

@NgModule(getConfig(false))
class ENSManagementModule {
  constructor(
    private explorerTranslations: ExplorerTranslations,
    private translations: Translations,
  ) { }
}

export async function startDApp(container, dbcpName) {
  const ionicAppEl = createIonicAppElement(container, dbcpName);
  
  await startAngularApplication(ENSManagementModule, getRoutes());

  container.appendChild(ionicAppEl);
}
