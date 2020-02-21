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
import {
  EvanComponent, EvanTableColumn, EvanTableItem,
} from '@evan.network/ui-vue-core';
import { ContactsService } from './ContactsService';
import { Contact } from './ContactInterfaces';
import EditContactComponent from './EditContact';
import updateContactDispatcher from './UpdateContactDispatcher';

@Component
export default class ContactsComponent extends mixins(EvanComponent) {
  contactService: ContactsService;

  isLoading = true;

  // currently only one contact can be favored at a time
  isFavoriteLoading = {
    id: null,
    loading: false,
  };

  sortBy = 'name';

  filter = null;

  filterBy: string[] = [];

  contacts: Contact[] = null;

  selectedContact: Contact = null;

  columns: EvanTableColumn[] = [
    {
      key: 'icon',
      label: '',
      sortable: false,
      thClass: 'th-icon',
    },
    {
      key: 'displayName',
      label: this.$t('_assets.contacts.name'),
      sortable: true,
      tdClass: 'truncate',
    },
    {
      key: 'alias',
      label: this.$t('_assets.contacts.note'),
      sortable: true,
      tdClass: 'truncate',
    },
    {
      key: 'createdAt',
      label: this.$t('_assets.contacts.added'),
      sortable: true,
      thClass: 'th-date',
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      thClass: 'th-icon',
      tdClass: 'td-multi-icon',
    },
  ];

  async created(): Promise<void> {
    const runtime = this.getRuntime();
    this.contactService = new ContactsService(runtime);

    this.contacts = await this.fetchContacts();
    this.isLoading = false;
  }

  /**
   * Route to profile of clicked contact
   * @param contact Clicked contact
   */
  handleRowClicked(contact: Contact): void {
    window.location.hash = `/${this.dapp.rootEns}/profile.vue.${this.dapp.domainName}/${contact.address}/detail`;
  }

  /**
   * Update contact list when new contact added
   */
  async handleContactAdded(): Promise<void> {
    this.isLoading = true;
    this.contacts = await this.fetchContacts();
    this.isLoading = false;
  }

  async onDeleteContact(contact: Contact): Promise<void> {
    await this.contactService.removeContact(contact);
    this.contacts = this.contacts.filter((item) => item.address !== contact.address);
  }

  async onUpdateContact(updatedContact: Contact): Promise<void> {
    await updateContactDispatcher.start(this.getRuntime(), updatedContact);
    // Optimistic updating of the contact
    this.contacts = this.contacts.map((item: Contact) => {
      const contact = item;
      if (item.address === updatedContact.address) {
        contact.alias = updatedContact.alias;
      }
      return contact;
    });
  }

  async fetchContacts(): Promise<Contact[]> {
    return this.contactService.getContacts();
  }

  editContact(contact: EvanTableItem<Contact>): void {
    this.selectedContact = { ...contact.item };
    (this.$refs.editContact as EditContactComponent).showPanel();
  }

  async addFavorite(contact: EvanTableItem<Contact>): Promise<void> {
    this.setFavoriteLoading(contact.item.address, true);
    await this.contactService.addFavorite(contact.item);
    this.setFavoriteLoading(contact.item.address, false);
    this.contacts.find(
      (item) => contact.item.address === item.address,
    ).isFavorite = 'true';
  }

  async removeFavorite(contact: EvanTableItem<Contact>): Promise<void> {
    this.setFavoriteLoading(contact.item.address, true);
    await this.contactService.removeFavorite(contact.item);
    this.setFavoriteLoading(contact.item.address, false);
    this.contacts.find(
      (item) => contact.item.address === item.address,
    ).isFavorite = 'false';
  }

  private setFavoriteLoading(id: string, flag: boolean): void {
    this.isFavoriteLoading = {
      id,
      loading: flag,
    };
  }

  filterByType(type: string): void {
    this.filterBy = ['type'];
    this.filter = type;
  }

  filterByFavorites(): void {
    this.filterBy = ['isFavorite'];
    this.filter = 'true';
  }

  resetFilter(): void {
    this.filterBy = [];
    this.filter = null;
  }

  filterBySearchTerm(searchTerm: string): void {
    this.filterBy = [];
    this.filter = searchTerm;
  }
}
