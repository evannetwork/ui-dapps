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
import { RouteRegistrationInterface, IframeComponent, } from '@evan.network/ui-vue-core';

import ExplanationComponent from './components/explanation/explanation.vue';
import FaqComponent from './components/faq/faq.vue';
import DocumentationComponent from './components/documentation/documentation.vue';

// map them to element names, so they can be used within templates
const routeRegistration: Array<RouteRegistrationInterface> = [
  {
    path: '',
    component: DocumentationComponent,
    children: [
      {
        path: '',
        redirect: { path: 'github' }
      },
      {
        path: 'github',
        component: IframeComponent,
        props: { src: 'https://evannetwork.github.io' }
      },
      {
        path: `bccdocs`,
        component: IframeComponent,
        props: { src: '//api-blockchain-core.readthedocs.io/en/latest/' }
      },
      {
        path: `uidocs`,
        component: IframeComponent,
        props: { src: '//ui-docs.readthedocs.io/en/latest/' }
      },
    ]
  },
];

export default routeRegistration;

