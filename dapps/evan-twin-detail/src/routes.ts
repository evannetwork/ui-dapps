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
import EvanTwinDetailComponent from './components/EvanTwinDetail.vue';
import { RouteConfig } from 'vue-router';
import EvanTwinDetailOverviewComponent from './components/EvanTwinDetailOverview.vue';

// map them to element names, so they can be used within templates
const routeRegistration: Array<RouteConfig> = [
  {
    path: ':address',
    component: EvanTwinDetailComponent,
    children: [
      {
        path: '',
        redirect: 'overview'
      },
      {
        name: 'overview',
        path: 'overview',
        component: EvanTwinDetailOverviewComponent
      },
      {
        name: 'data',
        path: 'data',
        component: EvanTwinDetailOverviewComponent
      },
      {
        name: 'verifications',
        path: 'verifications',
        component: EvanTwinDetailOverviewComponent
      },
      {
        name: 'sharings',
        path: 'sharings',
        component: EvanTwinDetailOverviewComponent
      },
      {
        name: 'did',
        path: 'did',
        component: EvanTwinDetailOverviewComponent
      }
    ]
  }
  // {
  //   name: 'overview',
  //   path: 'overview',
  //   component: EvanTwinDetailOverviewComponent,
  // },
  // {
  //   path: ':id',
  //   component: EvanTwinDetailOverviewComponent,
  // }
];

export default routeRegistration;

// const routeRegistration: Array<RouteConfig> = [
//   {
//     path: '',
//     component: AssetsComponent,
//     children: [
//       { path: '', redirect: 'digitaltwins' },
//       {
//         name: 'digitaltwins',
//         path: 'digitaltwins',
//         component: DataContainer,
//         children: [
//           {
//             path: '',
//             component: DigitalTwinsComponent,
//             meta: { type: 'twins' }
//           },
//           {
//             path: 'search/:query',
//             props: true,
//             component: DigitalTwinsComponent,
//             meta: { type: 'twins' }
//           },
//         ]
//       },
//       {
//         path: 'digitaltwins/:id',
//         component: DigitalTwinDetailComponent,
//       },
//       { name: 'contacts', path: 'contacts', component: ContactsComponent }
//     ]
//   }
// ];
