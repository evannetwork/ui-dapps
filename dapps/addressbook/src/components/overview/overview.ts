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
export default class OverviewComponent extends mixins(EvanComponent) {
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
  contacts: any = null;

  /**
   * Run the initialization
   */
  async created() {
    await this.loadContacts();
  }

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
    this.contacts = { all: [ ] };

    // force addressbook reload on clicking reloading button
    if (reload) {
      delete runtime.profile.trees[runtime.profile.treeLabels.addressBook];
    }

    // load the address book for the current user
    const addressBook = await runtime.profile.getAddressBook();

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

      // add the contact to the "all" category
      this.contacts.all.push(contact);

      // push the contact to each specific tag
      contact.tags.forEach(tag => {
        this.contacts[tag] = this.contacts[tag] || [ ];
        this.contacts[tag].push(contact);
      });

      return contact;
    });

    this.loading = false;
  }
}
