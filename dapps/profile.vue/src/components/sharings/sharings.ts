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

import { getProfilePermissions } from './utils';

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
   * currently selected contact
   */
  selectedSharedContacts = this.$store.uiState.profile.selectedSharedContacts;

  async created() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();

    this.sharedContacts = await getProfilePermissions((<any>this).getRuntime());

    this.loading = false;
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize() {
    this.windowWidth = window.innerWidth;
  }

  handleSharedContactClick(item: Object, event: MouseEvent) {
    event.stopPropagation();

    let newSharedContacts = this.selectedSharedContacts;
    const index = newSharedContacts.indexOf(item.accountId);

    if (index > -1) {
        // remove from array
        newSharedContacts.splice(index, 1);
        this.$refs.shareSidebar.hide();
    } else {
        // push to array
        newSharedContacts.push(item.accountId);
        this.$refs.shareSidebar.show();
    }

    // toggle open state of swipe panel if neccessary
    // const shouldClose = index > -1;
    // if (this.$store.state.uiState.swipePanel.right === shouldClose) {
    //     this.$store.commit('toggleSidePanel', 'right');
    // }
  }

  handleRemoveSharedContact(item: Object, event: MouseEvent) {
    event.stopPropagation();
    console.log('remove item from shared contacts', item);
  }
}

export default ProfileSharingsComponent;
