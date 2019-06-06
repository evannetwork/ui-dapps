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
import { Prop, Watch } from 'vue-property-decorator';

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { deepEqual } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { utils } from '@evan.network/digitaltwin.lib';

import * as dcUtils from '../../../utils';
import * as entryUtils from '../../../entries';
import ContainerCache from '../../../container-cache';


interface EntryFormInterface extends EvanForm {
  name: EvanFormControl;
  type: EvanFormControl;
  arrayType: EvanFormControl;
}

@Component({ })
export default class NewEntryComponent extends mixins(EvanComponent) {
  /**
   * The full data container template
   */
  @Prop() template: bcc.ContainerTemplate;

  /**
   * formular specific variables
   */
  entryForm: EntryFormInterface = null;

  /**
   * all available entry types
   */
  entryTypes: Array<string> = [
    'object',
    'array',
    'string',
    'number',
    'files',
  ];

  /**
   * all available array types
   */
  arrayTypes: Array<string> = [
    'object',
    'string',
    'number',
    'files',
  ];

  created() {
    this.entryForm = (<EntryFormInterface>new EvanForm(this, {
      name: {
        value: '',
        validate: function(vueInstance: NewEntryComponent, form: EntryFormInterface) {
          const trimmed = this.value.trim();

          if (trimmed.length === 0) {
            return `_datacontainer.entry.name.error.length`;
          } else if (vueInstance.template.properties[trimmed]) {
            return `_datacontainer.entry.name.error.already`;
          } else if (trimmed === 'type') {
            return `_datacontainer.entry.name.error.reserved`;
          } else {
            return true;
          }
        }
      },
      type: {
        value: this.entryTypes[0]
      },
      arrayType: {
        value: this.arrayTypes[0]
      },
    }));
  }

  /**
   * Shows the entry add modal.
   */
  showModal() {
    (<any>this).$refs.entryAddModal.show();
  }

  /**
   * Checks for form validity and triggers the submit event, when it's valid.
   */
  addEntry() {
    const trimmedName = this.entryForm.name.value;

    if (this.entryForm.isValid && !this.template.properties[trimmedName]) {
      // create a new empty data set
      const entryType = this.entryForm.type.value === 'array' ? 'List' : 'Entry';
      const entry: any = {
        mode: 'schema',
        permissions: { 0: ['set'] },
        type: entryType.toLowerCase(),
      };

      if (this.entryForm.type.value === 'array') {
        // set the default schema for arrayType
        // !IMPORTANT!: make a copy of the defaultSchema, else we will work on cross references
        entry.dataSchema =  JSON.parse(JSON.stringify(
          bcc.Container.defaultSchemas[`${ this.entryForm.arrayType.value }${ entryType }`]
        ));

        // add the items schema, including the array type, will be defined only ontime, at entry
        // creation
        if (this.entryForm.arrayType.value === 'object') {
          entry.dataSchema.items.properties = { };
        }
      } else {
        // set the default schema
        // !IMPORTANT!: make a copy of the defaultSchema, else we will work on cross references
        entry.dataSchema = JSON.parse(JSON.stringify(
          bcc.Container.defaultSchemas[`${ this.entryForm.type.value }${ entryType }`]
        ));
      }

      // add properties and empty value object directly, so the vue listeners will work correctly in
      // nested components
      if (this.entryForm.type.value === 'object') {
        entry.dataSchema.properties = { };
      }

      // reset add form
      this.entryForm.name.value = '';

      this.$emit('submit', { name: trimmedName, entry: entry });
      (<any>this).$refs.entryAddModal.hide();
    }
  }
}

