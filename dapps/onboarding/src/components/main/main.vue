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
  <div class="evan-vue-onboarding evan-theme-evan">
    <div id="evan-particles"></div>
    <transition name="fade" mode="out-in">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as bcc from 'bcc';
  import * as dappBrowser from 'dapp-browser';
  import particlesJSConfig from '../libs/particlesjs-config';

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
          isOnboarded = await bcc.isAccountOnboarded(activeAccount);
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
    },
    // beforeRouteUpdate (to, from, next) {
    //   const toDepth = to.path.split('/').length;
    //   const fromDepth = from.path.split('/').length;
    //   this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
    //   next();
    // },
    mounted: function () {
      this.$nextTick(() => (<any>window).particlesJS('evan-particles', particlesJSConfig));
    }
  });
</script>

<style lang="scss" scoped>
  #evan-particles {
    height: 100%;
    position: fixed;
    width: 100%;
    z-index: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 0.3s;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }
</style>

