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
*/

<template>
  <div class="col-12 d-flex justify-content-center align-items-center"
    v-if="creatingProfile">
    <div>
      <template v-if="creatingProfile !== 5">
        <div>
          <img class="img-fluid"
            style="height: 526px;"
            :src="$store.state.onboardingBaseUrl + '/assets/creating_' + creatingProfile + '.png'">
        </div>
        <div style="height: 10px" class="mx-auto progress my-3 bg-white">
          <div
            class="progress-bar"
            role="progressbar"
            :style="{width: `${(creatingProfile * 20)}%`}"
          ></div>
        </div>
        <h5 class="font-weight-bold mt-5 text-center">
          {{ ('_onboarding.sign-up.create-profile.status-' + creatingProfile) | translate }}
        </h5>
      </template>
      <div v-if="creatingProfile === 5" class="h-100 d-flex align-items-center justify-content-center">
        <evan-success></evan-success>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './creating.ts';
  export default Component;
</script>


