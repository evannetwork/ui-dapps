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

import Vue from 'vue';
import { initializeVue, getDomainName } from '@evan.network/ui-vue-core';
import { System, } from '@evan.network/ui-dapp-browser';

import * as dispatchers from './dispatchers/registy';
import componentRegistration from './components/registry';
import components from './components/registry';
import Main from './components/root/root.vue';
import routes from './routes';
import translations from './i18n/translations';

export * from './components/registry';
export * from './dispatchers/registy';
export { translations, dispatchers, componentRegistration };

System.map['@evan.network/digitaltwin'] = `digitaltwin.${ getDomainName() }!dapp-content`;

/**
 * StartDapp function that is called by the ui-dapp-browser, including an container and the current
 * dbcp. So startup, it's evan time!
 *
 * @param      {any}     container    container element
 * @param      {string}  dbcpName     dbcp name of the dapp
 * @param      {any}     dappEnsOrContract  original ens / contract address that were loaded
 * @param      {string}  dappBaseUrl  origin of the dapp
 */
export async function startDApp(container: any, dbcpName: any, dappEnsOrContract: any, dappBaseUrl: any) {
  await initializeVue({
    components,
    container,
    dappBaseUrl,
    contractRouting: true,
    dappEnsOrContract,
    dbcpName,
    RootComponent: Main,
    routes,
    state: { },
    translations: translations,
    Vue: Vue,
  });
}
