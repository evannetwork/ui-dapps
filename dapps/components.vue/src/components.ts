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

import ButtonsComponent from './components/buttons/buttons.vue';
import CardsComponent from './components/cards/cards.vue';
import DispatcherTestComponent from './components/dispatcher-test/dispatcher-test.vue';
import FormsComponent from './components/forms/forms.vue';
import ProfileComponent from './components/profile/profile.vue';
import StepsComponent from './components/steps/steps.vue';
import LayoutComponent from './components/layout/layout.vue';
import TextComponent from './components/text/text.vue';

// map them to element names, so they can be used within templates
const components: Array<any> = [
  { path: 'buttons', icon: 'mdi mdi-equal', component: ButtonsComponent },
  { path: 'cards', icon: 'mdi mdi-card-text-outline', component: CardsComponent },
  { path: 'forms', icon: 'mdi mdi-format-list-numbered', component: FormsComponent },
  { path: 'profile', icon: 'mdi mdi-account-box', component: ProfileComponent },
  { path: 'steps', icon: 'mdi mdi-ray-start-arrow', component: StepsComponent },
  { path: 'text', icon: 'mdi mdi-format-color-text', component: TextComponent },
  { path: 'layout', icon: 'mdi mdi-palette-advanced', component: LayoutComponent },
];

// add dispatcher test entry
if (window.localStorage['evan-test-mode']) {
  components.push({ path: 'dispatcher-test', icon: 'mdi mdi-sync', component: DispatcherTestComponent });
}

components.forEach((comp) => comp.name = comp.path);

export default components;
