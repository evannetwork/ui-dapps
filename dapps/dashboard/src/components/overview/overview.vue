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
  <div class="container mx-auto m-0">
    <div class="mt-5 mb-3 text-center">
      <br>
      <h1 class="mt-4 font-weight-semibold">{{ '_dashboard.startup' | translate }}</h1>
      <h3 class="mt-4 font-weight-semibold text-muted">{{ '_evan.welcome-to-evan' | translate }}</h3>
      <div class="bg-secondary d-inline-block" style="width: 70px; height: 5px;"></div>
      <br>
    </div>
    <div class="d-md-flex flex-wrap justify-content-center p-0 p-xs-3">
      <div class="col-md-6 col-lg-4 p-3"
        v-for="(type, index) in dashboardEntries">
        <div class="d-flex flex-column text-center bg-level-1 border evan-highlight p-4"
          style="min-width: 250px"
          v-on:click="$router.push({ path: `${ dapp.baseHash }/${ type.path }` })">
          <img class="my-5" style="height: 120px"
            :src="`${ $store.state.uiBaseUrl }/assets/${ type.img }`">

          <h3 class="highlight font-weight-semibold mb-3">
            {{ `_dashboard.overview.${ type.title }.title` | translate }}
          </h3>
          <span class="text-muted highlight font-weight-semibold d-inline-block"
            style="max-width: 250px;">
            {{ `_dashboard.overview.${ type.title }.desc` | translate }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import OverviewComponent from './overview.ts';
  export default OverviewComponent;
</script>
