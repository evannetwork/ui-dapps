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

interface FieldFormInterface extends EvanForm {
  value: EvanFormControl;
}

@Component({ })
export default class FieldComponent extends mixins(EvanComponent) {
  /**
   * schema / value / read
   */
  @Prop({ default: 'value' }) mode;

  /**
   * Object entry schema (full entry schema or list entry schema)
   */
  @Prop() schema: any;

  /**
   * Value corresponding to the ajv
   */
  @Prop() value: any;

  /**
   * Optional passed formular that also contains the value control including the type validator.
   *
   * @class      Prop (name)
   */
  @Prop() form: FieldFormInterface;

  /**
   * formular specific variables
   */
  fieldForm: FieldFormInterface = null;

  created() {
    this.fieldForm = this.form || (<FieldFormInterface>new EvanForm(this, {
      value: {
        value: this.value,
        validate: function(vueInstance: FieldComponent, form: FieldFormInterface) {
          // map the value top the correct dynamic type validator
          return validators[this.schema.type](vueInstance, form);
        }
      },
    }));
  }
}
