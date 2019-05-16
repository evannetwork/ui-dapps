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

import VueRecaptcha from 'vue-recaptcha';
import MnemonicComponent from './mnemonic/mnemonic.vue';
import AcceptContactComponent from './accept-contact/accept-contact.vue';

// import evan libs
import { ComponentRegistrationInterface } from '@evan.network/ui-vue-core';

// export them all, so other applications can access them
export {
  AcceptContactComponent,
  MnemonicComponent,
  VueRecaptcha,
}

// map them to element names, so they can be used within templates
const componentRegistration: Array<ComponentRegistrationInterface> = [
  { name: 'evan-onboarding-accept-contact', component: AcceptContactComponent },
  { name: 'evan-onboarding-mnemonic', component: MnemonicComponent },
  { name: 'vue-recaptcha', component: VueRecaptcha },
];

export default componentRegistration;
