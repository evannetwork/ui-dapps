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
import { System, getDomainName } from '@evan.network/ui-dapp-browser';

import translations from './i18n/translations';
import routes from './routes';
import components from './components/registry';
import AssetsComponent from './components/Assets.vue';
import inviteDispatcher from './components/contacts/InviteDispatcher';
import removeContactDispatcher from './components/contacts/RemoveContactDispatcher';
import updateContactDispatcher from './components/contacts/UpdateContactDispatcher';

export { inviteDispatcher, removeContactDispatcher, updateContactDispatcher };
export * from './components/registry';
export { translations };

System.map['@evan.network/assets'] = `assets.${getDomainName()}!dapp-content`;

/**
 * StartDapp function that is called by the ui-dapp-browser, including an container and the current
 * dbcp. So startup, it's evan time!
 *
 * @param      {any}     container    container element
 * @param      {string}  dbcpName     dbcp name of the dapp
 * @param      {any}     dappEnsOrContract  original ens / contract address that were loaded
 * @param      {string}  dappBaseUrl  origin of the dapp
 */
export async function startDApp(
  container: Element,
  dbcpName: string,
  dappEnsOrContract: string,
  dappBaseUrl: string,
): Promise<void> {
  await initializeVue({
    components,
    container,
    dappBaseUrl,
    dappEnsOrContract,
    dbcpName,
    RootComponent: AssetsComponent,
    routes,
    state: {},
    translations,
    Vue,
  });
}
