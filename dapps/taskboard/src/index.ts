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
  startAngularApplication, createIonicAppElement,
  getDashboardRoutes
} from '@evan.network/ui-angular-core';

import { TaskBoardTranslations } from './i18n/registry';
import { TaskBoardRootComponent } from './components/root/root';
import { TasksComponent } from './components/tasks/tasks';
import { TaskService } from './services/task';

/**************************************************************************************************/

function getRoutes(): Routes {
  return buildModuleRoutes(
    `taskboard.${ getDomainName() }`,
    TaskBoardRootComponent,
    [
      {
        path: '',
        component: TasksComponent,
        data: {
          state: 'task-list',
          navigateBack : true,
          disableLoadingSubDApp: true,
          reload: [ 'contracts' ]
        },
        children: getDashboardRoutes([
          {
            path: `task.${ getDomainName() }`,
            children: [ { path: '**', component: DAppLoaderComponent, data: { state: 'task-create' } }, ],
            data: {
              state: 'task-create',
              navigateBack : true,
              reload: [ 'contracts' ]
            },
          },
          {
            path: ':address',
            children: [ { path: '**', component: DAppLoaderComponent, data: { state: 'task-create' } }, ],
            data: {
              state: 'task-detail',
              navigateBack : true,
              reload: [ 'contracts' ]
            },
          }
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
    ],
    providers: [
      TaskBoardTranslations,
      TaskService,
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
      TaskBoardRootComponent,
      TasksComponent,
    ];
  }

  return config;
}

@NgModule(getConfig(true))
export class DispatcherModule {
  constructor() { }
}

@NgModule(getConfig(false))
class TaskboardModule {
  constructor(private translations: TaskBoardTranslations) { }
}

export async function startDApp(container, dbcpName) {
  const ionicAppEl = createIonicAppElement(container, dbcpName);

  await startAngularApplication(TaskboardModule, getRoutes());

  container.appendChild(ionicAppEl);
}
