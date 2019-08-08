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

import { getRequests, getIssuedVerifications, getIdentificationDetails } from '../notary.identifications';

@Component({ })
export default class IdentNotaryOverviewComponent extends mixins(EvanComponent) {
  /**
   * ui status flags
   */
  error = false;
  loading = true;
  reloading = false;
  rerender = false;

  /**
   * all my assigned organizations
   */
  requests: Array<string> = null;

  /**
   * Load request function to be able to listent on reload event
   */
  loadRequests: Function;

  /**
   * already verified verifications
   */
  verifications: any;

  /**
   * Interval for reloading requests until a new request could be loaded. (will be asynchroniously
   * and available after the agent has detected the b-mail.)
   */
  newRequestsInterval;

  async created() {
    // load the organizations
    const runtime = (<any>this).getRuntime();

    // set load requests function so we can use it within the event listener
    this.loadRequests = (async (rerender: boolean) => {
      this.rerender = rerender;

      try {
        this.requests = await getRequests(runtime, this.$route.params.address);
        this.verifications = await getIssuedVerifications(runtime);
      } catch (ex) {
        runtime.logger.log(ex.message, 'error');
        this.error = true;
      }

      this.rerender = false;
    }).bind(this);

    // load initial data
    await this.loadRequests();

    // bind reload eventr listener
    window.addEventListener(
      `org-ident-reload-${ this.$route.params.address }`,
      ($event) => <any>this.checkNewRequests($event)
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

  /**
   * Check several times for new requests until the new status could be loaded.
   */
  checkNewRequests($event) {
    // hide reloading and clear interval check
    const finishedReloading = () => {
      this.reloading = false;
      delete this.newRequestsInterval;
      clearInterval(this.newRequestsInterval);
    }

    // clear previously running intervals
    this.newRequestsInterval && finishedReloading();

    // show reloading dialog
    this.reloading = true;

    // allow only 20 reloads (60 seconds)
    let reloads = 0;
    const detail = $event.detail;
    const runtime = (<any>this).getRuntime();
    const check = async () => {
      await this.loadRequests();

      // increase reload count
      reloads++;
      if (reloads === 10) {
        finishedReloading();
      } else {
        switch (detail.status) {
          // check if any requests could be loaded
          case 'requested': {
            this.requests.length !== 0 && finishedReloading();
            break;
          }
          case 'confirming' : {
            // load request detail for the provided request id
            const requests = await Promise.all(this.requests
              .filter(requestId => requestId === detail.requestId)
              .map(async (requestId: string) => {
                return await getIdentificationDetails(
                  runtime,
                  this.$route.params.address,
                  requestId,
                );
              })
            );

            // check if the request status has been updated
            const hasUpdated = requests.filter(req => req.status === 'confirming');
            hasUpdated.length !== 0 && finishedReloading();

            break;
          }
          case 'finished': {
            this.requests.indexOf(detail.requestId) === -1 && this.verifications.length > 0 &&
              finishedReloading();

            break;
          }
        }
      }
    };
    // run the first check directly
    check();
    // check for updates each 2 seconds
    this.newRequestsInterval = setInterval(check, 2 * 1000);
  }
}
