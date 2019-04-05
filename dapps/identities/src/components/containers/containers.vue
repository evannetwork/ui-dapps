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
    <div class="bg-level-1 border mb-3"
      v-if="Object.keys($store.state.uiDI.containers).length === 0">
      <div class="d-flex p-3 border-bottom align-items-center">
        <h4 class="m-0">
          {{ `_identities.containers.empty` | translate }}
        </h4>
      </div>
      <div class="p-3">
        <p>
          {{ `_identities.containers.empty-desc` | translate }}
        </p>

        <div class="text-center">
          <a
            class="btn btn-rounded btn-secondary font-weight-normal m-3"
            :href="`${ dapp.fullUrl }/${ $store.state.uiDI.address }/container-link`">
            {{ '_identities.containers.link' | translate }}
            <i class="fas fa-arrow-right label ml-2"></i>
          </a>
          <a
            class="btn btn-rounded btn-primary font-weight-normal m-3"
            :href="`${ dapp.fullUrl }/${ $store.state.uiDI.address }/datacontainer.digitalidentity.${ dapp.domainName }`">
            {{ '_identities.containers.create' | translate }}
            <i class="fas fa-arrow-right label ml-2"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './containers.ts';
  export default Component;
</script>
