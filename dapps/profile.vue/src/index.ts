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
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import { TablePlugin } from 'bootstrap-vue';
import Main from './components/root/root.vue';
import translations from './i18n/translations';
import routes from './routes';
// import components
import components from './components/registry';
import CompanyContactForm from './components/profile/company/contact/contact.vue';
import CompanyRegistrationForm from './components/profile/company/registration/registration.vue';
import updateDidDocumentDispatcher from './components/did/UpdateDidDocDispatcher';

export * from './components/registry';
export * from './dispatchers/registry';
export * from './components/utils/shareSortFilters';
export {
  translations, updateDidDocumentDispatcher, CompanyContactForm, CompanyRegistrationForm,
};

dappBrowser.System.map['@evan.network/profile.vue'] = `profile.vue.${getDomainName()}!dapp-content`;
dappBrowser.System.map['@evan.network/profile'] = `profile.vue.${getDomainName()}!dapp-content`;

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
  // load the vue evan core to get its origin and access the images
  const profileDbcp = await dappBrowser.System
    .import(`profile.vue.${getDomainName()}!ens`);
  const profileBaseUrl = dappBrowser.dapp.getDAppBaseUrl(
    profileDbcp,
    `${profileDbcp.name}.${getDomainName()}`,
  );
  Vue.use(TablePlugin);

  await initializeVue({
    components,
    container,
    dappBaseUrl,
    dappEnsOrContract,
    dbcpName,
    RootComponent: Main,
    routes,
    state: { profileBaseUrl },
    translations,
    Vue,
  });
}
