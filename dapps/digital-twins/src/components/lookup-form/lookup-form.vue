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
    <evan-modal ref="lookupModal">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_digitaltwins.lookup.${ lookupModalScope }.title` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <p class="text-left m-0"
          v-html="$t(`_digitaltwins.lookup.${ lookupModalScope }.desc`, modalParams)">
        </p>
      </template>
      <template v-slot:footer>
        <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
         v-if="lookupModalScope === 'create'"
          @click="createDigitalTwin()">
          {{ `_digitaltwins.lookup.${ lookupModalScope }.action` | translate }}
        </button>
        <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
         v-if="lookupModalScope === 'purchase'"
          @click="purchaseAdress();">
          {{ `_digitaltwins.lookup.${ lookupModalScope }.action` | translate }}
        </button>
      </template>
    </evan-modal>

    <form class="p-3"
      v-if="Object.keys(purchasingInstances).length === 0"
      v-on:submit.prevent="checkAddress">
      <div class="form-group">
        <label for="address">
          {{ `_digitaltwins.lookup.address.title` | translate }}
        </label>
        <input class="form-control" required
          id="address" ref="address"
          :placeholder="`_digitaltwins.lookup.address.desc` | translate"
          v-model="lookupForm.address.value"
          v-bind:class="{ 'is-invalid' : lookupForm.address.error }"
          @blur="lookupForm.address.setDirty()">
        <div class="invalid-feedback">
          {{ `_digitaltwins.lookup.address.error` | translate }}
        </div>
      </div>

      <div class="text-center mt-3 w-100">
        <button type="submit"
          class="btn btn-rounded btn-primary"
          :disabled="!lookupForm.isValid || checking">
          <div class="spinner-border spinner-border-sm text-light mr-3"
            v-if="checking">
          </div>
          {{ `_digitaltwins.lookup.title` | translate }}
        </button>
      </div>
    </form>
    <div class="text-center" v-else>
      <h4 class="mt-5 mb-3">{{ '_digitaltwins.lookup.purchasing' | translate }}</h4>
      <b>
        {{
          Object.keys(purchasingInstances)
            .map(key => purchasingInstances[key].data.ensAddress)
            .join(', ')
        }}
      </b>
      <evan-loading></evan-loading>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './lookup-form.ts';
  export default Component;
</script>
