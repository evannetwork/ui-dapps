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
import { EvanFormControlUISpecs } from './interfaces';
import EvanForm from './form';

/**
 * Represents one form input and handles dirty and error flags, also runs validations.
 *
 * @class      EvanFormControl
 */
export default class EvanFormControl {
  /**
   * Is the current element dirty? Error will be only returned, if an error is available.
   */
  dirty = false;

  /**
   * Internal error without custom getter
   */
  controlError: boolean|string = false;

  /**
   * overwrite the error getter, so we only return an error, when the element is dirty
   */
  set error(value) {
    this.controlError = value;
  }

  get error(): boolean|string {
    return this.dirty ? this.controlError : false;
  }

  /**
   * Form control name.
   */
  name: string;

  /**
   * form control reference
   */
  get $ref(): any {
    return this.vueInstance.$refs[this.name];
  }

  /**
   * Original value, without custom setter amd getter
   */
  controlValue: any;

  /**
   * overwrite the value getter, so we automatically check for errors, when an validate was
   * applied.
   */
  set value(value) {
    this.controlValue = value;

    this.validate();
  }

  get value(): any {
    return this.controlValue;
  }

  /**
   * validate function that will be runned when the value was changed
   */
  controlValidate: Function|undefined;

  /**
   * Original vue instance to directly access component references within the control
   */
  vueInstance: Vue;

  /**
   * Parent evan form, so the form is valid flag can be set automatically
   */
  form: EvanForm | undefined;

  /**
   * True, when an asynchronious validate function was applied and this validation is running
   */
  validating: boolean;

  /**
   * Optional specifications that describes the control rendering.
   */
  uiSpecs: EvanFormControlUISpecs;

  /**
   * Create the new forms instance.
   */
  constructor(
    name: string,
    value: any,
    vueInstance: Vue,
    validate?: Function,
    form?: EvanForm,
    uiSpecs?: EvanFormControlUISpecs,
  ) {
    this.controlValidate = validate;
    this.form = form;
    this.name = name;
    this.uiSpecs = uiSpecs;
    this.value = value;
    this.vueInstance = vueInstance;
  }

  /**
   * Sets the control into dirty mode.
   */
  setDirty(): void {
    this.dirty = true;
  }

  /**
   * Runs the validate function for this control
   */
  async validate(): Promise<void> {
    if (this.controlValidate) {
      let valid = this.controlValidate(this.vueInstance, this.form, this);

      // if the controlValidate was a promise, resolve it asynchroniously
      if (valid && valid.then) {
        this.validating = true;
        valid = await valid;
        this.validating = false;
      }

      /* validate function will return true if valid, else it can return an error or an
       * false boolean, so we must to invert the value for the error */
      if (valid === true) {
        this.error = false;
      } else if (valid) {
        this.error = valid;
      } else {
        this.error = true;
      }

      /**
       * even better readable and just funny:
       *   let truue = this.controlValidate(this.vueInstance, this.form, this);
       *   let truee = false;
       *   this.error = truue === true ? truee : (truue ? truue : true)
       */

      // set parent form validity
      if (this.form) {
        this.form.validateControls();
      }
    }
  }
}
