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

/* evan.network imports
   internal */
import { profileUtils } from '@evan.network/ui';
import { ContactInterface } from '@evan.network/ui-vue-core/src/interfaces';
import { ContainerShareConfig, Profile, ProfileOptions } from '@evan.network/api-blockchain-core';
import { EvanComponent } from '@evan.network/ui-vue-core';
import { PermissionUtils, dispatchers } from '@evan.network/digital-twin-lib';

import { getProfilePermissions, removeAllPermissions, findAllByKey } from './utils';


interface SharedContactInterface {
  accountId: string;
  sharedConfig: ContainerShareConfig[];
  permissionType: string;
}

@Component({})
class ProfileSharingsComponent extends mixins(EvanComponent) {
  /**
   * current window width
   */
  windowWidth = 0;

  /**
   * status flags
   */
  loading = true;

  /**
   * contacts of current user
   */
  contacts: ContactInterface[];

  /**
   * contacts who share the profile data with
   */
  sharedContacts = [];

  /**
   * a list of contact IDs currently being loaded
   */
  isLoadingContacts = new Set<string>();

  /**
   * Permission update function that is called by permission-editor.
   */
  updatePermissions: Function;

  /**
   * is needed for the side panel footer interaction
   */
  permissionsEditor = null;

  /**
   * computed property
   * selected shared contacts IDs from vuex store
   */
  get selectedSharedContacts() {
    return (this as any).$store.state.uiState.profile.selectedSharedContacts;
  }

  set selectedSharedContacts(contactId) {
    (this as any).$store.commit('setSelectedSharedContacts', contactId);

    const sharedContact = this.selectedSharedContacts;
    // hide or show sidepanel
    if (!sharedContact || sharedContact === null) {
      this.$store.state.uiState.swipePanel = '';
    } else {
      this.$store.state.uiState.swipePanel = 'sharing';
    }
  }

  get userInfo() {
    return (this as any).$store.state.profileDApp.data.accountDetails;
  }

  /**
   * Watch for dispatcher updates
   */
  listeners: Array<any> = [];

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
    this.$store.state.uiState.swipePanel = '';

    // clear dispatcher listeners
    this.listeners.forEach((listener) => listener());
  }

  async created() {
    /* set the update permission and always pass the current vue context into it, so it can use the
       vuex translate service */
    this.updatePermissions = PermissionUtils.updatePermissions.bind(null, this);

    // watch for permission updates
    this.listeners.push(dispatchers.containerShareDispatcher.watch(async ($event: any) => {
      // set isLoading state to corresponding list elements
      if ($event.detail.status === 'starting') {
        const accountIds = findAllByKey($event.detail.instance.data, 'accountId');
        accountIds.forEach((item) => this.isLoadingContacts.add(item));

        // deselect list elements
        this.selectedSharedContacts = null;
      }

      // canceling isLoading state from corresponding list elements
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        const accountIds = findAllByKey($event.detail.instance.data, 'accountId');
        accountIds.forEach((item) => this.isLoadingContacts.delete(item));
        this.loading = true;
        // Gets the profile permissions.
        this.sharedContacts = await getProfilePermissions(this);
        this.loading = false;
      }
    }));

    /* bind window resize listeners, so the side panel can be pinned to the right side on large
       devices and toggled on small devices */
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();

    // load contacts from addressbook
    this.contacts = await profileUtils.getContacts(this.getRuntime());

    // load shared contacts
    this.sharedContacts = await getProfilePermissions(this);

    this.loading = false;
  }

  handleWindowResize() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth >= 1200) {
      this.$store.state.uiState.swipePanel = 'sharing';
    }
  }

  /**
   * handler for overview item click
   * @param item selected contact
   * @param {MouseEvent} event
   */
  handleSharedContactClick(item: SharedContactInterface, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.selectedSharedContacts = item.accountId;
  }

  /**
   * Removes all permissions from given contact
   * @param {SharedContactInterface} contact contact to remove all permissions
   */
  async handleRemoveSharedContact(contact: SharedContactInterface) {
    await removeAllPermissions(this, contact.sharedConfig)
      .then(() => {
        // remove item from list
        this.sharedContacts = this.sharedContacts.filter((item) => item.accountId !== contact.accountId);
        // remove from selected shared contacts
        this.selectedSharedContacts = null;
      })
      .catch((e: Error) => {
        console.log('Error writing permissions', e.message);
      });
  }

  /**
   * Handler, if contact from permissions editor is selected
   * @param {string} contact contact id from selected contact
   */
  handleOnSelect(contact) {
    this.selectedSharedContacts = contact;
  }

  /**
   * Callback, if overview entry is selected
   * @param {any} item selected contact or contact id
   */
  isSelectedCallback(item): boolean {
    if (!this.selectedSharedContacts) {
      return false;
    }

    if (typeof this.selectedSharedContacts === 'string') {
      return this.selectedSharedContacts === item.accountId;
    }

    return this.selectedSharedContacts.value === item.accountId;
  }

  /**
   * Returns the permissions mapping for certain user. If nothing is shared with the user, copy from own and set all to
   * denied.
   *
   * @param user: string - the user id.
   */
  async loadPermissions(accountId: string) {
    const runtime = this.getRuntime();
    let profileAddress = runtime.profile.profileContract.options.address;

    if (runtime.activeIdentity !== this.$route.params.address) {
      const profile = new Profile({
        accountId: runtime.activeIdentity,
        profileOwner: this.$route.params.address,
        ...(runtime as ProfileOptions),
      });

      await profile.loadForAccount();
      profileAddress = profile.profileContract.options.address;
    }

    return {
      [profileAddress]: await PermissionUtils.getContainerPermissionsForUser(
        runtime,
        {
          containerAddress: profileAddress,
          i18nScope: '_profile.sharing.profileContract',
        },
        accountId,
      ),
    };
  }
}

export default ProfileSharingsComponent;
