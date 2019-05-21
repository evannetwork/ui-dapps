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
import * as dataContainerAPI from '@evan.network/datacontainer.digitaltwin';

import DetailComponent from './detail/detail.vue';
import EnsActionsComponent from './ens/actions/actions.vue';
import EnsFieldComponent from './ens/field/field.vue';
import EnsMapComponent from './ens/map/map.vue';
import EnsOpenComponent from './ens/open/open.vue';

// export them all, so other applications can access them
export { EnsActionsComponent, EnsFieldComponent, EnsOpenComponent, }

// map them to element names, so they can be used within templates
const componentRegistration: Array<ComponentRegistrationInterface> = [
  { name: 'dt-ens-actions', component: EnsActionsComponent },
  { name: 'dt-ens-field',   component: EnsFieldComponent },
  { name: 'dt-detail',      component: DetailComponent },
  { name: 'dt-ens-map',     component: EnsMapComponent },
].concat(dataContainerAPI.components);

export default componentRegistration;
