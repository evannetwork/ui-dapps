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
    <evan-modal ref="notRegistered">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_digitaltwins.lookup.error.title` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <p class="text-left m-0"
          v-html="$t(`_digitaltwins.lookup.error.desc`, modalParams)">
        </p>
      </template>
    </evan-modal>

    <evan-modal
      id="twin-open"
      ref="twinOpen"
      :maxWidth="'800px'">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_digitaltwins.lookup.title` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <form
          class="mx-5"
          v-on:submit.prevent="checkAddress">
          <dt-ens-field
            @init="$set(reactiveRefs, 'ensField', $event)"
            :autocomplete="true">
          </dt-ens-field>
          <div class="d-flex mt-3 align-items-center">
            <i class="mdi mdi-fingerprint text-secondary mr-3" style="font-size: 60px;"></i>
            <p class="m-0 text-justify">
              {{ `_digitaltwins.lookup.description` | translate }}
            </p>
          </div>
        </form>
        <template v-if="reactiveRefs.ensField">
          <dt-ens-actions
            :address="reactiveRefs.ensField.lookupForm.address.value"
            @init="$set(reactiveRefs, 'ensActions', $event)"
            @open="openTwin"
            @create="$refs.notRegistered.show();">
          </dt-ens-actions>
        </template>
      </template>
      <template v-slot:footer
        v-if="reactiveRefs.ensActions">
        <button type="submit"
          class="btn btn-rounded btn-primary"
          id="dt-lookup"
          @click="checkAddress()"
          :disabled="!reactiveRefs.ensField.lookupForm.isValid || reactiveRefs.ensActions.loading">
          {{ '_digitaltwins.lookup.title' | translate }}
          <div class="spinner-border spinner-border-sm text-light ml-3"
            v-if="reactiveRefs.ensActions.loading">
          </div>
          <i class="mdi mdi-arrow-right label ml-3" v-else></i>
        </button>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './open.ts';
  export default Component;
</script>
