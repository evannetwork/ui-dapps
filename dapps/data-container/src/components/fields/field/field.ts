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
  value: EvanFormControl;
}

@Component({ })
export default class FieldComponent extends mixins(EvanComponent) {
  /**
   * schema / edit / vue
   */
  @Prop({ default: 'edit' }) mode;

  /**
   * Object entry entry type
   */
  @Prop() type: any;

  /**
   * Optional Value corresponding to the ajv, needed, when no form was applied
   */
  @Prop() value: any;

  /**
   * Optional passed formular that also contains the value control including the type validator.
   */
  @Prop() form: FieldFormInterface;

  /**
   * formular specific variables
   */
  fieldForm: FieldFormInterface = null;

  /**
   * is the field standalone? (When no form was applied on startup)
   */
  standalone = false;

  /**
   * Set the field form, if no form was applied
   */
  created() {
    this.standalone = !this.form;
    this.fieldForm = this.form || (<FieldFormInterface>new EvanForm(this, {
      value: {
        value: this.value,
        validate: function(vueInstance: FieldComponent, form: FieldFormInterface) {
          utils.enableDTSave();
          return validators[vueInstance.type](vueInstance, form);
        }
      },
    }));
  }

  /**
   * Map the current ajv formular to the data schema
   */
  beforeDestroy() {
    // in standalone mode, populate the value to the parents component, else the value is handled by
    // the parents form
    if (this.standalone) {
      this.$emit('update:value', this.fieldForm.value.value);
    }
  }
}
