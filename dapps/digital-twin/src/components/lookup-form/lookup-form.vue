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
    <evan-loading v-if="loading"></evan-loading>
    <template v-else>
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

      <template v-if="Object.keys(purchasingInstances).length === 0">
        <div class="content">
          <form
            class="col-sm-9 mx-auto"
            v-on:submit.prevent="checkAddress">
            <div class="d-flex align-items-start">
              <div class="form-group flex-grow-1">
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
              <select class="form-control custom-select only-arrows"
                v-if="myTwins.length > 0"
                id="myTwins" ref="myTwins"
                v-model="lookupForm.address.value">
                <option
                  v-for="(twin, index) in myTwins"
                  :value="twin">
                  {{ twin }}
                </option>
              </select>
            </div>

            <slot name="description"></slot>
          </form>
        </div>

        <div class="footer">
          <button type="submit"
            class="btn btn-rounded btn-primary"
            @click="checkAddress()"
            :disabled="!lookupForm.isValid || checking">
            {{ `_digitaltwins.lookup.title` | translate }}
            <i class="mdi mdi-arrow-right label ml-3"></i>
            <div class="spinner-border spinner-border-sm text-light mr-3"
              v-if="checking">
            </div>
          </button>
        </div>
      </template>
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
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './lookup-form.ts';
  export default Component;
</script>
