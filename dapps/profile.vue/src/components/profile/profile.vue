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
  <div class="p-md-11 p-1">
    <evan-loading v-if="loading"></evan-loading>
    <template v-else>
      <div class="row mb-3">
        <div class="col-xl-4">
          <a class="d-block bg-inverted p-3 rounded text-decoration-none"
            style="height: 166px"
            :href="`${ dapp.fullUrl }/wallet`">
            <h1>{{ balance }} EVE</h1>
            <small class="font-weight-semibold">{{ '_profile.current-balance' | translate }}</small>
          </a>
        </div>
        <div class="col-xl-8 d-flex flex-column justify-content-center">
          <h2 class="font-weight-semibold mb-4">
            {{ alias }}
          </h2>
          <evan-address :address="address"></evan-address>
          <b class="mt-2">
            {{ `_evan.profile.types.${ type }` | translate }}
          </b>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          
        </div>
        <div class="col-md-4">
          
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './profile.ts';
  export default Component;
</script>

