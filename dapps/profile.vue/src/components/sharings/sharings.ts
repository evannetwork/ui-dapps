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
// internal
import { ContainerShareConfig } from '@evan.network/api-blockchain-core';
import { EvanComponent } from '@evan.network/ui-vue-core';

import * as dispatchers from '../../dispatchers/registry';
import { getProfilePermissionDetails, updatePermissions } from '../../lib/permissionsUtils';
import { getProfilePermissions, removeAllPermissions, findAllByKey } from './utils';

interface SharedContactInterface {
  accountId: string;
  sharedConfig: ContainerShareConfig[];
  permissionType: String;
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
   * selected shared contacts from vuex store
   */
  get selectedSharedContacts() {
    return (this as any).$store.state.uiState.profile.selectedSharedContacts;
  }

  set selectedSharedContacts(contacts) {
    (this as any).$store.commit('setSelectedSharedContacts', contacts);

    const sharedContact = this.selectedSharedContacts;
    // hide or show sidepanel
    if (!sharedContact || sharedContact === null || sharedContact.length === 0) {
      (<any>this).$store.state.uiState.swipePanel = '';
    } else {
      (<any>this).$store.state.uiState.swipePanel = 'sharing';
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
    (<any>this).$store.state.uiState.swipePanel = '';

    // clear dispatcher listeners
    this.listeners.forEach(listener => listener());
  }

  async created() {
    // set the update permission and always pass the current vue context into it, so it can use the
    // vuex translate service
    this.updatePermissions = updatePermissions.bind(null, this);

    // watch for permission updates
    this.listeners.push(dispatchers.shareProfileDispatcher.watch(async ($event: any) => {
      // set isLoading state to corresponding list elements
      if ($event.detail.status === 'starting') {
        const accountIds = findAllByKey($event.detail.instance.data, 'accountId');
        accountIds.forEach(item => this.isLoadingContacts.add(item));

        // deselect list elements
        this.selectedSharedContacts = this.selectedSharedContacts.filter(item => accountIds.includes(item));
      }

      // canceling isLoading state from corresponding list elements
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        const accountIds = findAllByKey($event.detail.instance.data, 'accountId');
        accountIds.forEach(item => this.isLoadingContacts.delete(item));
        this.loading = true;
        // Gets the profile permissions.
        this.sharedContacts = await getProfilePermissions((<any>this));
        this.loading = false;
      }
    }));

    // bind window resize listeners, so the side panel can be pinned to the right side on large
    // devices and toggled on small devices
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();

    // load shared contacts
    this.sharedContacts = await getProfilePermissions((<any>this));

    this.loading = false;
  }

  handleWindowResize() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth >= 1200) {
      (<any>this).$store.state.uiState.swipePanel = 'sharing';
    }
  }

  handleSharedContactClick(item: SharedContactInterface, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    const index = this.selectedSharedContacts.indexOf(item.accountId);

    // at first allow one selection only
    this.selectedSharedContacts = index > -1 ? [] : [item.accountId];

    // let newSharedContacts = this.selectedSharedContacts;
    // if (index > -1) {
    //   // remove from array
    //   newSharedContacts.splice(index, 1);
    // } else {
    //   // push to array
    //   newSharedContacts.push(item.accountId);
    // }

    // this.selectedSharedContacts = newSharedContacts;
  }

  async handleRemoveSharedContact(item: SharedContactInterface) {
    await removeAllPermissions(this, item.sharedConfig)
      .then(() => {
        // remove item from list
        this.sharedContacts = this.sharedContacts.filter(contact => contact.accountId !== item.accountId);
        // remove from selected shared contacts
        const index = this.selectedSharedContacts.indexOf(item.accountId);
        if (index > -1) {
          this.selectedSharedContacts.splice(index, 1);
        }
      })
      .catch((e: Error) => {
        console.log('Error writing permissions', e.message);
      });
  }

  /**
   * Returns the permissions mapping for certain user. If nothing is shared with the user, copy from own and set all to
   * denied.
   *
   * @param user: string - the user id.
   */
  async loadPermissions(user: string) {
    const runtime = (<any>this).getRuntime();
    const allPermissions = await getProfilePermissionDetails(runtime, this.$route.params.address);

    if (!allPermissions[user]) {
      return allPermissions['new'];
    }

    return allPermissions[user];
  }
}

export default ProfileSharingsComponent;