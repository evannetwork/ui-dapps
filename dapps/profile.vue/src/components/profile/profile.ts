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
import { EvanComponent, ContactInterface } from '@evan.network/ui-vue-core';
import { PermissionUtils } from '@evan.network/digital-twin-lib';
import { Profile, ProfileOptions } from '@evan.network/api-blockchain-core';
import { profileUtils } from '@evan.network/ui';
import { session } from '@evan.network/ui-session';

import * as dispatchers from '../../dispatchers/registry';


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
  balance: { amount: string; timestamp: number } = null;

  /**
   * Amount of calculated verifications and requests
   */
  verificationCount = 0;

  /**
   * Available profile types, that are selectable by the user
   */
  profileTypes = ['company', 'device'];

  /**
   * New type, that was selected by the user
   */
  newType = null;

  /**
   * user contacts from addressbook
   */
  contacts: ContactInterface[] = null;

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
    this.address = (this as any).$store.state.profileDApp.address;
    this.userInfo = (this as any).$store.state.profileDApp.data.accountDetails;
    // load balance and parse it to 3 decimal places
    const amount = parseFloat((await session.getBalance(this.address)).toFixed(3));
    this.balance = {
      amount: amount.toLocaleString((this as any).$i18n.locale()),
      timestamp: Date.now(),
    };
    /* set the update permission and always pass the current vue context into it, so it can use the
       vuex translate service */
    this.updatePermissions = PermissionUtils.updatePermissions.bind(null, this);

    // load contacts from addressbook
    this.contacts = await profileUtils.getContacts((this as any).getRuntime());

    this.loading = false;
  }

  /**
   * Return the current verification / request status count.
   */
  setVerificationCount() {
    this.verificationCount = 0;

    if (this.$refs.notaryVerifications) {
      this.verificationCount += (this.$refs.notaryVerifications as any).verifications.length;
      this.verificationCount += (this.$refs.notaryVerifications as any).requests.length;
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

    dispatchers.updateProfileDispatcher.start((this as any).getRuntime(), {
      address: (this as any).$store.state.profileDApp.address,
      formData: userInfo,
      type: 'accountDetails',
    });
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

    if (runtime.activeAccount !== this.$route.params.address) {
      const profile = new Profile({
        accountId: runtime.activeAccount,
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

  /**
   * Callback if user select a contact from Sharing-Side-Panel
   * @param {string} contact selected contact id
   */
  handleOnSelect(contact) {
    this.selectedSharedContacts = contact;
  }

  /**
   * Trigger profile type change
   *
   * @param      {string}  type    The type
   */
  changeType(type: string) {
    if (this.newType !== 'user') {
      dispatchers.updateProfileDispatcher.start((this as any).getRuntime(), {
        formData: {
          profileType: this.newType,
        },
        type: 'accountDetails',
      });
    }
  }
}
