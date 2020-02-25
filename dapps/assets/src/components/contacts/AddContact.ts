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
import { EvanComponent, EvanForm, SwipePanelComponentClass } from '@evan.network/ui-vue-core';
import { ContactsService } from './ContactsService';
import { ContactFormData } from './ContactInterfaces';

@Component
export default class AddContactComponent extends mixins(EvanComponent) {
  contactService: ContactsService;

  addressbook;

  idOrEmailErrorMessage = '';

  idOrEmail = null;

  accountId = null;

  alias = null;

  email = null;

  emailInvite = null;

  fromAlias = null;

  msgBody = null;

  msgTitle = null;

  async created(): Promise<void> {
    this.initState();
    const runtime = this.getRuntime();
    this.contactService = new ContactsService(runtime);
    this.addressbook = await runtime.profile.getAddressBook();
  }

  /**
   * Init and reset component state
   */
  private initState(): void {
    this.idOrEmailErrorMessage = '';
    this.idOrEmail = null;

    this.accountId = null;
    this.alias = null;
    this.email = null;
    this.emailInvite = null;
    this.fromAlias = window.localStorage.getItem('evan-alias');
    this.msgBody = `${this.$t('_assets.contacts.message-prefill')}${
      this.fromAlias
    }`;
    this.msgTitle = this.$t('_assets.contacts.subject-prefill');
  }

  /**
   * Add new contact based on form inputs
   */
  async addContact(): Promise<void> {
    if (this.checkFormValid()) {
      const now = new Date().toISOString();
      const formData: ContactFormData = {
        accountId: this.accountId,
        alias: this.alias,
        createdAt: now,
        currLang: window.localStorage.getItem('evan-language'),
        email: this.email,
        emailInvite: this.emailInvite,
        isFavorite: false,
        fromAlias: this.fromAlias,
        msgBody: this.msgBody,
        msgTitle: this.msgTitle,
        updatedAt: now,
      };

      this.closePanel();

      await this.contactService.addContact(formData);

      this.$emit('contact-added');
    }
  }

  /**
   * Handles changes on the input for evan id and email
   * @param value input value
   */
  handleIdOrEmailChange(value: string): void {
    this.idOrEmailErrorMessage = this.validateIdOrEmail(value);
  }

  private validateIdOrEmail(value: string): string {
    if (EvanForm.validEthAddress(value)) {
      if (this.addressbook.profile[value]) {
        return '_assets.contacts.error-added';
      }
      this.emailInvite = false;
      this.accountId = value;
      this.email = null;
      return '';
    }
    if (EvanForm.validateEmail(value)) {
      this.emailInvite = true;
      this.email = value;
      this.accountId = null;
      return '';
    }
    return '_assets.contacts.error-id-or-email';
  }

  /**
   * Check if all required inputs are filled correctly
   */
  checkFormValid(): boolean {
    if (
      document.querySelector('#contactForm :invalid')
      || this.idOrEmailErrorMessage
    ) {
      return false;
    }
    return true;
  }

  showPanel(): void {
    (this.$refs.addContactPanel as SwipePanelComponentClass).show();
  }

  closePanel(): void {
    (this.$refs.addContactPanel as SwipePanelComponentClass).hide();
  }
}
