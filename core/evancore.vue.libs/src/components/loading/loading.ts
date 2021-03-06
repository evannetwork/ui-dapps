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

// vue imports
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import EvanComponent from '../../component';

/**
 * Shows a full screen loading symbol.
 *
 * @class         DAppLoadingComponent
 * @selector      evan-loading
 */
@Component({ })
export default class DAppLoadingComponent extends mixins(EvanComponent) {
  @Prop({
    default: 'w-100 text-center pt-5 pb-5',
  }) classes: string;
}
