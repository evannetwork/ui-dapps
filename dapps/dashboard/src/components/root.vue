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

<template>
  <div class="evan theme-evan">
    <evan-dashboard
      :brand-large="$store.state.uiLibBaseUrl + '/assets/evan-logo-dark-half.svg'"
      :brand-small="$store.state.uiLibBaseUrl + '/assets/evan-logo-small.svg'">
      <template v-slot:sidebar>
        <ul class="nav font-medium in" id="main-menu">
          <li>
            <a href="index.html" class="active">
              <i class="fas fa-id-card" data-icon="v"></i>
              <span class="hide-menu">Identitäten</span>
            </a>
          </li>
          <li>
            <a href="auftrag-mobil.html" class="">
              <i class="fas fa-bookmark"></i>
              <span class="hide-menu">Favoriten</span>
            </a>
          </li>
          <li>
            <a href="detail.html" class="">
              <i class="fas fa-envelope"></i>
              <span class="hide-menu">Mailbox</span>
            </a>
          </li>
          <li>
            <a href="task-mobil.html" class="">
              <i class="fas fa-address-book"></i>
              <span class="hide-menu">Kontakte</span>
            </a>
          </li>
          <li>
            <a href="auftrag-mobil.html" class="">
              <i class="fas fa-envelope"></i>
              <span class="hide-user">Profil</span>
            </a>
          </li>
        </ul>
      </template>
      <template v-slot:content>
        <transition name="fade" mode="out-in">
          <router-view class="child-view"></router-view>
        </transition>
        <dashboard-sidebar-level-2>
          <template v-slot:content>
            dashboard-sidebar-level-2 jeha!
          </template>
        </dashboard-sidebar-level-2>
      </template>
    </evan-dashboard>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as bcc from '@evan.network/api-blockchain-core';
  import * as dappBrowser from '@evan.network/ui-dapp-browser';

  export default Vue.extend({
    data () {
      return {
        transitionName: ''
      }
    },
    async created() {
      const activeAccount = dappBrowser.core.activeAccount();

      // check if a user is already logged in, if yes, navigate to the signed in route
      if (activeAccount && window.localStorage['evan-vault']) {
        let isOnboarded = false;
        try {
          isOnboarded = await dappBrowser.bccHelper.isAccountOnboarded(activeAccount);
        } catch (ex) { }

        if (!isOnboarded) {
          return window.location.hash = `#/onboarding.${ dappBrowser.getDomainName() }`
        }
      }

      dappBrowser.loading.finishDAppLoading();
    }
  });
</script>

<style lang="scss" scoped>

</style>

