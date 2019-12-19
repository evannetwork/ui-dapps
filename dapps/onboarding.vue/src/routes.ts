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
import { RouteRegistrationInterface } from '@evan.network/ui-vue-core';

import SignedInComponent from './components/signed-in/signed-in.vue';
import SignInComponent from './components/sign-in/sign-in.vue';
import SignUpComponent from './components/sign-up/sign-up.vue';
import TwinSignUp from './components/twin-sign-up/twin-sign-up.vue';

// map them to element names, so they can be used within templates
const routeRegistration: Array<RouteRegistrationInterface> = [
  { path: '', name: 'sign-up', redirect: { path: 'sign-up' } },
  { path: 'sign-in', name: 'sign-in', component: SignInComponent },
  { path: 'sign-up', name: 'sign-up', component: SignUpComponent },
  { path: 'signed-in', name: 'signed-in', component: SignedInComponent },
  { path: 'twin-sign-up', name: 'twin-sign-up', component: TwinSignUp },
];

export default routeRegistration;
