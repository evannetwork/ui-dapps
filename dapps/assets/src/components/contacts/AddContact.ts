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
import { profileUtils } from '@evan.network/ui';
import { getPermissionSortFilter } from '@evan.network/profile';
import { PermissionUtils } from '@evan.network/digital-twin-lib';

import { ContactFormData } from './ContactInterfaces';
import { ContactsService } from './ContactsService';

@Component
export default class AddContactComponent extends mixins(EvanComponent) {
  contactService: ContactsService;

  addressbook;

  idOrEmailErrorMessage = '';

  idOrEmail = null;

  accountId = null;

  alias = '';

  email = null;

  emailInvite = null;

  fromAlias = null;

  msgBody = null;

  msgTitle = null;

  loading = true;

  /**
   * Filters for hiding specific profile description data schema entries
   */
  shareFilters: any = null;

  /**
   * Current automatic share config
   */
  sharingObj: any = null;

  /**
   * Result of the evan-permissions component
   */
  selectedSharings = null;

  async created(): Promise<void> {
    await this.initState();
    const runtime = this.getRuntime();
    this.contactService = new ContactsService(runtime);
    this.addressbook = await runtime.profile.getAddressBook();
  }

  /**
   * Init and reset component state
   */
  private async initState(): Promise<void> {
    this.loading = true;

    this.idOrEmailErrorMessage = '';
    this.idOrEmail = null;

    this.accountId = null;
    this.alias = '';
    this.email = null;
    this.emailInvite = null;
    this.fromAlias = await profileUtils.getUserAlias(this.getRuntime());
    this.msgBody = `${this.$t('_assets.contacts.message-prefill')}${
      this.fromAlias
    }`;
    this.msgTitle = this.$t('_assets.contacts.subject-prefill');

    await this.setupAutomaticShareData();
    this.loading = false;
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
        shareData: this.selectedSharings,
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
      document.querySelector('#contactForm :invalid, #contactForm .is-invalid')
      || this.idOrEmailErrorMessage
      || this.alias.length > 100
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

  /**
   * Returns the permissions mapping for certain user. If nothing is shared with the user, copy from own and set all to
   * denied.
   *
   * @param user: string - the user id.
   */
  async setupAutomaticShareData(): Promise<void> {
    const runtime = this.getRuntime();
    const { profile } = runtime;

    await profile.loadForAccount();
    const profileAddress = profile.profileContract.options.address;
    // load profile data, so we can get the correct sort filters
    const description = await profile.profileContainer.getDescription();
    const entryKeys = Object.keys(description.dataSchema);
    const profileData = {};
    await Promise.all(entryKeys.map(async (key: string) => {
      try {
        // load account details
        profileData[key] = await profile.getProfileProperty(key);
      } catch (ex) {
        runtime.logger.log(ex.message, 'error');
      }
    }));
    this.shareFilters = getPermissionSortFilter(profileData);
    // setup sharing obj
    this.sharingObj = (await PermissionUtils.getContainerPermissionsForUser(
      runtime,
      {
        containerAddress: profileAddress,
        i18nScope: '_profile.sharing.profileContract',
      },
      this.idOrEmail,
    )).permissions;
  }

  /**
   * Is the current idOrEmail a eth address
   */
  isAddress(): boolean {
    return this.getRuntime().web3.utils.isAddress(this.idOrEmail);
  }

  /**
   * Set the selected sharings to the latest data, provided by the evan-permission component.
   *
   * @param      {any}  currSharing  curr sharing selection
   */
  handlePermissionUpdate(currSharing: any): void {
    this.selectedSharings = { read: [], readWrite: [] };

    Object.keys(currSharing.permissions).forEach((key: string) => {
      if (currSharing.permissions[key].readWrite) {
        this.selectedSharings.readWrite.push(key);
      } else if (currSharing.permissions[key].read) {
        this.selectedSharings.read.push(key);
      }
    });
  }
}
