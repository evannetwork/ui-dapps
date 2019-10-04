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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import IssueComponent from '../notary/actions/issue/issue.vue';

@Component({
  components: {
    'notary-action-issue': IssueComponent,
  }
})
export default class VerificationsOverviewComponent extends mixins(EvanComponent) {
  /**
   * Loading currents users type
   */
  loading = true;

  /**
   * Hide the verification elements to trigger reload.
   */
  rerender = false;

  /**
   * Check for showing the "canIssue button", usually the evan verification account.
   */
  canIssue = false;

  /**
   * Current users address.
   */
  address = '';

  /**
   * Currents users type.
   */
  type = '';

  async created() {
    const runtime = (<any>this).getRuntime();

    // use url address or use runtime activeAccount as default
    this.address = this.$route.params.address || runtime.activeAccount;

    // switch issue account
    this.canIssue = runtime.activeAccount === '0x662fD340606B6c00C51d1915A9f66C081E412e4B';

    // load users type
    this.type = (await runtime.dataContract.getEntry(
      runtime.profile.profileContract,
      'accountDetails',
      runtime.activeAccount
    )).profileType;

    this.loading = false;
  }
}
