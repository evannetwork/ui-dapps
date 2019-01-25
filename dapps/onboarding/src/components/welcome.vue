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
  <div>
    <div class="md-layout md-alignment-center-center">
      <img class="logo-header" :src="$store.state.evanCoreBaseUrl + '/assets/evan-logo.svg'">
    </div>
    <div class="md-layout md-gutter md-alignment-center-center">
      <div class="md-layout-item md-size-30 md-medium-size-40 md-small-size-100">
        <md-card>
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{ '_onboarding.sign-up' | translate }}</div>
              <div class="md-subhead">{{ '_onboarding.sign-up-desc' | translate }}</div>
            </md-card-header-text>

            <md-card-media md-big>
              <img :src="$store.state.dappBaseUrl + '/assets/verified-identities.png'">
            </md-card-media>
          </md-card-header>

          <md-card-expand>
            <md-card-actions md-alignment="space-between">
              <md-card-expand-trigger>
                <md-button class="md-icon-button">
                  <md-icon>keyboard_arrow_down</md-icon>
                </md-button>
              </md-card-expand-trigger>
              <div>
                <md-button
                  v-on:click="$router.push($store.state.urlBasePath + '/signup')">
                  {{ '_onboarding.continue' | translate }}
                </md-button>
              </div>
            </md-card-actions>

            <md-card-expand-content>
              <md-card-content>
                {{ '_onboarding.sign-up-desc-long' | translate }}
              </md-card-content>
            </md-card-expand-content>
          </md-card-expand>
        </md-card>
      </div>
      <div class="md-layout-item md-size-30 md-medium-size-40 md-small-size-100">
        <md-card>
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{ '_onboarding.sign-in' | translate }}</div>
              <div class="md-subhead">{{ '_onboarding.sign-in-desc' | translate }}</div>
            </md-card-header-text>

            <md-card-media md-big>
              <img :src="$store.state.dappBaseUrl + '/assets/verified-identities.png'" alt="People">
            </md-card-media>
          </md-card-header>

          <md-card-expand>
            <md-card-actions md-alignment="space-between">
              <md-card-expand-trigger>
                <md-button class="md-icon-button">
                  <md-icon>keyboard_arrow_down</md-icon>
                </md-button>
              </md-card-expand-trigger>
              <div>
                <md-button
                  v-on:click="$router.push($store.state.urlBasePath + '/signin')">
                  {{ '_onboarding.continue' | translate }}
                </md-button>
              </div>
            </md-card-actions>

            <md-card-expand-content>
              <md-card-content>
                {{ '_onboarding.sign-in-desc-long' | translate }}
              </md-card-content>
            </md-card-expand-content>
          </md-card-expand>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as bcc from 'bcc';
  import { System, core, dapp, getDomainName } from 'dapp-browser';

  export default Vue.extend({ });
</script>

<style lang="scss" scoped>
  .logo-header {
    width: 600px;
    max-width: 90%;
    margin: 50px;
  }

  .md-card {
    border-radius: 20px;
    opacity: 0.7;
    transition: 0.5s ease-out opacity;

    &:hover {
      opacity: 1;
    }

    .md-card-actions {
      border-bottom-right-radius: 20px;
      border-bottom-left-radius: 20px;
    }
  }

  @media(max-width: 768px) {
    .logo-header {
      margin: 25px 0 0 0;
    }

    .md-card {
      margin: 25px 0;
    }
  }
</style>

