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

import * as fieldUtils from '../../../../fields';
import * as entryUtils from '../../../../entries';


interface FieldFormInterface extends EvanForm {
  value: EvanFormControl;
  min: EvanFormControl;
  max: EvanFormControl;
}

@Component({ })
export default class FieldComponent extends mixins(EvanComponent) {
  /**
   * Id for the template that is edited (e.g.: create, container address, template type, ...)
   */
  @Prop() address: string;

  /**
   * Container property template definition
   */
  @Prop() entry: any;

  /**
   * data contract listentries name, used for loading entries
   */
  @Prop() entryName: string;

  /**
   * Almost highest available mode
   */
  @Prop() activeMode: string;

  /**
   * Disable schema edit and show only formular with input boxes
   */
  @Prop({ default: true }) schemaEdit: boolean;

  /**
   * formular specific variables
   */
  fieldForm: FieldFormInterface = null;

  /**
   * Calculated entry schema type
   */
  type: string = null;
  itemType: string = null;
  combinedType: string = null;

  /**
   * Set the field form, if no form was applied
   */
  created() {
    // Calculated entry schema type
    this.type = fieldUtils.getType(this.entry.dataSchema);
    this.itemType = fieldUtils.getType(this.entry.dataSchema.items);
    this.combinedType = this.itemType || this.type;

    // use correct sub entry schema (root or items for arrays)
    const entrySchema = fieldUtils.getType(this.entry.dataSchema) !== 'array' ?
      this.entry.dataSchema :
      this.entry.dataSchema.items;

    // apply min / max values to the correct sub object
    const min = entrySchema[fieldUtils.getMinPropertyName(this.combinedType)];
    const max = entrySchema[fieldUtils.getMaxPropertyName(this.combinedType)];

    // setup field form
    this.fieldForm = <FieldFormInterface>new EvanForm(this, {
      value: {
        value: this.entry.edit.value,
        validate: function(vueInstance: FieldComponent, form: FieldFormInterface) {
          // populate the value to the parents component, else the value is handled by the parents
          // form
          vueInstance.entry.edit.value = fieldUtils.parseFieldValue(
            vueInstance.combinedType,
            form.value.value
          );

          // set min and max values
          const minPropertyName = fieldUtils.getMinPropertyName(vueInstance.combinedType);
          const maxPropertyName = fieldUtils.getMaxPropertyName(vueInstance.combinedType);
          if (form.min.value !== '' && !isNaN(form.min.value)) {
            entrySchema[minPropertyName] = parseInt(form.min.value, 10);
          } else {
            delete entrySchema[minPropertyName];
          }
          if (form.max.value !== '' && !isNaN(form.max.value)) {
            entrySchema[maxPropertyName] = parseInt(form.max.value, 10);
          } else {
            delete entrySchema[maxPropertyName];
          }

          // run validation
          return fieldUtils.validateField(
            vueInstance.combinedType,
            form.value,
            entrySchema,
            vueInstance.address,
            (<any>vueInstance).$i18n,
          );
        },
      },
      min: {
        value: typeof min === 'undefined' ? '' : min,
        validate: function(vueInstance: FieldComponent, form: FieldFormInterface) {
          // force value evaluation
          form.value.value = form.value.value;

          if (form.min.value !== '' && form.max.value !== '') {
            return parseInt(form.max.value, 10) >= parseInt(form.min.value, 10);
          } else {
            return true;
          }
        }
      },
      max: {
        value: typeof max === 'undefined' ? '' : max,
        validate: function(vueInstance: FieldComponent, form: FieldFormInterface) {
          // force value evaluation
          form.value.value = form.value.value;

          if (form.min.value !== '' && form.max.value !== '') {
            return parseInt(form.max.value, 10) >= parseInt(form.min.value, 10);
          } else {
            return true;
          }
        }
      },
    });

    this.$emit('init', this);
  }

  /**
   * Reset the current edit values.
   */
  reset() {
    entryUtils.resetValue(this, this.entry);
    this.fieldForm.value.value = this.entry.edit.value;
  }

  /**
   * Cache latest values
   */
  async saveAsCache() {
    // do nothing for fields, fields updates directly
  }

  /**
   * Save the current value and enable the save button
   */
  save() {
    const value = fieldUtils.parseFieldValue(this.combinedType, this.entry.edit.value);

    if (this.address.startsWith('0x') || this.address === 'dc-create') {
      if (this.type === 'array') {
        this.fieldForm.value.value = fieldUtils.defaultValue(this.entry.dataSchema.items, 'field');
      } else {
        this.entry.value = value;
        this.fieldForm.value.value = this.entry.value;
      }
    } else {
      if (this.type === 'array') {
        this.entry.dataSchema.items.default = value;
      } else {
        this.entry.dataSchema.default = value;
      }
    }

    this.entry.edit.value = value;
  }

  /**
   * Determines if valid.
   */
  isValid() {
    return this.fieldForm.isValid;
  }

  /**
   * Get correct value for min / max value.
   *
   * @param      {string}  type    The type
   */
  getMinMaxValue(type: string) {
    return this.fieldForm[type].value !== '' && !isNaN(this.fieldForm[type].value) ?
      this.fieldForm[type].value :
      (<any>this).$i18n.translate('_datacontainer.ajv.empty');
  }
}
