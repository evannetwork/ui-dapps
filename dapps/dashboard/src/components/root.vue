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
    <evan-dapp-wrapper
      :brand-large="$store.state.uiLibBaseUrl + '/assets/evan-logo-dark-half.svg'"
      :brand-small="$store.state.uiLibBaseUrl + '/assets/evan-logo-small.svg'">
      <template v-slot:sidebar>
        <evan-loading :v-if="!loadingRoutes"></evan-loading>
        <ul class="nav font-medium in" id="main-menu"
          :v-if="!loadingRoutes">
          <li v-for="(route, index) in routes">
            <a
              :href="'#/' + route + '.' + domainName"
              :class="{ active: $route.path.startsWith($store.state.urlBasePath + '/' + route.name + '.' + domainName) }">
              <i :class="'fas fa-' + route.icon" data-icon="v"></i>
              <span class="hide-menu">{{ ('_routes.' + route.name) | translate }}</span>
            </a>
          </li>
        </ul>
      </template>
      <template v-slot:content>
        <transition name="fade" mode="out-in">
          <router-view class="child-view"></router-view>
        </transition>
        <evan-dapp-wrapper-level-2>
          <template v-slot:content>
            dapp wrapper-sidebar-level-2 jeha!
          </template>
        </evan-dapp-wrapper-level-2>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as bcc from '@evan.network/api-blockchain-core';
  import * as dappBrowser from '@evan.network/ui-dapp-browser';

  export default Vue.extend({
    data () {
      return {
        transitionName: '',
        domainName: dappBrowser.getDomainName(),
        loadingRoutes: false,
        routes: [
          { name: 'identities', icon: 'fas fa-id-card' },
          { name: 'favorites', icon: 'fas fa-bookmark' },
          { name: 'mailbox', icon: 'fas fa-envelope' },
          { name: 'contacts', icon: 'fas fa-address-book' },
          { name: 'profile', icon: 'fas fa-user' },
        ] as Array<any>
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

      this.loadingRoutes = true;
      // load route dapps to check for standalone configurations and names
      const description = dappBrowser.CoreRuntime.description;
      await this.routes.map(async (route, index) => {
        let description;

        // try load the description for the route
        try {
          description = await description.getDescription(`${ route.name }.${ this.domainName }`);

          // try to load the i18n for the current language
          try {
            route.title = description.public.i18n
          } catch(ex) {
            // try to load the fallback language
          }
        } catch (ex) {
          route.title = route.name;
          route.standalone = false;
        }
      });

      dappBrowser.loading.finishDAppLoading();
    }
  });
</script>

<style lang="scss" scoped>

</style>

