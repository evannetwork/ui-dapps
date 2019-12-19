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

import * as entryUtils from '../../../../entries';
import * as fieldUtils from '../../../../fields';
import { UIContainerTemplateProperty } from '../../../../interfaces';


interface FieldFormInterface extends EvanForm {
  value: EvanFormControl;
}

@Component({ })
export default class EntryListComponent extends mixins(EvanComponent) {
  /**
   * Id for the template that is edited (e.g.: create, container address, template type, ...)
   */
  @Prop() address: string;

  /**
   * data contract listentries name, used for loading entries
   */
  @Prop() entryName: string;

  /**
   * Container property template definition
   */
  @Prop() entry: UIContainerTemplateProperty;

  /**
   * Almost highest available mode
   */
  @Prop() activeMode: string;

  /**
   * Disable schema edit and show only formular with input boxes
   */
  @Prop({ default: true }) schemaEdit: boolean;

  /**
   * Show loading symbol, until listentries were load
   */
  loading = true;

  /**
   * Correctly mapped contract address to the given address, is empty if address is create or
   * invalid
   */
  contractAddress = '';

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Calculated entry schema itemType
   */
  itemType: string = null;

  /**
   * Load listentries
   */
  async created() {
    // Calculated entry schema itemType
    this.itemType = fieldUtils.getType(this.entry.dataSchema.items);

    this.loading = false;
  }

  /**
   * Cancel the schema edit and use the original values.
   */
  reset() {
    if (this.itemType === 'object') {
      // disable value overwrite
      this.reactiveRefs.ajv.deleted = true;

      // reset the schema
      entryUtils.resetSchema(this.entry);
    }
  }

  /**
   * Cache latest values
   */
  async saveAsCache() {
    // save the current schema into the edit properties
    this.reactiveRefs.ajv.save();
  }

  /**
   * Save the current schema.
   */
  save() {
    if (this.itemType === 'object') {
      // save the current schema into the edit properties
      this.reactiveRefs.ajv.save();

      // save the schema
      entryUtils.saveSchema(this.entry);
    } else {
      // save the current schema into the edit properties
      this.reactiveRefs.ajv.save();
    }
  }

  /**
   * Determines if valid.
   */
  isValid() {
    if (this.itemType === 'object') {
      return this.reactiveRefs.ajv.isValid;
    } else {
      return true;
    }
  }
}
