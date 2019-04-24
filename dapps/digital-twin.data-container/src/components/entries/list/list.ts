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
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import * as utils from '../../../utils';

@Component({ })
export default class EntryListComponent extends mixins(EvanComponent) {
  /**
   * Id for the template that is edited (e.g.: create, container address, template type, ...)
   */
  @Prop() address: string;

  /**
   * data contract listentries name, used for loading entries
   */
  @Prop() listName: string;

  /**
   * Container property template definition
   */
  @Prop() entry: bcc.ContainerTemplateProperty;

  /**
   * list of available modes (schema / edit / view)
   */
  @Prop() modes: Array<string>;

  /**
   * schema / edit / vue
   */
  @Prop() mode;

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
   * Load listentries
   */
  async created() {
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

    this.loading = false;
  }

  /**
   * Add the current form data as a new list entry.
   */
  addEntry() {
    this.addListEntry = false;

    // wait until the field is removed from dom and beforeDestroy handler has updated the value
    this.$nextTick(() => {
      this.entry.value.unshift((<any>this).entry.addValue);
      (<any>this).entry.addValue = this.entry.dataSchema.items.type === 'object' ? { } : '';
    });
  }

  /**
   * Load next list entries
   */
  async loadEntries() {
    this.loading = true;
    const runtime = utils.getRuntime(this);

    // detect maxListEntries, so we can load until the max list entries were loaded
    this.maxListentries = await runtime.dataContract.getListEntryCount(
      this.contractAddress,
      this.listName
    );

    // load the next entries
    const newEntries = await this.dataContainer.getListEntries(
      this.listName,
      this.count,
      this.offset,
      this.reverse
    );

    // apply the new entries to the list and increase the page params
    this.offset += newEntries.length;
    this.listEntries = this.listEntries.concat(newEntries);

    this.loading = false;
  }
}
