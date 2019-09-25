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
// import evan libs
import {
  DAppLoaderComponent,
  RouteRegistrationInterface,
  UnderDevelopmentComponent,
} from '@evan.network/ui-vue-core';

import * as dappBrowser from '@evan.network/ui-dapp-browser';

import ProfileDetailComponent from './components/profile/profile.vue';
import ProfileSettingsComponent from './components/settings/settings.vue';
import VerificationsComponent from './components/verifications/overview/overview.vue';

// map them to element names, so they can be used within templates
const routeRegistration: Array<RouteRegistrationInterface> = [
  { path: '', redirect: { path: 'detail' } },
  { name: 'detail', path: 'detail/:address?', component: ProfileDetailComponent },
  { name: 'settings', path: 'settings', component: ProfileSettingsComponent },
  { name: 'wallet', path: 'wallet/:address?', component: UnderDevelopmentComponent },
  { name: 'verifications', path: 'verifications/:address?', component: VerificationsComponent, },
  {
    name: 'addressbook.vue',
    component: DAppLoaderComponent,
    path: `addressbook.vue.${ dappBrowser.getDomainName() }/**`,
  },
];

export default routeRegistration;
