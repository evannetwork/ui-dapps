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
import EvanTwinDetailComponent from './components/DigitalTwinDetail.vue';
import { RouteConfig } from 'vue-router';
import { UnderDevelopmentComponent } from 'core/evancore.vue.libs';
import EvanTwinDetailDataComponent from './components/data/DetailData.vue';
import EvanTwinDetailDataGeneralComponent from './components/data/DetailDataGeneral.vue';

// map them to element names, so they can be used within templates
const routeRegistration: Array<RouteConfig> = [
  {
    path: ':address',
    component: EvanTwinDetailComponent,
    children: [
      {
        path: '',
        redirect: 'data'
      },
      {
        name: 'overview',
        path: 'overview',
        component: UnderDevelopmentComponent
      },
      {
        name: 'data',
        path: 'data',
        component: EvanTwinDetailDataComponent,
        children: [
          {
            path: '',
            redirect: 'general'
          },
          {
            name: 'general',
            path: 'general',
            component: EvanTwinDetailDataGeneralComponent
          },
          {
            name: 'specifications',
            path: 'specifications',
            component: UnderDevelopmentComponent
          },
          {
            name: 'logs',
            path: 'logs',
            component: UnderDevelopmentComponent
          },
        ]
      },
      {
        name: 'verifications',
        path: 'verifications',
        component: UnderDevelopmentComponent
      },
      {
        name: 'sharings',
        path: 'sharings',
        component: UnderDevelopmentComponent
      },
      {
        name: 'did',
        path: 'did',
        component: UnderDevelopmentComponent
      }
    ]
  }
];

export default routeRegistration;
