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
import { initializeVue } from '@evan.network/ui-vue-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import Main from './components/root/root.vue';
import translations from './i18n/translations';
import routes from './routes';
import components from './components/registry';


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
  // load the vue evan core to get its origin and access the images
  const domainName = dappBrowser.getDomainName();
  const uiCoreDbcp = await dappBrowser.System.import(`ui.libs.${ domainName }!ens`);
  const uiBaseUrl = dappBrowser.dapp.getDAppBaseUrl(uiCoreDbcp,
    `${ uiCoreDbcp.name }.${ domainName }`);

  await initializeVue({
    components,
    container,
    dappBaseUrl,
    dappEnsOrContract,
    dbcpName,
    RootComponent: Main,
    routes,
    state: { uiBaseUrl },
    translations: translations,
    Vue: Vue,
  });
}
