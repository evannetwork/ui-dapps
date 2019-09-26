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

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

import * as dispatchers from '../../dispatchers/registry';

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
   * Original addressbook.
   */
  addressBook: any = null;

  /**
   * Watch for dispatcher updates.
   */
  dispatcherWatch = null;
  saving = false;

  /**
   * Run the initialization
   */
  async created() {
    this.dispatcherWatch = Dispatcher.watch(
      ($event) => this.loadContacts($event.detail.status === 'finished'),
      `addressbook.vue.${ (<any>this).dapp.domainName }`,
      '*'
    );
  }

  /**
   * Load the contacts and map them to the tag categories and make it usable from the template
   *
   * @param      {boolean}  reload  was the component reloaded?
   */
  async loadContacts(reload?: boolean) {
    this.loading = reload || !this.addressBook;

    // quick usage
    const runtime = (<any>this).getRuntime();

    // force addressbook reload on clicking reloading button
    if (reload || !this.addressBook) {
      delete runtime.profile.trees[runtime.profile.treeLabels.addressBook];
      this.addressBook = JSON.parse(JSON.stringify(await runtime.profile.getAddressBook()));
    }

    // load the address book for the current user
    bcc.Ipld.purgeCryptoInfo(this.addressBook);

    // copy addressbook
    const contacts = JSON.parse(JSON.stringify(this.addressBook.profile));

    // checkDispatcherData
    const dispatcherInstances = (await Promise.all([
      dispatchers.inviteDispatcher.getInstances(runtime),
      dispatchers.updateDispatcher.getInstances(runtime),
      dispatchers.removeDispatcher.getInstances(runtime),
    ]));

    // iterate through all dispatcher instances and apply loading flag, and changed data
    dispatcherInstances.forEach((instances: Array<DispatcherInstance>, index: number) =>
      instances.forEach((instance: DispatcherInstance) => {
        const data = instance.data;
        contacts[data.accountId || data.email] = Object.assign(
          contacts[data.accountId || data.email] || { },
          {
            loading: true,
            remove: index === 2,
          },
          instance.data
        );
      })
    );

    // map all the contacts to it's categories
    const categories = { };
    Object.keys(contacts).forEach((accountId) => {
      const contact = contacts[accountId];
      contact.accountId = accountId;

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
      const category = contact.alias[0].toLowerCase();
      categories[category] = categories[category] || [ ];
      categories[category].push(contact);
    });

    // sort all users by alias
    Object.keys(categories).forEach((category) => {
      categories[category].sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        } else if (a.title > b.title) {
          return 1;
        } else {
          return 0;
        }
      });
    });

    this.categories = categories;
    this.loading = false;
  }
}
