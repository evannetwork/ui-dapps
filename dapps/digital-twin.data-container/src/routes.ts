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

import ContainerPermissionsComponent from './components/container/permissions/permissions.vue';
import ContainerPluginSwitchComponent from './components/container/container-plugin-switch/container-plugin-switch.vue';
import CreateComponent from './components/create/create.vue';
import DataSetComponent from './components/set/set/set.vue';
import DataSetsComponent from './components/set/sets/sets.vue';
import DcListEntriesComponent from './components/set/list-entries/list-entries.vue';
import NewDataSetComponent from './components/set/new-set/new-set.vue';
import SetSchemaComponent from './components/set/schema/schema.vue';


// map them to element names, so they can be used within templates
const routeRegistration: Array<RouteRegistrationInterface> = [
  {
    path: '',
    // root route is not used, so navigate the user back
    beforeEnter: (to, from, next) => window.location.hash = from.fullPath
  },
  {
    path: ':containerAddress',
    component: ContainerPluginSwitchComponent,
    children: [
      { redirect: { path: 'dc-sets' }, path: '', },
      { name: 'dc-changes',         component: UnderDevelopmentComponent,     path: 'dc-changes', },
      { name: 'dc-permissions',     component: ContainerPermissionsComponent, path: 'dc-permissions', },
      { name: 'plugin-permissions', component: UnderDevelopmentComponent,     path: 'plugin-permissions', },
      { name: 'dc-sets',            component: DataSetsComponent,             path: 'dc-sets', },
      { name: 'dc-sets-add',        component: NewDataSetComponent,           path: 'dc-sets-add', },
      { name: 'dc-technical',       component: UnderDevelopmentComponent,     path: 'dc-technical', },
    ]
  },
  {
    name: 'entry-base',
    path: ':containerAddress/data-set/:entryName',
    component: DataSetComponent,
    children: [
      { name: 'entry-changes',     component: UnderDevelopmentComponent,     path: 'entry-changes', },
      { name: 'entry-permissions', component: ContainerPermissionsComponent, path: 'entry-permissions', },
      { name: 'entry-schema',      component: SetSchemaComponent,            path: 'entry-schema', },
      { name: 'entry-values',      component: SetSchemaComponent,            path: 'entry-values', },
      { name: 'list-entries',      component: DcListEntriesComponent,        path: 'list-entries', },
    ]
  },
];

export default routeRegistration;

