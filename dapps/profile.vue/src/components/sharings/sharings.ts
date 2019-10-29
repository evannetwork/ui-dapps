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
import { getProfilePermissions, removeAllPermissions } from './utils';
import { getProfilePermissionDetails, updatePermissions } from './../profile/permissionsUtils';
import { ContainerShareConfig } from '@evan.network/api-blockchain-core';

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
   * computed property
   * selected shared contacts from vuex store
   */
  get selectedSharedContacts() {
    return (this as any).$store.state.uiState.profile.selectedSharedContacts;
  }

  set selectedSharedContacts(contacts) {
    (this as any).$store.commit('setSelectedSharedContacts', contacts);
  }

  handleWindowResize() {
    this.windowWidth = window.innerWidth;
  }

  handleSharedContactClick(item: SharedContactInterface, event: MouseEvent) {
    event.stopPropagation();

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
    const runtime = (<any>this).getRuntime();

    await removeAllPermissions(runtime, item.sharedConfig)
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

  async created() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();

    this.sharedContacts = await getProfilePermissions((<any>this).getRuntime());

    this.loading = false;
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  /**
   * Returns the permissions mapping for certain user. If nothing is shared with the user, copy from own and set all to
   * denied.
   *
   * @param user: string - the user id.
   */
  async loadPermissions(user: string) {
    const runtime = (<any>this).getRuntime();
    const allPermissions = await getProfilePermissionDetails(runtime);

    if (!allPermissions[user]) {
      return allPermissions['new'];
    }

    return allPermissions[user];
  }

  /**
   * Mock: will be replaced by permissions update function. TODO
   */
  updatePermissions = updatePermissions;
}

export default ProfileSharingsComponent;