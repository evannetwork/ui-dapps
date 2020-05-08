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
import { web3Helper } from '@evan.network/ui-session';

import EvanFormControl from './formControl';
import { EvanFormControlOptions } from './interfaces';

/**
 * Generalized data representation for a evan.network form. Handles full validation and error
 * handling logic. Uses the EvanFormControls to handle all controls separated and calculates them
 * into one status detail into this class.
 *
 * @class      EvanForm
 */
export default class EvanForm {
  /**
   * list of control names that were applied to the form
   */
  controls: Array<string>;

  /**
   * The vue instance of for validation etc..
   */
  vueInstance: Vue;

  /**
   * Is everything valid within the form?
   */
  isValid: boolean;

  /**
   * Checks for an valid email address.
   *
   * @param      {string}   email   email address to checkl
   * @return     {boolean}  true / false
   */
  static validateEmail(email: string): boolean {
    // eslint-disable-next-line max-len
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      .test(String(email).toLowerCase());
  }

  /**
   * Checks for an valid ethereum accoung id.
   *
   * @param      {string}   email   email address to checkl
   * @return     {boolean}  true / false
   */
  static validEthAddress(address: string): boolean {
    return web3Helper.getWeb3Instance().utils.isAddress(address);
  }

  /**
   * Create new EvanForm instance.
   *
   * @param      {any}                                    vueInstance  Parent vueInstance to
   *                                                                   directly accessing input refs
   * @param      {{ [s: string]: EvanFormControlOptions}  }            controls   object of controls
   *                                                                   that should be added directly
   */
  constructor(vueInstance: any, controls: { [s: string]: EvanFormControlOptions }) {
    this.controls = Object.keys(controls);
    this.vueInstance = vueInstance;

    /* setup form controls do not apply values initialy, set the control key first, so the validator
    can access the controls */
    this.controls.forEach((controlKey: string) => {
      this[controlKey] = new EvanFormControl(
        controlKey,
        controls[controlKey].value,
        this.vueInstance,
        undefined,
        this,
        controls[controlKey].uiSpecs,
      );
    });

    // set validate function after this, and run the validation for all fields
    this.controls.forEach((controlKey: string) => {
      this[controlKey].controlValidate = controls[controlKey].validate;
    });
    this.controls.forEach((controlKey: string) => this[controlKey].validate());
    this.validateControls();
  }

  /**
   * Iterate through all controls, checks if they are valid and sets the form `isValid` parameter.
   */
  validateControls(): void {
    this.isValid = this.controls
      .filter((controlKey: string) => this[controlKey].controlError)
      .length === 0;
  }

  /**
   * Adds a single control to the current form and runs the validateControls functions to check
   * directly the current fiorm validity
   *
   * @param      {string}                  controlKey  The control key
   * @param      {EvanFormControlOptions}  control     control options
   */
  addControl(controlKey: string, control: EvanFormControlOptions): void {
    // remober the control list for validation purposes
    this.controls.push(controlKey);

    // create the form control
    this.vueInstance.$set(this, controlKey, new EvanFormControl(
      controlKey,
      control.value,
      this.vueInstance,
      undefined,
      this,
      control.uiSpecs,
    ));

    // set the validation afterwards
    this[controlKey].controlValidate = control.validate;

    // trigger control validation
    this.validateControls();
  }

  /**
   * Remove a control from the form.
   *
   * @param      {string}  controlKey    controlKey of the control
   */
  removeControl(controlKey: string): void {
    this.controls.splice(this.controls.indexOf(controlKey), 1);
    delete this[controlKey];

    this.validateControls();
  }

  /**
   * Returns a object representation of the form values.
   */
  getFormData(): any {
    const ret = { };

    this.controls.forEach((controlKey: string) => {
      ret[controlKey] = this[controlKey].value;
    });

    return ret;
  }
}
