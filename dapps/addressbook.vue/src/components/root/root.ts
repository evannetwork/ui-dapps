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

@Component({ })
export default class AddressBookComponent extends mixins(EvanComponent) {
  /**
   * show the loading symbol
   */
  loading = true;

  /**
   * Current category of visible contacts
   */
  activeCategory = 'all';

  /**
   * All contacts build into an contacts array mapped to tags
   */
  categories: any = null;

  /**
   * Run the initialization
   */
  async created() {}

  /**
   * Load the contacts and map them to the tag categories and make it usable from the template
   *
   * @param      {boolean}  reload  was the component reloaded?
   */
  async loadContacts(reload?: boolean) {
    this.loading = true;

    // quick usage
    const runtime = (<any>this).getRuntime();

    // reset the contracts
    this.categories = { };

    // force addressbook reload on clicking reloading button
    if (reload) {
      delete runtime.profile.trees[runtime.profile.treeLabels.addressBook];
    }

    // load the address book for the current user
    const addressBook = await runtime.profile.getAddressBook();
    bcc.Ipld.purgeCryptoInfo(addressBook);

    // map all the contacts to it's categories
    Object.keys(addressBook.profile).forEach((address) => {
      const contact = addressBook.profile[address];
      contact.address = address;

      // parse tags to have the correct format (move string as one entry to an new array, default
      // is an array)
      if (!Array.isArray(contact.tags)) {
        if (typeof contact.tags === 'string') {
          contact.tags = [ contact.tags ];
        } else {
          contact.tags = [ ];
        }
      }

      // categorize by starting characters
      this.categories[contact.alias[0]] = this.categories[contact.alias[0]] || [ ];
      this.categories[contact.alias[0]].push(contact);
    });

    // sort all users by alias
    Object.keys(this.categories).forEach((category) => {
      this.categories[category].sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        } else {
          return 0;
        }
      });
    });

    this.loading = false;
  }

  /**
   * Sends the hide sidebar event.
   */
  hideSidebar2() {
    window.dispatchEvent(new CustomEvent('dapp-wrapper-sidebar-close'));
  }
}
