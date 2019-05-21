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
import { RouteRegistrationInterface, UnderDevelopmentComponent } from '@evan.network/ui-vue-core';
import { DAppLoaderComponent } from '@evan.network/ui-vue-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import ContainerLinkComponent from './components/container-link/container-link.vue';
import ContainersComponent from './components/containers/containers.vue';
import DigitaTwinCreateComponent from './components/create/create.vue';
import DigitalTwinDetailComponent from './components/detail/detail.vue';
import DigitalTwinVerificationsComponent from './components/verifications/verifications.vue';
import LookupComponent from './components/lookup/lookup.vue';
import MapComponent from './components/ens/map/map.vue';
import OverviewComponent from './components/overview/overview.vue';
import PluginsComponent from './components/plugins/plugins.vue';
import StartComponent from './components/start/start.vue';

const dtPath = (path) => `:digitalTwinAddress/${ path }`;

// map them to element names, so they can be used within plugins
/* tslint:disable */
const routeRegistration: Array<RouteRegistrationInterface> = [
  /********************************* disable routes ***********************************************/
  {
    path: '',
    // root route is not used, so navigate the user back
    beforeEnter: (to, from, next) => window.location.hash = from.fullPath
  },

  /************************************* twin details *********************************************/
  {
    name: 'dt-container-link',
    component: ContainerLinkComponent,
    path: 'containerlink/:containerAddress?'
  },
  {
    name: 'dt-create',
    component: DigitaTwinCreateComponent,
    path: `dt-create`,
  },

  /**************************************** details ***********************************************/
  {
    redirect: { path: dtPath('dt-detail') },
    path: `:digitalTwinAddress`,
  },
  {
    name: 'dt-detail',
    component: DigitalTwinDetailComponent,
    path: dtPath('dt-detail'),
    children: [
      { redirect: { path: 'dt-plugins' }, path: '', },
      { name: 'dt-plugins',   component: ContainersComponent, path: 'dt-plugins', },
      { name: 'dt-technical', component: UnderDevelopmentComponent, path: 'dt-technical', },
      { name: 'dt-changes',   component: UnderDevelopmentComponent, path: 'dt-changes', },
    ],
  },

  /**************************************** stuff ***********************************************/
  { name: 'dt-map',               component: MapComponent,                      path: dtPath('map'), },
  { name: 'dt-verifications',     component: DigitalTwinVerificationsComponent, path: dtPath('verifications'), },
  { name: 'dt-container-link2',   component: ContainerLinkComponent,            path: dtPath('containerlink/:containerAddress?') },
  { name: 'dt-container',         component: DAppLoaderComponent,               path: dtPath(`datacontainer.digitaltwin.${ dappBrowser.getDomainName() }/**`), },
];
/* tslint:enable */

export default routeRegistration;

