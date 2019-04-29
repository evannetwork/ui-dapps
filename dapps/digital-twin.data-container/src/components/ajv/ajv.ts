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
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import * as fieldUtils from '../../fields';
import * as utils from '../../utils';

interface FieldFormInterface extends EvanForm {
  name: EvanFormControl;
  type: EvanFormControl;
  value: EvanFormControl;
}

@Component({ })
export default class AJVComponent extends mixins(EvanComponent) {
  /**
   * schema / edit / read
   */
  @Prop({ default: 'schema' }) mode;

  /**
   * Should the value row be displayed? (disabled for array configuration)
   */
  @Prop({ }) enableValue;

  /**
   * Object entry schema (full entry schema or list entry schema)
   */
  @Prop() properties: any;

  /**
   * Value corresponding to the ajv
   */
  @Prop() value: any;

  /**
   * Disable all fields (e.g. while saving)
   */
  @Prop() disabled: boolean;

  /**
   * formular specific variables
   */
  forms: Array<FieldFormInterface> = [ ];

  /**
   * all available field types
   */
  fieldTypes: Array<string> = [
    'string',
    'number',
    // 'files',
    // 'images',
  ];

  /**
   * Are all field forms valid?
   */
  isValid = false;

  /**
   * Do not save the properties multiple times automatically
   */
  deleted = false;

  /**
   * Setup all field properties
   */
  created() {
    this.$emit('init', this);

    // map the initial schema to formulars
    Object
      .keys(this.properties)
      .forEach((schemaKey: string) => this.addProperty(
        schemaKey,
        this.properties[schemaKey].type,
        this.value ? this.value[schemaKey] : ''
      ));
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
    Object.keys(this.properties).forEach(key => delete this.properties[key]);
    if (this.value) {
      Object.keys(this.value).forEach(key => delete this.value[key]);
    }

    // iterate through all forms and set the correct values to the properties
    this.forms.forEach((form: FieldFormInterface) => {
      this.properties[form.name.value] = { type: form.type.value };

      if (this.value) {
        this.value[form.name.value] = form.value.value;
      }
    });
  }

  /**
   * Creates a new evan form to handle a new entry as one row in the ui.
   */
  addProperty(property: string, type = 'string', value: any) {
    this.forms.push(<FieldFormInterface>new EvanForm(this, {
      name: {
        value: property,
        validate: function(vueInstance: AJVComponent, form: FieldFormInterface) {
          vueInstance.checkFormValidity();
          return this.value.trim().length !== 0;
        }
      },
      type: {
        value: type,
        validate: function(vueInstance: AJVComponent, form: FieldFormInterface) {
          vueInstance.checkFormValidity();

          // force value evaluation
          if (this.enableValue) {
            form.value.value = form.value.value;
          }

          return this.value.trim().length !== 0;
        },
      },
      value: {
        value: value,
        validate: function(vueInstance: AJVComponent, form: FieldFormInterface) {
          vueInstance.checkFormValidity();

          // only check validity when the value is enabled
          if (vueInstance.enableValue) {
            // map the value top the correct dynamic type validator
            return fieldUtils.validateField((<any>form).type.value, this, vueInstance, form);
          } else {
            return true;
          }
        }
      }
    }));

    // auto focus new form element
    this.$nextTick(() => {
      const nameInputs = this.$el.querySelectorAll('table tr td:first-child input');
      const focusInput: any = nameInputs[nameInputs.length - 2];

      focusInput && focusInput.focus();
      this.checkFormValidity();
    });
  }

  /**
   * Remove a propertyForm from the forms array.
   *
   * @param      {any}  propertyForm  property form
   */
  removeProperty(propertyForm: FieldFormInterface) {
    this.forms.splice(this.forms.indexOf(propertyForm), 1);
    this.checkFormValidity();
  }

  /**
   * Iterate through all forms and set the current form
   */
  checkFormValidity() {
    this.$nextTick(() => {
      this.isValid = this.forms.every((form: FieldFormInterface) => form.isValid);
    });
  }
}
