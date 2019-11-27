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
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import * as dispatchers from '../../dispatchers/registry';
import { sortFilters } from '../utils/shareSortFilters';

import { getProfilePermissionDetails, updatePermissions } from '../../lib/permissionsUtils';

@Component({ })
export default class ProfileDetailComponent extends mixins(EvanComponent) {
  /**
   * status flags
   */
  loading = true;

  /**
   * Address of the user that should be loaded
   */
  address = '';

  /**
   * Currents users account information
   */
  userInfo = null;

  /**
   * Currents users eve balances and the timestamp, when the balance was loaded
   */
  balance: { amount: string, timestamp: number } = null;

  /**
   * Amount of calculated verifications and requests
   */
  verificationCount = 0;

  /**
   * Available profile types, that are selectable by the user
   */
  profileTypes = [ 'company', 'device' ];

  /**
   * New type, that was selected by the user
   */
  newType = null;

  /**
   * Sorting for permission sidepanel
   */
  sortFilters = sortFilters;

  /**
   * Permission update function that is called by permission-editor.
   */
  updatePermissions: Function;

  /**
   * is needed for the side panel footer interaction
   */
  permissionsEditor = null;

  /**
   * Load the mail details
   */
  async created() {
    // fill empty address with current logged in user
    this.address = (<any>this).$store.state.profileDApp.address;
    this.userInfo = (<any>this).$store.state.profileDApp.data.accountDetails;
    // load balance and parse it to 3 decimal places
    const amount = parseFloat((await dappBrowser.core.getBalance(this.address)).toFixed(3));
    this.balance = {
      amount: amount.toLocaleString((<any>this).$i18n.locale()),
      timestamp: Date.now(),
    };
    // set the update permission and always pass the current vue context into it, so it can use the
    // vuex translate service
    this.updatePermissions = updatePermissions.bind(null, this);
    this.loading = false;
  }

  /**
   * Return the current verification / request status count.
   */
  setVerificationCount() {
    this.verificationCount = 0;

    if (this.$refs.notaryVerifications) {
      this.verificationCount += (<any>this.$refs.notaryVerifications).verifications.length;
      this.verificationCount += (<any>this.$refs.notaryVerifications).requests.length;
    }
  }

  /**
   * Return the update dispatcher running state.
   */
  isLoading() {
    return (this as any).$store.state.dispatcher.curr.running.updateProfileDispatcher;
  }

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

  /**
   * Save changed user information
   *
   * @param      {any}  userInfo  latest user informatione
   */
  saveUserInfo(userInfo: any) {
    this.userInfo = userInfo;

    dispatchers.updateProfileDispatcher.start((<any>this).getRuntime(), {
      address: (<any>this).$store.state.profileDApp.address,
      formData: userInfo,
      type: 'accountDetails'
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
    const allPermissions = await getProfilePermissionDetails(runtime, (<any>this).$route.params.address);

    if (!allPermissions[user]) {
      return allPermissions['new'];
    }

    return allPermissions[user];
  }

  /**
   * Trigger profile type change
   *
   * @param      {string}  type    The type
   */
  changeType(type: string) {
    if (this.newType !== 'user') {
      dispatchers.updateProfileDispatcher.start((<any>this).getRuntime(), {
        formData: {
          profileType: this.newType
        },
        type: 'accountDetails'
      });
    }
  }
}
