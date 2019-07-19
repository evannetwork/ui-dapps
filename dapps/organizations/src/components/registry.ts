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
import { ComponentRegistrationInterface } from '@evan.network/ui-vue-core';

import IdentNotaryIssueComponent from './detail/identifications/notary/issue/issue.vue';
import IdentNotaryPinComponent from './detail/identifications/notary/pin/pin.vue';
import IdentNotaryRequestComponent from './detail/identifications/notary/request/request.vue';
import IdentNotaryVerificationComponent from './detail/identifications/notary/verification/verification.vue';
import InfoDialogComponent from './detail/info/info.vue';
import NotaryDetailComponent from './detail/identifications/notary/detail/detail.vue';
import StepsIndicator from './steps-indicator/steps-indicator.vue';

// export them all, so other applications can access them
export { }

// map them to element names, so they can be used within templates
const componentRegistration: Array<ComponentRegistrationInterface> = [
  { name: 'org-ident-notary-detail', component: NotaryDetailComponent },
  { name: 'org-ident-notary-issue', component: IdentNotaryIssueComponent },
  { name: 'org-ident-notary-pin', component: IdentNotaryPinComponent },
  { name: 'org-ident-notary-request', component: IdentNotaryRequestComponent },
  { name: 'org-ident-notary-verification', component: IdentNotaryVerificationComponent },
  { name: 'org-ident-info-dialog', component: InfoDialogComponent },
  { name: 'steps-indicator', component: StepsIndicator },
];

export default componentRegistration;
