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

import { ProfileTranslations } from './i18n/registry';
import { ProfileRootComponent } from './components/root/root';
import { EvanProfileDetailComponent } from './components/profile/profile';
import { EvanProfileSettingsComponent } from './components/settings/settings';
import { EvanProfileVerificationsComponent } from './components/verifications/verifications';
import { EvanProfileContainerComponent } from './components/container/container';

import { ProfileService } from './services/service';
import { profileClaimsDispatcher } from './dispatchers/claims';

export {
  profileClaimsDispatcher,
  ProfileService,
}

/**************************************************************************************************/

function getRoutes(): Routes {
  return buildModuleRoutes(
    `profile.${ getDomainName() }`,
    ProfileRootComponent,
    [
      {
        path: '',
        component: EvanProfileContainerComponent,
        data: {
          reload: true,
          state: 'profile-root',
        }
      },
      {
        path: `addressbook.${getDomainName()}`,
        data: { state: 'addressbook', navigateBack : true },
        children: [ { path: '**', component: DAppLoaderComponent, data: { state: 'addressbook', navigateBack : true } }, ]
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
      IonicModule,
      AngularCore,
    ],
    providers: [
      ProfileService,
      ProfileTranslations,
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
      EvanProfileContainerComponent,
      EvanProfileSettingsComponent,
      EvanProfileVerificationsComponent,
      EvanProfileDetailComponent,
      ProfileRootComponent,
    ];
  }

  return config;
}

@NgModule(getConfig(true))
export class DispatcherModule {
  constructor() { }
}

@NgModule(getConfig(false))
class ProfileModule {
  constructor(private translations: ProfileTranslations) { }
}

export async function startDApp(container, dbcpName) {
  const ionicAppEl = createIonicAppElement(container, dbcpName);

  await startAngularApplication(ProfileModule, getRoutes());

  container.appendChild(ionicAppEl);
}
