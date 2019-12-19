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

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { utils } from '@evan.network/digitaltwin.lib';

import * as fieldUtils from '../../../fields';


interface FieldFormInterface extends EvanForm {
  name: EvanFormControl;
  type: EvanFormControl;
  value: EvanFormControl;
}

@Component({ })
export default class AJVValuesComponent extends mixins(EvanComponent) {
  /**
   * Id for the template that is edited (e.g.: create, container address, template type, ...)
   */
  @Prop() address: string;

  /**
   * Object entry schema (full entry schema or list entry schema)
   */
  @Prop() properties: any;

  /**
   * Value corresponding to the ajv
   */
  @Prop() value: any;

  /**
   * schema / edit / read
   */
  @Prop({ default: 'schema' }) mode;

  /**
   * Disable all fields (e.g. while saving)
   */
  @Prop() disabled: boolean;

  /**
   * formular specific variables
   */
  valueForm: EvanForm = null;

  /**
   * Render form after everything was added to the EvanForm object
   */
  loading = true;

  /**
   * Do not save the properties multiple times automatically
   */
  deleted = false;

  /**
   * calculated types of the applied schema properties
   */
  types: any = { };

  /**
   * Check if the current value form is valid
   */
  isValid = false;

  /**
   * Setup all field properties
   */
  created() {
    this.$emit('init', this);

    // map the initial schema to formulars
    const controls = { };
    Object.keys(this.properties).forEach((schemaKey: string) => {
      let type = this.types[schemaKey] = fieldUtils.getType(this.properties[schemaKey]);

      controls[schemaKey] = {
        value: this.value[schemaKey] || fieldUtils.defaultValue(this.properties[schemaKey], 'field'),
        validate: function(vueInstance: AJVValuesComponent, form: FieldFormInterface) {
          // update components isValid flag so it will be reactive
          vueInstance.$nextTick(() => {
            vueInstance.isValid = vueInstance.valueForm.isValid;
          });

          // map the value top the correct dynamic type validator
          return fieldUtils.validateField(
            type,
            this,
            vueInstance.properties[schemaKey],
            vueInstance.address,
            (<any>vueInstance).$i18n,
          );
        }
      };
    });

    // setup formular
    this.valueForm = new EvanForm(this, controls);
    this.loading = false;
  }

  /**
   * Map the current ajv formular to the data schema
   */
  beforeDestroy() {
    !this.deleted && this.save();
    this.deleted = true;
  }

  /**
   * Takes the current form values and write them back into the properties object.
   */
  save() {
    // clear the objects to keep the original object reference
    Object.keys(this.value).forEach(key => delete this.value[key]);

    // iterate through all forms and set the correct values to the properties
    this.valueForm.controls.forEach((controlName: string) => {
      const control = this.valueForm[controlName];

      this.value[controlName] = fieldUtils.parseFieldValue(this.types[controlName], control.value);
    });
  }
}
