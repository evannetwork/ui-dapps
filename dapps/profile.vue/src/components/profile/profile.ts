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
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import { getIdentificationDetails } from '../verifications/notary/notary.lib';
import * as dispatchers from '../../dispatchers/registry';

import { getProfilePermissionDetails, updatePermissions } from './permissionsUtils';

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
   * Load the mail details
   */
  async created() {
    const runtime = (<any>this).getRuntime();
    // fill empty address with current logged in user
    this.address = this.$route.params.address || runtime.activeAccount;
    // load balance and parse it to 3 decimal places
    const amount = parseFloat((await dappBrowser.core.getBalance(runtime.activeAccount)).toFixed(3));
    this.balance = {
      amount: amount.toLocaleString(this.$i18n.locale()),
      timestamp: Date.now(),
    };
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
   * Open the type switch modal
   */
  typeSwitchModal() {
    if (this.userInfo.profileType === 'unspecified' && !this.isLoading()) {
      (this as any).$refs.profileType.show();
    }
  }

  /**
   * Save changed user information
   *
   * @param      {any}  userInfo  latest user informatione
   */
  saveUserInfo(userInfo: any) {
    this.userInfo = userInfo;

    dispatchers.updateProfileDispatcher.start((<any>this).getRuntime(), {
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
