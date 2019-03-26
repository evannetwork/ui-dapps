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

@Component({ })
export default class Root extends mixins(EvanComponent) {
  async created() {
    // if we are directly on the onboarding, the signup is disabled
    //  => redirect user to the dashboard, so this dapp will handle the correct vue logic
    const activeAccount = dappBrowser.core.activeAccount();

    // check if a user is already logged in, if yes, navigate to the signed in route
    if (activeAccount && window.localStorage['evan-vault']) {
      let isOnboarded = false;
      try {
        isOnboarded = await dappBrowser.bccHelper.isAccountOnboarded(activeAccount);
      } catch (ex) { }

      if (isOnboarded) {
        dappBrowser.loading.finishDAppLoading();
        return this.$router.push({ name: 'signed-in', query: this.$route.query });
      }
    }

    // if the user is not signed in, but the signed in route is opened, navigate to start
    if (this.$route.name === 'signed-in') {
      return this.$router.push({ name: 'welcome', query: this.$route.query });
    }

    dappBrowser.loading.finishDAppLoading();
  }
}


