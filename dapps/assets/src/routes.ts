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
import { RouteConfig } from 'vue-router';
import { getDomainName } from '@evan.network/ui-dapp-browser';
import { DAppLoaderComponent } from '@evan.network/ui-vue-core';
import DataContainer from './components/DataContainer.vue';
import DigitalTwinsComponent from './components/digitaltwins/DigitalTwins.vue';
import ContactsComponent from './components/contacts/Contacts.vue';

// map them to element names, so they can be used within templates
const routeRegistration: Array<RouteConfig> = [
  { path: '', redirect: { name: 'digitaltwins' } },
  {
    path: 'digitaltwins',
    component: DataContainer,
    children: [
      {
        path: '',
        name: 'digitaltwins',
        component: DigitalTwinsComponent,
        meta: { type: 'twins' },
      },
      {
        path: 'search/:query',
        name: 'digitaltwins-search',
        props: true,
        component: DigitalTwinsComponent,
        meta: { type: 'twins' },
      },
    ],
  },
  {
    path: `detail.digital-twin.${getDomainName()}/:id`,
    component: DAppLoaderComponent,
  },
  { name: 'contacts', path: 'contacts', component: ContactsComponent },
];

export default routeRegistration;
