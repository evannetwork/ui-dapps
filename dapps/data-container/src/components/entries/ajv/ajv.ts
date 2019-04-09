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

import validators from '../../../validators';
import * as utils from '../../../utils';

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
   * Should the value row be displayed? (disabled for list configuration)
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
    'files',
    'images',
  ];

  created() {
    // map the initial schema to formulars
    Object
      .keys(this.properties)
      .forEach((schemaKey: string) => this.addProperty(
        schemaKey,
        this.properties[schemaKey].type,
        this.value[schemaKey]
      ));
  }

  /**
   * Map the current ajv formular to the data schema
   */
  beforeDestroy() {
    Object.keys(this.properties).forEach(key => delete this.properties[key]);
    Object.keys(this.value).forEach(key => delete this.value[key]);

    // iterate through all forms and set the correct values to the properties
    this.forms.forEach((form: FieldFormInterface) => {
      this.properties[form.name.value] = { type: form.type.value };
      this.value[form.name.value] = form.value.value;
    });
  }

  /**
   * Creates a new evan form to handle a new entry as one row in the ui.
   */
  addProperty(property: string, type = 'string', value: any) {
    utils.enableDTSave();

    this.forms.push(<FieldFormInterface>new EvanForm(this, {
      name: {
        value: property,
        validate: function(vueInstance: AJVComponent, form: EvanForm) {
          utils.enableDTSave();
          return this.value.length !== 0;
        }
      },
      type: {
        value: type,
        validate: function(vueInstance: AJVComponent, form: EvanForm) {
          utils.enableDTSave();
          return this.value.length !== 0;
        }
      },
      value: {
        value: value,
        validate: function(vueInstance: AJVComponent, form: EvanForm) {
          utils.enableDTSave();
          // map the value top the correct dynamic type validator
          return validators[(<any>form).type.value](vueInstance, form);
        }
      },
    }));
  }

  /**
   * Remove a propertyForm from the forms array.
   *
   * @param      {any}  propertyForm  property form
   */
  removeProperty(propertyForm: FieldFormInterface) {
    utils.enableDTSave();

    this.forms.splice(this.forms.indexOf(propertyForm), 1);
  }
}
