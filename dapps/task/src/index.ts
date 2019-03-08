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
  BootstrapComponent,
  createIonicAppElement,
  DAppLoaderComponent,
  buildModuleRoutes,
  startAngularApplication,
} from '@evan.network/ui-angular-core';

import { TaskContractDispatcherService } from './dispatcher/task';
import { TaskCreateComponent } from './components/create/create';
import { TaskDetailComponent } from './components/detail/detail';
import { TaskRootComponent } from './components/root/root';
import { TaskService } from './services/task';
import { TaskTranslations } from './i18n/registry';
import { TodoCreateComponent } from './components/todo-create/todo-create';
export {
  StateDispatcher,
  TaskContractDispatcher,
  TaskContractDispatcherService,
  TodoDispatcher,
  TodoLogDispatcher,
  MemberDispatcher
 } from './dispatcher/task';
 export { TaskCreateComponent } from './components/create/create';
 export { TaskDetailComponent } from './components/detail/detail';
 export { TaskService } from './services/task';
 export { TaskTranslations } from './i18n/registry';
 export { TodoCreateComponent } from './components/todo-create/todo-create';

/**************************************************************************************************/

function getRoutes(): Routes {
  return buildModuleRoutes(
    `task.${ getDomainName() }`,
    TaskRootComponent,
    [
      {
        path: 'task-create',
        component: TaskCreateComponent,
        data: {
          state: 'task-create',
          navigateBack : true
        },
      },
      {
        path: ':address',
        component: TaskDetailComponent,
        data: {
          state: 'task-detail',
          navigateBack : true,
          reload: [ 'contracts' ]
        },
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
function getConfig(isDispatcher?: boolean, addDeclarations?: boolean) {
  let config: any = {
    imports: [
      CommonModule,
      AngularCore,
    ],
    providers: [
      TaskTranslations,
      TaskService,
      TaskContractDispatcherService,
    ],
  };

  if (addDeclarations) {
    config.declarations = [
      TaskCreateComponent,
      TaskDetailComponent,
      TodoCreateComponent
    ];
  }

  config.exports = config.declarations;

  if (!isDispatcher) {
    config.declarations.push(BootstrapComponent);

    config.imports.unshift(BrowserAnimationsModule);
    config.imports.unshift(RouterModule.forRoot(getRoutes(), { enableTracing: false, }));
    config.imports.push(IonicModule.forRoot(BootstrapComponent, {
      mode: 'md'
    }));

    config.entryComponents = [ IonicApp ];
    config.bootstrap = [ IonicApp ];

    config.declarations.push(TaskRootComponent);
  }

  return config;
}

@NgModule(getConfig(true))
export class DispatcherModule {
  constructor() { }
}

@NgModule(getConfig(true, true))
export class TaskLibModule {
  constructor() { }
}

@NgModule(getConfig(false, true))
class TaskModule {
  constructor(private translations: TaskTranslations) { }
}

export async function startDApp(container, dbcpName) {
  const ionicAppEl = createIonicAppElement(container, `task.${ getDomainName() }`);

  await startAngularApplication(TaskModule, getRoutes());

  container.appendChild(ionicAppEl);
}
