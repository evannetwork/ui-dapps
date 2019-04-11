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
    <div class="d-flex p-3 align-items-center border-bottom"
      v-if="standalone">
      <h4 class="m-0" v-if="mode === 'view'">
        {{ `_datacontainer.types.${ type }` | translate }}: {{ fieldName }}
      </h4>
      <h4 class="m-0" v-else>
        {{ '_datacontainer.edit' | translate }}
      </h4>

      <span class="mx-auto"></span>

      <div class="spinner-border spinner-border-sm text-light mr-3"
        v-if="$store.state.saving">
      </div>
      
      <template v-else>
        <button type="button" class="btn btn-outline-secondary btn-circle"
          v-if="mode !== 'schema'"
          @click="mode = 'schema'">
          <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="btn btn-primary btn-circle"
          v-else
          @click="mode = 'view'">
          <i class="fas fa-save"></i>
        </button>
      </template>
    </div>
    <div :class="{ 'p-3': standalone }">
      <dt-field-files v-if="type === 'files'" :control="fieldForm.value" :mode="mode" :standalone="standalone"></dt-field-files>
      <dt-field-images v-if="type === 'images'" :control="fieldForm.value" :mode="mode" :standalone="standalone"></dt-field-images>
      <dt-field-number v-if="type === 'number'" :control="fieldForm.value" :mode="mode" :standalone="standalone"></dt-field-number>
      <dt-field-string v-if="type === 'string'" :control="fieldForm.value" :mode="mode" :standalone="standalone"></dt-field-string>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './field.ts';
  export default Component;
</script>
