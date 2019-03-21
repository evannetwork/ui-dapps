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
    <div class="mt-5 mb-3 text-center">
      <br>
      <p class="text-secondary font-weight-bold">{{ '_evan.welcome-to-evan' | translate }}</p>
      <h3>{{ '_dashboard.startup' | translate }}</h3>
      <br>
    </div>
    <div class="d-md-flex container flex-wrap justify-content-center">
      <div class="
          p-3 col-md-5 col-lg-4 col-xl-3
          m-md-3 mb-3 p-4
          text-center
          bg-level-1 border evan-highlight"
        v-for="(type, index) in dashboardEntries"
        v-on:click="$router.push({ path: `${ $store.state.routeBaseHash }/${ type.path }` })">
        <i :class="type.icon"></i>

        <h3>
          {{ `_dashboard.overview.${ type.title }.title` | translate }}
        </h3>
        <small class="text-muted">
          {{ `_dashboard.overview.${ type.title }.desc` | translate }}
        </small>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import OverviewComponent from './overview.ts';
  export default OverviewComponent;
</script>
