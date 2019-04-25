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
  <div :class="{ 'white-box border rounded': _standalone && !integrated }"
    :style="_standalone ? '' : 'display: inline'">
    <div class="header" v-if="_standalone && !integrated">
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
        <template v-if="modes && modes.indexOf('edit') !== -1 || modes.indexOf('schema') !== -1">
          <button type="button" class="btn btn-outline-secondary btn-circle"
            v-if="mode === 'view'"
            @click="mode = 'edit'">
            <i class="mdi mdi-pencil"></i>
          </button>
        </template>
      </template>
    </div>
    <div
      :class="{ 'content': _standalone }"
      :style="_standalone ? '' : 'display: inline'">
      <component
        :is="`dt-field-${ type }`"
        :control="fieldForm.value"
        :mode="mode"
        :standalone="_standalone">
      </component>
    </div>
    <div class="footer" v-if="_standalone && !integrated && !$store.state.saving && mode !== 'view'">
      <button class="btn btn-primary btn-rounded"
        :disabled="!fieldForm.isValid"
        @click="mode = 'view'">
        {{ '_datacontainer.ajv.save' | translate }}
        <i class="mdi mdi-arrow-right label ml-2"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './field.ts';
  export default Component;
</script>
