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
// import evan libs
import {
  DAppLoaderComponent,
  RouteRegistrationInterface,
} from '@evan.network/ui-vue-core';
import { session } from '@evan.network/ui-session';

import * as dappBrowser from '@evan.network/ui-dapp-browser';

import AccountRootComponent from './components/root/accountRoot.vue';
import ProfileDetailComponent from './components/profile/profile.vue';
import ProfileSettingsComponent from './components/settings/settings.vue';
import VerificationsComponent from './components/verifications/overview/overview.vue';
import ProfileSharingsComponent from './components/sharings/sharings.vue';
import ProfileWalletComponent from './components/wallet/wallet.vue';
import DIDComponent from './components/did/DID.vue';

/**
 * Routes the user to the default user detail page.
 *
 * @return     {string}  redirect path to that the user should be navigated to.
 */
const redirectToDefault = (to, childPath = 'detail'): string => [
  to.path.split(`/profile.vue.${dappBrowser.getDomainName()}`)[0],
  `profile.vue.${dappBrowser.getDomainName()}`,
  session.activeIdentity,
  childPath,
].join('/');

// map them to element names, so they can be used within templates
const routeRegistration: Array<RouteRegistrationInterface> = [
  { path: '', redirect: (to): string => redirectToDefault(to) },
  { path: 'verify', redirect: (to): string => redirectToDefault(to, 'verifications') },
  {
    // just used for nested routing
    component: AccountRootComponent,
    name: 'address',
    path: ':address(0x\\w{40})',
    children: [
      { path: '', redirect: { path: './detail' } },
      { name: 'detail', path: 'detail', component: ProfileDetailComponent },
      { name: 'settings', path: 'settings', component: ProfileSettingsComponent },
      { name: 'sharings', path: 'sharings', component: ProfileSharingsComponent },
      { name: 'wallet', path: 'wallet', component: ProfileWalletComponent },
      { name: 'verifications', path: 'verifications', component: VerificationsComponent },
      { name: 'did', path: 'did', component: DIDComponent },
      { name: 'addressbook.vue', component: DAppLoaderComponent, path: `addressbook.vue.${dappBrowser.getDomainName()}` },
    ],
  },
  // { path: '*', redirect: to => redirectToDefault(to), },
];

export default routeRegistration;
