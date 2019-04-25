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
    <div class="white-box mt-4 border rounded"
      v-if="!binding">
      <div class="p-0 header">
        <a class="btn large"
          :href="`${ dapp.fullUrl }`">
          <i class="mdi mdi-chevron-left"></i>
        </a>
        <h3 class="m-0 font-weight-semibold">
          {{ `_digitaltwins.map-ens.title` | translate }}
        </h3>
      </div>

      <evan-modal ref="lookupModal">
        <template v-slot:header>
          <h5 class="modal-title">
            {{ `_digitaltwins.map-ens.modal.${ lookupModalScope }.title` | translate }}
          </h5>
        </template>
        <template v-slot:body>
          <p class="text-left m-0"
            v-html="$t(`_digitaltwins.map-ens.modal.${ lookupModalScope }.desc`, modalParams)">
          </p>
        </template>
        <template v-slot:footer>
          <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
           v-if="lookupModalScope === 'available'"
            @click="mapEns()">
            {{ `_digitaltwins.map-ens.modal.${ lookupModalScope }.action` | translate }}
          </button>
        </template>
      </evan-modal>

      <dt-lookup-form
        @submit="openTwin"
        :titleText="'_digitaltwins.map-ens.ens'"
        :buttonText="'_digitaltwins.map-ens.check-ens'"
        :disableCreate="true"
        :disableGlobal="true"
        :disableAutocompletion="true">
        <template v-slot:description>
          <div class="d-flex align-items-center">
            <i class="mdi mdi-fingerprint text-secondary mr-3" style="font-size: 60px;"></i>
            <p class="m-0 text-justify">
              {{ `_digitaltwins.map-ens.description` | translate }}
            </p>
          </div>
        </template>
      </dt-lookup-form>
    </div>
    <div class="text-center" v-else>
      <h4 class="mt-5 mb-3">{{ '_digitaltwins.dispatcher.binding' | translate }}</h4>
      <b> {{ ensAddress }} </b>
      <evan-loading></evan-loading>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './map.ts';
  export default Component;
</script>
