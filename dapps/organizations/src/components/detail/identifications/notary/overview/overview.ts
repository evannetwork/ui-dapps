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
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import { getRequests, getIssuedVerifications } from '../notary.identifications';

@Component({ })
export default class IdentNotaryOverviewComponent extends mixins(EvanComponent) {
  /**
   * ui status flags
   */
  loading = true;
  reloading = true;

  /**
   * all my assigned organizations
   */
  requests: Array<string> = null;

  /**
   * Check for showing the "canIssue button", usually the evan verification account.
   */
  canIssue = false;

  /**
   * Load request function to be able to listent on reload event
   */
  loadRequests: Function;

  /**
   * already verified verifications
   */
  verifications: any;

  async created() {
    // load the organizations
    const runtime = (<any>this).getRuntime();

    // set load requests function so we can use it within the event listener
    this.loadRequests = (async () => {
      this.reloading = true;
      this.requests = await getRequests(runtime, this.$route.params.address);
      this.verifications = [await getIssuedVerifications(runtime)];
      this.reloading = false;
    }).bind(this);

    // load initial data
    await this.loadRequests();

    // bind reload eventr listener
    window.addEventListener(
      `org-ident-reload-${ this.$route.params.address }`,
      <any>this.loadRequests
    );

    this.loading = false;
  }

  /**
   * Remove ident reload listener
   */
  beforeDestroy() {
    window.removeEventListener(
      `org-ident-reload-${ this.$route.params.address }`,
      <any>this.loadRequests
    );
  }
}
