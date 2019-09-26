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
  <evan-modal
    id="list-entry-add-modal"
    ref="listEntryAddModal"
    :maxWidth="'1200px'">
    <template v-slot:header>
      <h5 class="modal-title">
        {{ `_datacontainer.list.add-list-entry` | translate }}
      </h5>
    </template>
    <template v-slot:body>
      <div id="entry-list-add">
        <dc-ajv-values
          v-if="itemType === 'object'"
          :address="containerAddress"
          :properties="entry.dataSchema.items.properties"
          :value="entry.edit.value"
          :mode="'edit'"
          @init="$set(reactiveRefs, 'addAjv', $event)">
        </dc-ajv-values>
        <dc-field
          class="p-3"
          v-else
          :control="addListEntryForm.value"
          :description="`_datacontainer.types.${ itemType }`"
          :label="`_datacontainer.entry.value.title`"
          :mode="'edit'"
          :schema="entry.dataSchema.items"
          :standalone="true">
        </dc-field>
      </div>
    </template>
    <template v-slot:footer>
      <button
        id="entry-save"
        type="submit" class="btn  btn-primary"
        :disabled="itemType === 'object' ?
          (!reactiveRefs.addAjv || !reactiveRefs.addAjv.isValid) :
          !addListEntryForm.isValid"
        @click="addEntry()">
        {{ `_datacontainer.list.add-list-entry` | translate }}
        <i class="mdi mdi-arrow-right label ml-2"></i>
      </button>
    </template>
  </evan-modal>
</template>

<script lang="ts">
  import Component from './new-list-entry.ts';
  export default Component;
</script>