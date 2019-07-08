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
  <div class="container-wide">
    <div class="d-flex align-items-center mb-5">
      <div>
        <h3 class="font-weight-bold mb-0">
          {{ '_org.identification.title' | translate }}
        </h3>
      </div>
      <span class="mx-auto"></span>
      <div>
      </div>
    </div>

    <div class="white-box border-smooth rounded p-4 d-flex">
      <div class="d-flex px-5 text-center justify-content-center flex-column">
        <img class="img-fluid p-3"
          v-if="$store.state.organization.img"
          :src="$store.state.organization.img">
        <i
          class="mdi mdi-domain text-muted"
          style="font-size: 80px;">
        </i>
        <h3 class="font-weight-semibold">
          {{ $store.state.organization.alias }}
        </h3>
      </div>
      <div class="ml-5">
        <div class="mt-3">
          <h5 class="d-block mb-0 font-weight-semibold">
            {{ '_org.identification.account-id' | translate }}
          </h5>
          <span>{{ $route.params.address }}</span>
        </div>

        <div class="mt-3">
          <h5 class="d-block mb-0 font-weight-semibold">
            {{ '_org.identification.status.title' | translate }}

            <i class="mdi mdi-information-outline text-muted clickable"></i>
          </h5>

          <p>{{ `_org.identification.status.${ status }` | translate }}</p>

          <button type="button" class="btn btn-primary btn-rounded"
            v-if="statusActions.indexOf(status) !== -1"
            :id="`identification-request-${ status }`"
            @click="runStatusAction()">
            {{ `_org.identification.status-actions.${ status }` | translate }}
            <i class="mdi mdi-arrow-right label ml-3"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './identification.ts';
  export default Component;
</script>
