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
    <div v-if="schemaEdit && (combinedType === 'files')">
      <label class="d-block">
        {{ !schemaEdit ? `_datacontainer.entry.value.title` : '_datacontainer.ajv.value.title' | translate }}
      </label>
      <span>
        {{ `_datacontainer.ajv.files-no-default` | translate }}
      </span>
    </div>
    <dc-field
      v-else
      :address="address"
      :control="fieldForm.value"
      :mode="activeMode"
      :standalone="true"
      :description="!schemaEdit ? `_datacontainer.types.${ type }` : '_datacontainer.ajv.value.desc'"
      :label="!schemaEdit ? `_datacontainer.entry.value.title` : '_datacontainer.ajv.value.title'"
      :type="combinedType">
    </dc-field>
    <template v-if="schemaEdit && (
      combinedType === 'files' ||
      combinedType === 'string' ||
      combinedType === 'number'
    )">
      <div class="form-group mt-3">
        <label for="min" class="d-block">
          {{ '_datacontainer.ajv.min.title' | translate }}
        </label>
        <span class="text-primary" v-if="activeMode !== 'schema'">
          {{ fieldForm.min.value || ('_datacontainer.ajv.empty' | translate) }}
        </span>
        <input class="form-control" type="number"
          v-else
          ref="min" id="min"
          v-model="fieldForm.min.value"
          :class="{ 'is-invalid' : fieldForm.min.error }"
          :disabled="$store.state.saving || activeMode !== 'schema'"
          :placeholder="`_datacontainer.ajv.min.desc` | translate"
          @blur="fieldForm.min.setDirty()">
        <div class="invalid-feedback">
          {{ `_datacontainer.ajv.max.error` | translate }}
        </div>
      </div>
      <div class="form-group">
        <label for="max" class="d-block">
          {{ '_datacontainer.ajv.max.title' | translate }}
        </label>
        <span class="text-primary" v-if="activeMode !== 'schema'">
          {{ fieldForm.max.value || ('_datacontainer.ajv.empty' | translate) }}
        </span>
        <input class="form-control" type="number"
          v-else
          ref="max" id="max"
          v-model="fieldForm.max.value"
          :class="{ 'is-invalid' : fieldForm.max.error }"
          :disabled="$store.state.saving || activeMode !== 'schema'"
          :placeholder="`_datacontainer.ajv.max.desc` | translate"
          @blur="fieldForm.max.setDirty()">
        <div class="invalid-feedback">
          {{ `_datacontainer.ajv.max.error` | translate }}
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './field.ts';
  export default Component;
</script>
