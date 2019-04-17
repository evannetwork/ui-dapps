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
    <div class="d-flex border-bottom border-sm align-items-center"
      :class="modes.indexOf('schema') !== -1 || modes.indexOf('edit') !== -1 ? 'px-5 py-4' : 'p-5'"
      v-if="standalone">
      <h3 class="m-0 font-weight-semibold" v-if="mode === 'view'">
        {{ `_datacontainer.types.${ type }` | translate }}: {{ fieldName }}
      </h3>
      <h3 class="m-0 font-weight-semibold" v-else>
        {{ '_datacontainer.edit' | translate }}
      </h3>

      <span class="mx-auto"></span>

      <div class="spinner-border spinner-border-sm text-light mr-3"
        v-if="$store.state.saving">
      </div>
      
      <template v-else>
        <template v-if="modes.indexOf('edit') !== -1 || modes.indexOf('schema') !== -1">
          <button type="button" class="btn btn-outline-secondary btn-circle"
            v-if="mode === 'view'"
            @click="mode = 'edit'">
            <i class="mdi mdi-pencil"></i>
          </button>
        </template>
      </template>
    </div>
    <div :class="{ 'p-3': standalone }">
      <dt-field-files v-if="type === 'files'" :control="fieldForm.value" :mode="mode" :standalone="standalone"></dt-field-files>
      <dt-field-images v-if="type === 'images'" :control="fieldForm.value" :mode="mode" :standalone="standalone"></dt-field-images>
      <dt-field-number v-if="type === 'number'" :control="fieldForm.value" :mode="mode" :standalone="standalone"></dt-field-number>
      <dt-field-string v-if="type === 'string'" :control="fieldForm.value" :mode="mode" :standalone="standalone"></dt-field-string>

      <div class="mb-3 text-center" v-if="standalone && !$store.state.saving && mode !== 'view'">
        <button class="btn btn-primary btn-rounded"
          @click="mode = 'view'">
          {{ '_datacontainer.ajv.save' | translate }}
          <i class="mdi mdi-arrow-right label ml-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './field.ts';
  export default Component;
</script>
