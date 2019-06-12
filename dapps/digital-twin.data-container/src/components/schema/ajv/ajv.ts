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
  min: EvanFormControl;
  max: EvanFormControl;
}

@Component({ })
export default class AJVComponent extends mixins(EvanComponent) {
  /**
   * Id for the template that is edited (e.g.: create, container address, template type, ...)
   */
  @Prop() address: string;

  /**
   * schema / edit / read
   */
  @Prop({ default: 'schema' }) mode;

  /**
   * Disable value inputs (e.g.: for list schema definition)
   */
  @Prop() disableValue;

  /**
   * Object entry schema (full entry schema or list entry schema)
   */
  @Prop() properties: any;

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
    'files',
    'boolean',
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
        this.properties[schemaKey],
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

    // iterate through all forms and set the correct values to the properties
    this.forms.forEach((form: FieldFormInterface) => {
      const name = form.name.value;
      const type = form.type.value;

      // !IMPORTANT!: make a copy of the defaultSchema, else we will work on cross references
      this.properties[name] = JSON.parse(JSON.stringify(
        bcc.Container.defaultSchemas[`${ type }Entry`]
      ));

      // get the value
      this.properties[name].default = fieldUtils.parseFieldValue(
        type,
        form.value.value
      );

      // set min and max values
      const minPropertyName = fieldUtils.getMinPropertyName(type);
      const maxPropertyName = fieldUtils.getMaxPropertyName(type);

      if (form.min.value !== '' && !isNaN(form.min.value)) {
        this.properties[name][minPropertyName] = parseInt(form.min.value, 10);
      } else {
        delete this.properties[name][minPropertyName];
      }
      if (form.max.value !== '' && !isNaN(form.max.value)) {
        this.properties[name][maxPropertyName] = parseInt(form.max.value, 10);
      } else {
        delete this.properties[name][maxPropertyName];
      }
    });
  }

  /**
   * Creates a new evan form to handle a new entry as one row in the ui.
   *
   * @param      {string}   property   property name
   * @param      {any}      schema     schema definition
   */
  addProperty(property: string, schema: any = { type: 'string' }) {
    const type = fieldUtils.getType(schema);

    this.forms.push(<FieldFormInterface>new EvanForm(this, {
      name: {
        value: property,
        validate: function(vueInstance: AJVComponent, form: FieldFormInterface) {
          const trimmed = this.value.trim();

          // trigger form validation
          vueInstance.checkFormValidity();

          // name must have at least one character
          if (trimmed.length === 0) {
            return '_datacontainer.ajv.name.error.empty';
          } else {
            // check for fields with the same name
            const existingName = vueInstance.forms
              // ignore the current form
              .filter(propForm => propForm !== form)
              .map(propForm => propForm.name.value.trim())
              .filter(name => name === trimmed)
              .length > 0;

            if (existingName) {
              return '_datacontainer.ajv.name.error.exists';
            }
          }

          return true;
        }
      },
      type: {
        value: type,
        validate: function(vueInstance: AJVComponent, form: FieldFormInterface) {
          // trigger form validation
          vueInstance.checkFormValidity();

          // force value evaluation
          form.value.value = fieldUtils.defaultValue({ type: this.value });

          return this.value.trim().length !== 0;
        }
      },
      value: {
        value: fieldUtils.defaultValue(schema),
        validate: function(vueInstance: AJVComponent, form: FieldFormInterface) {
          // only check validity when the value is enabled
          if (!vueInstance.disableValue) {
            // trigger form validation
            vueInstance.checkFormValidity();

            // check if min and max values are set and apply them into a temporary schema definition
            const validationSchema = { };
            if (form.min.value !== '' && !isNaN(form.min.value)) {
              validationSchema[fieldUtils.getMinPropertyName(type)] = parseInt(form.min.value, 10);
            }
            if (form.max.value !== '' && !isNaN(form.max.value)) {
              validationSchema[fieldUtils.getMaxPropertyName(type)] = parseInt(form.max.value, 10);
            }

            return fieldUtils.validateField(
              (<any>form).type.value,
              form.value,
              validationSchema,
              vueInstance.address,
            );
          } else {
            return true;
          }
        },
      },
      min: {
        value: schema[fieldUtils.getMinPropertyName(type)] || '',
        validate: function(vueInstance: AJVComponent, form: FieldFormInterface) {
          // trigger form validation
          vueInstance.checkFormValidity();

          // force value evaluation
          form.value.value = form.value.value;
          form.max.value = form.max.value;

          if (form.max.value !== '') {
            return parseInt(form.max.value, 10) >= parseInt(form.min.value, 10);
          } else {
            return true;
          }
        }
      },
      max: {
        value: schema[fieldUtils.getMaxPropertyName(type)] || '',
        validate: function(vueInstance: AJVComponent, form: FieldFormInterface) {
          // trigger form validation
          vueInstance.checkFormValidity();

          // force value evaluation
          form.value.value = form.value.value;
          form.min.value = form.min.value;

          if (form.min.value !== '') {
            return parseInt(form.max.value, 10) >= parseInt(form.min.value, 10);
          } else {
            return true;
          }
        }
      }
    }));

    // auto focus new form element
    this.$nextTick(() => this.checkFormValidity());
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
