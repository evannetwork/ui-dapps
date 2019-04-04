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
      <h4 class="text-secondary font-weight-bold">{{ '_identities.welcome' | translate }}</h4>
      <h2 class="mt-4">{{ '_identities.startup' | translate }}</h2>
      <br>
    </div>
    <div class="d-md-flex container flex-wrap justify-content-center">
      <a class="
          p-3 col-md-5 col-lg-4 col-xl-3
          m-md-3 mb-3 p-4
          text-center
          bg-level-1 border evan-highlight"
        v-for="(type, index) in dashboardEntries"
        :href="`${ dapp.fullUrl }/${ type.path }`">
        <i class="highlight" :class="type.icon"></i>

        <h3 class="highlight">
          {{ `_identities.start.${ type.title }.title` | translate }}
        </h3>
        <span class="text-muted highlight">
          {{ `_identities.start.${ type.title }.desc` | translate }}
        </span>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './start.ts';
  export default Component;
</script>
