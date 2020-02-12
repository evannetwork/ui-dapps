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

import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { EvanComponent } from '@evan.network/ui-vue-core';

/**
 * Shape of each step object
 */
interface Entry {
  label: string;
  value: string;
}

/**
 * Labeled list component shows a definition list with types and data fields.
 */
@Component({ })
export default class LabeledList extends mixins(EvanComponent) {
  /**
   * The steps array, with the shape of Step interface:
   *  { title: String, disabled: boolean }
   */
  @Prop({
    type: Array,
    default: [],
  }) entries: Entry[]

  @Prop({
    type: String,
    default: '--',
  }) emptyValue: string

  @Prop({
    type: Boolean,
    default: false,
  }) hideEmpty: boolean

  @Prop({
    type: Boolean,
    default: false,
  }) hideLabel: boolean


  created() {
    if (this.entries.length === 0) {
      console.warn('no entries defined for <labeled-list> ');
    }
  }
}
