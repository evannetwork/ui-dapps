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

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';

@Component
export default class DigitalTwinsComponent extends mixins(EvanComponent) {
  twins = [
    { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
    { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
    {
      age: 89,
      first_name: 'Geneva',
      last_name: 'Wilson',
      _rowVariant: 'danger'
    },
    {
      age: 40,
      first_name: 'Thor',
      last_name: 'MacDonald',
      _cellVariants: { age: 'info', first_name: 'warning' }
    },
    { age: 29, first_name: 'Dick', last_name: 'Dunlap' }
  ]
}
