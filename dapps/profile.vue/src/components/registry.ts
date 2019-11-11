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
import { ComponentRegistrationInterface } from '@evan.network/ui-vue-core';

// profile components
import CompanyContactForm from './profile/company/contact/contact.vue';
import CompanyRegistrationForm from './profile/company/registration/registration.vue';
import DeviceDetailForm from './profile/device/detail/detail.vue';
import PermissionWrapperComponent from './permission-wrapper/permission-wrapper.vue';

// import general components for the profile
import LabeledList from './utils/labeled-list/labeled-list.vue';

// verification specific components
import NotaryVerificationComponent from './verifications/notary/notary.vue';
import VerificationsOverviewComponent from './verifications/overview/overview.vue';

// verification components
// single notary verification detail (takes a request or company verifications)
import NotaryCardComponent from './verifications/notary/card/card.vue';

// info content of the notary verification
import NotaryInfoContentComponent from './verifications/notary/info/info-content/info-content.vue';
import NotaryInfoModalComponent from './verifications/notary/info/info-modal/info-modal.vue';

// import notary specific actions
import NotaryIssueComponent from './verifications/notary/actions/issue/issue.vue';
import NotaryPinComponent from './verifications/notary/actions/pin/pin.vue';
import NotaryRequestComponent from './verifications/notary/actions/request/request.vue';

// topic display (the actual verification)
import NotaryTopicDisplayComponent from './verifications/notary/topic-display/topic-display.vue';

// map them to element names, so they can be used within templates
const componentRegistration: Array<ComponentRegistrationInterface> = [
  // profile
  { name: 'profile-company-contact', component: CompanyContactForm, },
  { name: 'profile-company-registration', component: CompanyRegistrationForm, },
  { name: 'profile-device-detail', component: DeviceDetailForm, },
  { name: 'profile-permission-wrapper', component: PermissionWrapperComponent, },
  // general
  { name: 'labeled-list', component: LabeledList },
  // verification specific components
  { name: 'notary-verification', component: NotaryVerificationComponent, },
  { name: 'profile-verifications', component: VerificationsOverviewComponent },
  // notary verification components
  { name: 'notary-action-issue', component: NotaryIssueComponent, },
  { name: 'notary-action-pin', component: NotaryPinComponent, },
  { name: 'notary-action-request', component: NotaryRequestComponent, },
  { name: 'notary-info-content', component: NotaryInfoContentComponent, },
  { name: 'notary-info-dialog', component: NotaryInfoModalComponent, },
  { name: 'notary-topic-display', component: NotaryTopicDisplayComponent, },
  { name: 'notary-verification-card', component: NotaryCardComponent, },
];

export default componentRegistration;
