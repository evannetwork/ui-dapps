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
  getDomainName
} from 'dapp-browser';

import {
  NgModule,                    // @angular/core
  CommonModule,                // @angular/common
  RouterModule, Routes,        // @angular/router
  IonicModule, IonicApp,       // ionic-angular
  BrowserAnimationsModule,     // @angular/platform-browser/animations
  HttpModule                   // @angular/http
} from 'angular-libs';

import {
  AngularCore,
  DAppLoaderComponent,
  buildModuleRoutes,
  BootstrapComponent,
  startAngularApplication, createIonicAppElement
} from 'angular-core';

import { IdentityCreateComponent } from './components/identity-create/identity-create';
import { IdentityImportComponent } from './components/identity-import/identity-import';
import { MetamaskComponent } from './components/metamask/metamask';
import { MnemonicComponent } from './components/mnemonic/mnemonic';
import { OnboardedComponent } from './components/onboarded/onboarded';
import { OnboardingRootComponent } from './components/root/root';
import { OnboardingService } from './services/onboarding';
import { OnboardingTranslations } from './i18n/registry';
import { ProfileCreateComponent } from './components/profile-create/profile-create';
import { TermsOfUseComponent } from './components/terms-of-use/terms-of-use';
import { WelcomeComponent } from './components/welcome/welcome';

/**************************************************************************************************/

function getRoutes(): Routes {
  return buildModuleRoutes(
    `onboarding.${getDomainName()}`,
    OnboardingRootComponent,
    [
      {
        path: '',
        component: WelcomeComponent,
        data: {
          state: 'welcome'
        },
      },
      {
        path: 'terms-of-use/:provider',
        component: TermsOfUseComponent,
        data: {
          state: 'terms-of-use',
        },
      },
      {
        path: 'metamask',
        component: MetamaskComponent,
        data: {
          state: 'metamask',
        },
      },
      {
        path: 'identity-create',
        component: IdentityCreateComponent,
        data: {
          state: 'identity-create',
        },
      },
      {
        path: 'identity-import',
        component: IdentityImportComponent,
        data: {
          state: 'identity-import',
        },
      },
      {
        path: 'profile-create/:provider',
        component: ProfileCreateComponent,
        data: {
          state: 'profile-create'
        },
      },
      {
        path: 'onboarded',
        component: OnboardedComponent,
        data: {
          state: 'onboarded'
        },
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
      HttpModule,
    ],
    providers: [
      OnboardingTranslations,
      OnboardingService
    ],
    entryComponents: [IonicApp]
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
      OnboardingRootComponent,
      TermsOfUseComponent,
      WelcomeComponent,
      MetamaskComponent,
      IdentityImportComponent,
      IdentityCreateComponent,
      ProfileCreateComponent,
      MnemonicComponent,
      OnboardedComponent,
    ];
  }

  return config;
}

@NgModule(getConfig(true))
export class DispatcherModule {
  constructor() { }
}

@NgModule(getConfig(false))
class OnboardingModule {
  constructor(private translations: OnboardingTranslations) { }
}

export async function startDApp(container, dbcpName) {
  const ionicAppEl = createIonicAppElement(container, dbcpName);

  await startAngularApplication(OnboardingModule, getRoutes());

  container.appendChild(ionicAppEl);
}
