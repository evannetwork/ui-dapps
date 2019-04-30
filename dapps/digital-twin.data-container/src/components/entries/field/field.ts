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

import * as fieldUtils from '../../../fields';
import * as entryUtils from '../../../entries';
import * as utils from '../../../utils';

interface FieldFormInterface extends EvanForm {
  value: EvanFormControl;
}

@Component({ })
export default class FieldComponent extends mixins(EvanComponent) {
  /**
   * Object entry entry type
   */
  @Prop() entry: any;

  /**
   * data contract listentries name, used for loading entries
   */
  @Prop() entryName: string;

  /**
   * list of available modes (schema / edit / view)
   */
  @Prop({
    default: [ ]
  }) modes: Array<string>;

  /**
   * formular specific variables
   */
  fieldForm: FieldFormInterface = null;

  /**
   * Calculated entry schema type
   */
  type: string = null;

  /**
   * Set the field form, if no form was applied
   */
  created() {
    // Calculated entry schema type
    this.type = fieldUtils.getType(this.entry.dataSchema);

    // setup field form
    this.fieldForm = <FieldFormInterface>new EvanForm(this, {
      value: {
        value: this.entry.edit.value,
        validate: function(vueInstance: FieldComponent, form: FieldFormInterface) {
          // populate the value to the parents component, else the value is handled by the parents
          // form
          vueInstance.entry.edit.value = this.value;

          // run validation
          return fieldUtils.validateField(
            vueInstance.type,
            this,
            vueInstance,
            form
          );
        }
      },
    });
  }

  /**
   * Reset the current edit values.
   */
  reset() {
    entryUtils.resetValue(this, this.entry);
    this.fieldForm.value.value = this.entry.edit.value;
  }

  /**
   * Save the current value and enable the save button
   */
  save() {
    // update entry backup to the latest value
    entryUtils.saveValue(this, this.entry);
  }
}
