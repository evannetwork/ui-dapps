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

import EvanControlComponent from '../control/control';

/**
 * Base component for editing json in a textarea element.
 *
 * @class         FormControlJSONComponent
 * @selector      evan-form-control-json
 */
@Component({})
export default class FormControlJSONComponent extends mixins(EvanControlComponent) {
  /**
   * Input type attribute
   */
  @Prop({
    default: 5,
  }) rows: number;

  @Prop({ default: false }) prohibited: boolean;

  /**
   * Current string formatted value of this control.
   */
  stringValue = '';

  /**
   * Is the current input wrong formatted?
   */
  isInvalidJSON = false;

  created(): void {
    this.stringValue = this.value ? JSON.stringify(this.value, null, 2) : '{}';
  }

  /**
   * Check for correct defined JSON and update parent value, if the json format is correct.
   */
  onValueChanged(value: string): void {
    try {
      this.stringValue = value;
      this.$emit('input', JSON.parse(value));
      this.isInvalidJSON = false;
    } catch (ex) {
      this.isInvalidJSON = true;
    }
  }

  onBlur(): void {
    if (!this.isInvalidJSON) {
      this.stringValue = this.value ? JSON.stringify(this.value, null, 2) : '{}';
    }

    this.$emit('blur');
  }
}
