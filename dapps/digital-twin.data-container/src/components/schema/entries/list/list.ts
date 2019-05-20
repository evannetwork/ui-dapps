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

import * as entryUtils from '../../../../entries';
import * as fieldUtils from '../../../../fields';
import * as utils from '../../../../utils';
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
   * list of available modes (schema / edit / view)
   */
  @Prop() modes: Array<string>;

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
   * Show the add list entry dialog
   */
  addListEntry = false;
  addListEntryForm: FieldFormInterface = null;

  /**
   * Data container instance, if an address was opened, so we can easily load entries
   */
  dataContainer: bcc.Container;

  /**
   * List of existing list entries, when an real container was opened
   */
  listEntries: Array<any> = [ ];
  expandListEntries: any = { };

  /**
   * paging specific values
   */
  count = 10;
  maxListentries = 0;
  offset = 0;
  reverse = true;

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

    if (this.address.startsWith('0x')) {
      let dataContainer;
      let contractAddress;

      // try to load the contract address for the container, if it could not be loaded, it must be a
      // template
      try {
        dataContainer = utils.getContainer(utils.getRuntime(this), this.address);
        contractAddress = await dataContainer.getContractAddress();
      } catch (ex) { }

      // enable list loading and paging
      if (contractAddress && contractAddress !== utils.nullAddress) {
        this.contractAddress = contractAddress;
        this.dataContainer = dataContainer;
        await this.loadEntries();
      }
    }

    // add form handling for field controls
    if (this.itemType !== 'object') {
      this.addListEntryForm = <FieldFormInterface>new EvanForm(this, {
        value: {
          value: this.entry.edit.value,
          validate: function(vueInstance: EntryListComponent, form: FieldFormInterface) {
            return fieldUtils.validateField(
              vueInstance.itemType,
              this,
              vueInstance,
              form
            );
          }
        },
      });
    }

    this.loading = false;
  }

  /**
   * Add the current form data as a new list entry.
   */
  addEntry() {
    this.addListEntry = false;

    if (this.itemType === 'object') {
      // save the current ajv values to the edit.value object and save the value into the original
      // object
      this.reactiveRefs.addAjv.save();
      entryUtils.saveValue(this, this.entry);
    } else {
      // apply the new data to the list
      this.entry.value.push(this.addListEntryForm.value.value);

      // clear the formular value
      this.entry.edit.value = fieldUtils.defaultValue(this.itemType);
      this.addListEntryForm.value.value = this.entry.edit.value;
    }
  }

  /**
   * Load next list entries
   */
  async loadEntries() {
    this.loading = true;

    try {
      const runtime = utils.getRuntime(this);

      // detect maxListEntries, so we can load until the max list entries were loaded
      this.maxListentries = await runtime.dataContract.getListEntryCount(
        this.contractAddress,
        this.entryName
      );

      // load the next entries
      const newEntries = await this.dataContainer.getListEntries(
        this.entryName,
        this.count,
        this.offset,
        this.reverse
      );

      // apply the new entries to the list and increase the page params
      this.offset += newEntries.length;
      this.listEntries = this.listEntries.concat(newEntries);
    } catch (ex) { }

    this.loading = false;
  }

  /**
   * Cancel the schema edit and use the original values.
   */
  resetSchema() {
    // disable value overwrite
    this.reactiveRefs.schemaAjv.deleted = true;

    // reset the schema
    entryUtils.resetSchema(this.entry);
    this.$set(this.entry, 'mode', 'view');
  }

  /**
   * Save the current schema.
   */
  saveSchema() {
    // save the current schema into the edit properties
    this.reactiveRefs.schemaAjv.save();

    // save the schema
    entryUtils.saveSchema(this.entry);
    this.$set(this.entry, 'mode', 'view');
  }
}
