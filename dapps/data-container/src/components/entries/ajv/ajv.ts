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

@Component({ })
export default class AJVComponent extends mixins(EvanComponent) {
  /**
   * schema / value / read
   */
  @Prop({ default: 'schema' }) mode;

  /**
   * Should the value row be displayed? (disabled for list configuration)
   */
  @Prop({ }) enableValue;

  /**
   * Object entry schema (full entry schema or list entry schema)
   */
  @Prop() schema: any;

  /**
   * Value corresponding to the ajv
   */
  @Prop() value: any;

  /**
   * formular specific variables
   */
  forms: Array<EvanForm> = [ ];

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
      .keys(this.schema)
      .forEach((schemaKey: string) => this.addProperty(schemaKey, this.schema[schemaKey]));
  }

  /**
   * Creates a new evan form to handle a new entry as one row in the ui.
   */
  addProperty(property: string, config: any = { type: 'string', value: '' }) {
    this.forms.push(new EvanForm(this, {
      name: {
        value: property,
        validate: function(vueInstance: AJVComponent, form: EvanForm) {
          return this.value.length !== 0;
        }
      },
      type: {
        value: config.type
      },
      value: {
        value: config.value,
        validate: function(vueInstance: AJVComponent, form: EvanForm) {
          // map the value top the correct dynamic type validator
          return validators[(<any>form).type.value](vueInstance, form);
        }
      },
    }));
  }
}
