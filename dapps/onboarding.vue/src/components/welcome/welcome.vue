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
  <div class="p-3">
    <div class="mt-5 mb-3 text-center">
      <br>
      <p class="text-secondary font-weight-bold">{{ '_evan.welcome-to-evan' | translate }}</p>
      <h3>{{ '_onboarding.please-login-signup' | translate }}</h3>
      <br>
    </div>
    <div class="d-md-flex container justify-content-center">
      <div class="
          col-md-6 col-lg-5 col-xl-4
          m-md-3 mb-3 p-4
          text-center
          bg-level-1 border evan-highlight"
        v-for="(type, index) in [ 'sign-in', 'sign-up' ]"
        :id="type"
        @click="$router.push({ name: type, query: $route.query })">
        <img class="img-fluid col-6"
          :src="$store.state.onboardingBaseUrl + `/assets/${ type }.png`">

        <h3 class="highlight">
          {{ `_onboarding.${ type }.title` | translate }}
        </h3>
        <small class="text-muted highlight">
          {{ `_onboarding.${ type }.desc` | translate }}
        </small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Welcome from './welcome.ts';
  export default Welcome;
</script>
