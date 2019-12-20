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
import Component, { mixins } from 'vue-class-component';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import { ContactsService, Contact } from './ContactsService';

@Component
export default class ContactsComponent extends mixins(EvanComponent) {
  contactService: ContactsService;

  isLoading = true;

  sortBy = 'name';

  filter = null;
  filterBy: string[] = [];

  contacts: Contact[] = [];

  columns = [
    { key: 'icon', label: '', sortable: false },
    { key: 'alias', label: this.$t('_assets.contacts.name'), sortable: true },
    { key: 'updatedAt', label: this.$t('_assets.contacts.updated'), sortable: true },
    { key: 'createdAt', label: this.$t('_assets.contacts.created'), sortable: true },
    { key: 'favorite', label: '', sortable: false }
  ];

  created() {
    const runtime = this.getRuntime();
    this.contactService = new ContactsService(runtime);
  }

  async mounted() {
    this.contacts = await this.fetchContacts();    
    this.isLoading = false;
  }

  /**
   * Route to profile of clicked contact 
   * @param contact Clicked contact
   */
  handleRowClicked(contact: Contact) {
    window.location.hash = `/${this.dapp.rootEns}/profile.vue.${this.dapp.domainName}/${contact.address}/detail`;
  }

  /**
   * Update contact list when new contact added
   */
  async handleContactAdded() {
    this.isLoading = true;
    this.contacts = await this.fetchContacts();
    this.isLoading = false;
  }

  async fetchContacts(): Promise<Contact[]> {
    return this.contactService.getContacts();
  }

  filterByType(type: string) {
    this.filterBy = ['type'];
    this.filter = type;
  }

  filterByFavorites() {
    this.filterBy = ['favorite'];
    this.filter = 'true';
  }

  resetFilter() {
    this.filterBy = [];
    this.filter = null;
  }
}
