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

// vue imports
import Component, { mixins } from 'vue-class-component'
import EvanComponent from '../../component'
import Vue from 'vue'
import { Prop, Watch } from 'vue-property-decorator'

interface Option {
  label: string,
  value: any
}

/**
 * Wrapper component for button elements.
 *
 * @class         FormDataSelect
 * @selector      evan-form-data-select
 */
@Component({})
class FormDataSelect extends mixins(EvanComponent) {
  /**
   * The value for the select element.
   */
  @Prop({
    type: String
  }) value: string;

  /**
   * The label for the select element.
   */
  @Prop({
    type: String
  }) label: string;

  /**
   * The id for the select element.
   */
  @Prop({
    type: String,
    required: true
  }) id: string;

  /**
   * The selectable options. Can be an array of label-value pairs or an array of strings.
   */
  @Prop({
    type: Object
  }) options: Option[] | string[];

  /**
   * Mark the input invalid
   */
  @Prop({
    type: String,
  }) error: string;
}

export default FormDataSelect
