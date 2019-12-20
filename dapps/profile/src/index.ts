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

import { ProfileTranslations } from './i18n/registry';
import { ProfileRootComponent } from './components/root/root';
import { EvanProfileDetailComponent } from './components/profile/profile';
import { EvanProfileSettingsComponent } from './components/settings/settings';
import { EvanProfileVerificationsComponent } from './components/verifications/verifications';
import { EvanProfileContainerComponent } from './components/container/container';
import { EvanProfilePaymentsComponent } from './components/payments/payments';
import { EvanBuyEveComponent } from './components/buy-eve/buy-eve';

import { paymentDispatcher } from './dispatchers/payment';
import { ProfileService } from './services/service';
import { profileVerificationsDispatcher } from './dispatchers/verifications';
import { sendEveDispatcher } from './dispatchers/sendEve';

import { NgxStripeModule } from 'ngx-stripe';

export {
  paymentDispatcher,
  ProfileService,
  profileVerificationsDispatcher,
  sendEveDispatcher,
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
        },
        children: [
          {
            path: '',
            redirectTo: `detail`,
            pathMatch: 'full'
          },
          {
            path: 'detail',
            component: EvanProfileDetailComponent,
            data: { reload: true, state: 'detail', }
          },
          {
            path: 'verifications',
            component: EvanProfileVerificationsComponent,
            data: { reload: true, state: 'verifications', }
          },
          {
            path: 'settings',
            component: EvanProfileSettingsComponent,
            data: { reload: true, state: 'settings', }
          },
          {
            path: 'payments',
            component: EvanProfilePaymentsComponent,
            data: { reload: true, state: 'payments', }
          },
          {
            path: 'buy-eve',
            component: EvanBuyEveComponent,
            data: { reload: true, state: 'buy-eve', }
          }
        ]
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
      NgxStripeModule.forRoot('pk_test_kpO3T5fXA7aaftg9D0OO0w3S'),
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
      EvanProfilePaymentsComponent,
      EvanBuyEveComponent,
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
