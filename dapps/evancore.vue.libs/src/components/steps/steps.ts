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

import EvanComponent from '../../component';

/**
 * Shape of each step object
 */
interface Step {
  title: string;
  disabled: boolean|Function;
}

/**
 * Steps indicator component shows current step highlighted.
 */
@Component({ })
export default class StepsComponent extends mixins(EvanComponent) {
  /**
   * activeStep defines the current outlined step
   */
  @Prop({
    type: Number,
    default: 0
  }) activeStep: number;

  /**
   * The steps array, with the shape of Step interface:
   *  { title: String, disabled: boolean }
   */
  @Prop({
    type: Array,
    default: []
  }) steps: Array<Step>;

  /**
   * Use a minimal design and show only small step indicators.
   */
  @Prop() minimal: boolean;

  created() {
    if (this.steps.length === 0) {
      console.warn('no steps ');
    }
  }

  /**
   * Activate a specific step
   *
   * @param      {number}  index     steps index
   */
  gotoStep(index: number) {
    if (!this.isDisabled(index)) {
      this.activeStep = index;
      this.$emit('stepChange', index);
    }
  }

  /**
   * Gets the disabled state for a step. Only boolean value or result of disabled function check.
   *
   * @param      {number}  index   step index to check for
   */
  isDisabled(index: number) {
    const step = this.steps[index];
    return (typeof step.disabled === 'function' ? step.disabled() : step.disabled) ||
      (index !== 0 && this.isDisabled(index - 1));
  }
}
