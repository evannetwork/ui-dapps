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
    <div class="d-flex align-items-start" v-else>
      <div class="form-group flex-grow-1">
        <label for="address">
          <slot name="label">
            {{ '_digitaltwins.lookup.address.title' | translate }}
          </slot>
        </label>
        <input class="form-control" required
          id="address" ref="address"
          :placeholder="`_digitaltwins.lookup.address.desc` | translate"
          v-model="lookupForm.address.value"
          :class="{ 'is-invalid' : lookupForm.address.error }"
          @blur="lookupForm.address.setDirty()">
        <div class="invalid-feedback">
          {{ `_digitaltwins.lookup.address.error` | translate }}
        </div>
      </div>
      <select class="form-control custom-select only-arrows"
        id="evan-dt-ens-select" ref="myTwins"
        v-if="myTwins.length > 0"
        v-model="lookupForm.address.value"
        @change="$refs.address.focus()">
        <option
          v-for="(twin, index) in myTwins"
          :value="twin">
          {{ twin }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './field.ts';
  export default Component;
</script>
