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
  <div class="white-box border rounded" v-if="!loading">
    <div class="header"
      :class="modes.indexOf('schema') !== -1 || modes.indexOf('edit') !== -1 ? 'px-5 py-4' : 'p-5'">
      <h3 class="m-0 font-weight-semibold" v-if="entry.mode !== 'schema'">
        {{ '_datacontainer.types.object' | translate }}: {{ entryName }}
      </h3>
      <h3 class="m-0 font-weight-semibold" v-else>
        {{ '_datacontainer.edit-schema' | translate }}
      </h3>

      <span class="mx-auto"></span>

      <div class="spinner-border spinner-border-sm mr-3"
        v-if="$store.state.saving">
      </div>
      
      <template v-else>
        <button
          id="entry-schema-edit"
          type="button" class="btn btn-outline-secondary btn-circle"
          v-if="modes.indexOf('schema') !== -1 && entry.mode === 'edit'"
          @click="entry.mode = 'schema'">
          <i class="mdi mdi-cogs"></i>
        </button>
        <button
          id="entry-edit"
          type="button" class="btn btn-primary btn-rounded"
          v-if="(modes.indexOf('edit') !== -1 || modes.indexOf('schema') !== -1) && entry.mode === 'view'"
          @click="entry.mode = 'edit'">
          {{ `_datacontainer.field.edit` | translate }}
          <i class="mdi mdi-arrow-right label"></i>
        </button>
      </template>
    </div>
    <dc-ajv
      :mode="entry.mode"
      :properties="entry.edit.dataSchema.properties"
      :value="entry.edit.value"
      @init="$set(reactiveRefs, 'ajv', $event)">
    </dc-ajv>

    <div class="footer"
      style="margin-top: -25px"
      v-if="reactiveRefs.ajv && (entry.mode === 'schema' || entry.mode === 'edit')">
      <button
        id="entry-cancel"
        class="btn btn-outline-secondary btn-rounded mr-3"
        @click="reset()">
        {{ '_datacontainer.ajv.reset-values' | translate }}
      </button>
      <button 
        id="entry-save"
        class="btn btn-primary btn-rounded"
        :disabled="!reactiveRefs.ajv.isValid"
        @click="save()">
        {{ `_datacontainer.ajv.save.${ entry.mode }` | translate }}
        <i class="mdi mdi-arrow-right label ml-2"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './object.ts';
  export default Component;
</script>
