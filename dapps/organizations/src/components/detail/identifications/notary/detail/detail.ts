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

import { getIdentificationDetails } from '../notary.identifications';

@Component({ })
export default class IdentNotaryDetailComponent extends mixins(EvanComponent) {
  /**
   * Request id for that the detail should be displayed
   */
  @Prop() requestId;

  /**
   * ui status flags
   */
  loading = true;

  /**
   * Current identification status for the user
   */
  details = null;

  /**
   * states for that actions are available
   */
  statusActions = [ 'unknown', 'requested', ];

  /**
   * Load current status
   */
  async created() {
    const runtime = (<any>this).getRuntime();

    // TODO: add status loading
    this.details = await getIdentificationDetails(
      runtime,
      this.$route.params.address,
      this.requestId,
    );

    this.loading = false;
  }

  /**
   * Start the action for the current status.
   */
  runStatusAction() {
    switch (this.details.status) {
      case 'unknown':
      case 'requested': {
        (<any>this.$refs.identAction).show();
        break;
      }
      case 'issued': {
        console.log('accept the verification')

        break;
      }
    }
  }
}
