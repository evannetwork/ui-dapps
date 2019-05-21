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
    <evan-modal
      ref="mapEnsModal">
      <template v-slot:header>
        <p class="modal-title">
            {{ `_digitaltwins.map-ens.title` | translate }}
        </p>
      </template>
      <template v-slot:body>
        <template v-if="!binding">
          <evan-modal
            id="dt-map-modal"
            ref="lookupModal">
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
                id="dt-map-ens"
                v-if="lookupModalScope === 'available'"
                @click="mapEns()">
                {{ `_digitaltwins.map-ens.modal.${ lookupModalScope }.action` | translate }}
              </button>
            </template>
          </evan-modal>

          <dt-ens-actions
            :address="lookupForm.address.value"
            :purchaseEnsAddress="true"
            @init="$set(reactiveRefs, 'ensActions', $event)"
            @submit="openTwin">
          </dt-ens-actions>

          <div class="content"
            v-if="reactiveRefs.ensActions && !reactiveRefs.ensActions.purchasing">
            <form
              id="dt-ens-form"
              class="col-sm-9 mx-auto"
              v-on:submit.prevent="checkAddress">
              <dt-ens-field
                @init="$set(reactiveRefs, 'ensField', $event)"
                :autocomplete="true"
                :form="lookupForm">
                <template slot:label>
                  {{ '_digitaltwins.map-ens.ens' | translate }}
                </template>
              </dt-ens-field>
              <div class="d-flex align-items-center">
                <i class="mdi mdi-fingerprint text-secondary mr-3" style="font-size: 60px;"></i>
                <p class="m-0 text-justify">
                  {{ `_digitaltwins.map-ens.description` | translate }}
                </p>
              </div>
            </form>
          </div>
        </template>
        <div
          id="dt-map-binding"
          class="text-center" v-else>
          <h4 class="mt-5 mb-3">{{ '_digitaltwins.dispatcher.binding' | translate }}</h4>
          <b> {{ ensAddress }} </b>
          <evan-loading></evan-loading>
        </div>
      </template>
      <template v-slot:footer
        v-if="
          !binding &&
          reactiveRefs.ensActions &&
          reactiveRefs.ensField &&
          !reactiveRefs.ensActions.purchasing
        ">
        <div class="footer">
          <button type="submit"
            id="dt-map-check-ens"
            class="btn btn-rounded btn-primary"
            @click="checkAddress()"
            :disabled="!lookupForm.isValid || reactiveRefs.ensActions.loading">
            {{ '_digitaltwins.map-ens.check-ens' | translate }}
            <div class="spinner-border spinner-border-sm text-light ml-3"
              v-if="reactiveRefs.ensActions.loading || reactiveRefs.ensActions.purchasing">
            </div>
            <i class="mdi mdi-arrow-right label ml-3" v-else></i>
          </button>
        </div>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './map.ts';
  export default Component;
</script>
