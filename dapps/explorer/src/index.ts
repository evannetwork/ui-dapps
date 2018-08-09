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
  getDomainName,
  routing
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
  startAngularApplication,
  createIonicAppElement,
  getDashboardRoutes
} from 'angular-core';

import { DAppsTranslations } from './i18n/registry';
import { ExplorerBaseContractComponent } from './components/basecontract/basecontract';
import { ExplorerContractGeneralComponent } from './components/general/general';
import { ExplorerContractInteractionComponent } from './components/contractinteraction/contractinteraction';
import { ExplorerDataContractComponent } from './components/datacontract/datacontract';
import { ExplorerDataContractDetailComponent } from './components/datacontract/detail/detail';
import { ExplorerDataContractListEntryComponent } from './components/datacontract/listentry/listentry';
import { ExplorerDBCPComponent } from './components/dbcp/dbcp';
import { ExplorerSelectComponent } from './components/select/select';
import { ExplorerService } from './services/explorer.service';
import { ExplorerTransactionDetailComponent } from './components/transactionhistory/detail/detail';
import { ExplorerTransactionHistoryComponent } from './components/transactionhistory/transactionhistory';
import { RootComponent } from './components/root/root';

import { AceEditorModule } from 'ng2-ace-editor';
import 'brace/mode/json';

/**************************************************************************************************/

function getRoutes(): Routes {
  return buildModuleRoutes(
    `explorer.${ getDomainName() }`,
    RootComponent,
    [
     {
        path: '',
        component: ExplorerSelectComponent,
        data: {
          navigateBack : async () => {
            const defaultDAppEns = await routing.getDefaultDAppENS();

            window.location.hash = `/${ defaultDAppEns }`;
          },
          state: 'select',
        }
     },
     {
        path: ':id',
        data: {
          state: 'detail'
        },
        children: getDashboardRoutes([
          {
            path: '',
            redirectTo: `general`,
            pathMatch: 'full'
          },
          {
            path: 'general',
            component: ExplorerContractGeneralComponent,
            data: {
              state: 'general',
            }
          },
          {
            path: 'basecontract',
            component: ExplorerBaseContractComponent,
            data: {
              state: 'basecontract',
            }
          },
          {
            path: 'contractinteraction',
            component: ExplorerContractInteractionComponent,
            data: {
              state: 'contractinteraction',
            }
          },
          {
            path: 'datacontract',
            component: ExplorerDataContractComponent,
            data: {
              state: 'datacontract',
            },
            children: [
              {
                path: ':entryKey',
                data: {
                  state: 'datacontract-detail',
                  navigateBack: true,
                },
                component: ExplorerDataContractDetailComponent
              }
            ]
          },
          {
            path: 'dbcp',
            component: ExplorerDBCPComponent,
            data: {
              state: 'dbcp',
            }
          },
          {
            path: 'transactionhistory',
            component: ExplorerTransactionHistoryComponent,
            data: {
              state: 'transactionhistory',
            }
          },
          {
            path: 'transactionhistory/:transactionhash',
            component: ExplorerTransactionDetailComponent,
            data: {
              state: 'transactionhistory',
              navigateBack: true
            }
          },
        ], true)
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
      AceEditorModule,
    ],
    providers: [
      DAppsTranslations,
      ExplorerService,
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
      ExplorerBaseContractComponent,
      ExplorerContractGeneralComponent,
      ExplorerContractInteractionComponent,
      ExplorerDataContractComponent,
      ExplorerDataContractDetailComponent,
      ExplorerDataContractListEntryComponent,
      ExplorerDBCPComponent,
      ExplorerSelectComponent,
      ExplorerTransactionDetailComponent,
      ExplorerTransactionHistoryComponent,
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
class ExplorerModule {
  constructor(private translations: DAppsTranslations) { }
}

export async function startDApp(container, dbcpName) {
  const ionicAppEl = createIonicAppElement(container, dbcpName);
  
  await startAngularApplication(ExplorerModule, getRoutes());

  container.appendChild(ionicAppEl);
}
