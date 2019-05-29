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

import Vue from 'vue';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { initializeVue, getDomainName } from '@evan.network/ui-vue-core';

import components from './components/registry';
import Main from './components/root/root.vue';
import routes from './routes';
import translations from './i18n/tranlations';

/**
 * StartDapp function that is called by the ui-dapp-browser, including an container and the current
 * dbcp. So startup, it's evan time!
 *
 * @param      {any}     container          container element
 * @param      {string}  dbcpName           dbcp name of the dapp
 * @param      {any}     dappEnsOrContract  original ens / contract address that were loaded
 * @param      {string}  dappBaseUrl        origin of the dapp
 */
export async function startDApp(container: any, dbcpName: any, dappEnsOrContract: any, dappBaseUrl: any) {
  // load the onboarding dbcp, so we can access assets using url
  const onboardingDbcp = await dappBrowser.System
    .import(`onboarding.vue.${ getDomainName() }!ens`);
  const onboardingBaseUrl = dappBrowser.dapp.getDAppBaseUrl(onboardingDbcp,
    `${ onboardingDbcp.name }.${ getDomainName() }`);

  await initializeVue({
    components,
    container,
    dappBaseUrl,
    dappEnsOrContract,
    dbcpName,
    RootComponent: Main,
    routes,
    state: { onboardingBaseUrl },
    translations: translations,
    Vue: Vue,
  });
}
