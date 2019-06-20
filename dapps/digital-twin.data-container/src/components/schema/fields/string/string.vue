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
  <div class="dc-field form-group mb-0"
    :class="{ 'one-line': oneLine }">
    <label for="value"
      v-if="standalone"
      :class="{'d-block': !oneLine, }">
      {{ label | translate }}
    </label>
    <div>
      <template v-if="mode === 'schema' || mode === 'edit'">
        <input class="form-control" required
          id="value" ref="value" type="text"
          :placeholder="description | translate"
          :disabled="$store.state.saving"
          v-model="control.value"
          :class="{ 'is-invalid' : control._error }"
          @blur="control.setDirty()">
        <div class="invalid-feedback">
          {{ control._error === true ? (`_datacontainer.ajv.value.error` | translate) : control._error }}
        </div>
      </template>
      <a class="overflow-multiline line-10"
        v-else-if="isContract"
        :id="id"
        :href="`${ dapp.baseUrl }/${ dapp.rootEns }/digitaltwins.${ dapp.domainName }/datacontainer.digitaltwin.${ dapp.domainName }/${ control.value }`">
        <template v-if="contractTitle">
          {{ contractTitle }} ({{ control.value }})
        </template>
        <template v-else>
          {{ control.value }}
        </template>
      </a>
      <span class="overflow-multiline line-10" :id="id" v-else>
        {{ control.value }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './string.ts';
  export default Component;
</script>
