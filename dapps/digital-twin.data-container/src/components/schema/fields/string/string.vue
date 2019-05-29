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
  <div class="form-group mb-0" v-if="mode === 'schema' || mode === 'edit'">
    <label for="value" v-if="standalone">
      {{ `_datacontainer.ajv.value.title` | translate }}
    </label>
    <input class="form-control" required
      id="value" ref="value" type="text"
      :placeholder="`_datacontainer.ajv.value.desc` | translate"
      :disabled="$store.state.saving"
      v-model="control.value"
      :class="{ 'is-invalid' : control.error }"
      @blur="control.setDirty()">
    <div class="invalid-feedback">
      {{ `_datacontainer.ajv.value.error` | translate }}
    </div>
  </div>
  <span :id="id" class="text-primary" v-else>
    {{ control.value }}
  </span>
</template>

<script lang="ts">
  import Component from './string.ts';
  export default Component;
</script>
