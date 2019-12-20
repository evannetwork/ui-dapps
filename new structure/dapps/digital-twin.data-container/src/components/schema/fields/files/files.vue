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
      <evan-file-input
        v-if="control.value && control.value.files"
        :id="id" ref="value"
        :disabled="$store.state.saving || mode === 'view'"
        :class="{ 'is-invalid' : control._error }"
        v-model="control.value.files"
        @input="control.setDirty(); control.value = control.value;">
      </evan-file-input>
      <div class="invalid-feedback d-block" v-if="control._error">
        {{ control._error === true ? (`_datacontainer.ajv.value.error` | translate) : control._error }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './files.ts';
  export default Component;
</script>
