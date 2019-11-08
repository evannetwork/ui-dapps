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
import * as profileDApp from '@evan.network/profile.vue';
import VueRecaptcha from 'vue-recaptcha';
import { ComponentRegistrationInterface } from '@evan.network/ui-vue-core';

import AcceptContactComponent from './accept-contact/accept-contact.vue';
import LayoutWrapperComponent from './layout-wrapper/layout-wrapper.vue';
import MnemonicComponent from './mnemonic/mnemonic.vue';
import ProfileCreatingComponent from './sign-up/creating.vue';
import CaptchaTermsOfUse from './sign-up/captcha-terms.vue';

// export them all, so other applications can access them
export {
  AcceptContactComponent,
  MnemonicComponent,
  VueRecaptcha,
}

// map them to element names, so they can be used within templates
const componentRegistration: Array<ComponentRegistrationInterface> = [
  { name: 'profile-captcha-terms', component: CaptchaTermsOfUse, },
  { name: 'evan-onboarding-accept-contact', component: AcceptContactComponent },
  { name: 'evan-onboarding-layout-wrapper', component: LayoutWrapperComponent },
  { name: 'evan-onboarding-mnemonic', component: MnemonicComponent },
  { name: 'evan-profile-creating', component: ProfileCreatingComponent },
  { name: 'profile-company-contact', component: (profileDApp as any).CompanyContactForm, },
  { name: 'profile-company-registration', component: (profileDApp as any).CompanyRegistrationForm, },
  { name: 'vue-recaptcha', component: VueRecaptcha },
];

export default componentRegistration;
