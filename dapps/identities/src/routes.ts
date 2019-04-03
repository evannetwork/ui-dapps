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
import { RouteRegistrationInterface } from '@evan.network/ui-vue-core';
import { DAppLoader } from '@evan.network/ui-vue-core';

import IdentityGeneralComponent from './components/general/general.vue';
import IdentityVerificationsComponent from './components/verifications/verifications.vue';
import IdentitiesComponent from './components/identities/identities.vue';
import OverviewComponent from './components/overview/overview.vue';
import TemplatesComponent from './components/templates/templates.vue';
import LookupComponent from './components/lookup/lookup.vue';

// map them to element names, so they can be used within templates
const routeRegistration: Array<RouteRegistrationInterface> = [
  { name: 'base-overview', path: '', component: OverviewComponent },
  { name: 'base-identities', path: 'identities', component: IdentitiesComponent },
  { name: 'base-templates', path: 'templates', component: TemplatesComponent },
  { name: 'base-lookup', path: 'lookup', component: LookupComponent },
  { name: 'identity', path: ':identityAddress', component: IdentityGeneralComponent },
  { name: 'identity-verifications', path: ':identityAddress/verifications', component: IdentityVerificationsComponent },
  // { path: ':identityAddress/:containerAddress', component: DAppLoader },
];

export default routeRegistration;

