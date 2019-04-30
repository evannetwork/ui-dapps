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
  <div class="white-box border rounded">
    <div class="header"
      :class="modes.indexOf('schema') !== -1 || modes.indexOf('edit') !== -1 ? 'px-5 py-4' : 'p-5'">
      <h3 class="m-0 font-weight-semibold" v-if="!addListEntry && entry.mode !== 'schema'">
        {{ '_datacontainer.types.array' | translate }}: {{ entryName }}
      </h3>
      <h3 class="m-0 font-weight-semibold" v-if="addListEntry">
        {{ '_datacontainer.list.add-list-entry' | translate }}
      </h3>
      <h3 class="m-0 font-weight-semibold" v-if="entry.mode === 'schema'">
        {{ '_datacontainer.edit-schema' | translate }}
      </h3>

      <span class="mx-auto"></span>

      <div class="spinner-border spinner-border-sm mr-3"
        v-if="$store.state.saving">
      </div>
      
      <template v-else>
        <template v-if="entry.mode !== 'schema'">
          <template v-if="entry.dataSchema.items.type === 'object' && !addListEntry">
            <button type="button" class="btn btn-outline-secondary btn-circle mr-3"
              v-if="modes.indexOf('schema') !== -1 && entry.mode !== 'schema'"
              @click="$set(entry, 'mode', 'schema')">
              <i class="mdi mdi-cogs"></i>
            </button>
          </template>
          <template v-if="modes.indexOf('edit') !== -1 || modes.indexOf('schema') !== -1">
            <button type="submit" class="btn btn-rounded btn-primary"
              v-if="!addListEntry"
              :disabled="$store.state.saving"
              @click="addListEntry = true">
              {{ `_datacontainer.list.add-list-entry` | translate }}
              <i class="mdi mdi-arrow-right label"></i>
            </button>
          </template>
        </template>
      </template>
    </div>
    <template v-if="entry.mode === 'schema' && entry.dataSchema.items.type === 'object'">
      <dc-ajv
        :mode="entry.mode"
        :properties="entry.edit.dataSchema.items.properties"
        @init="$set(reactiveRefs, 'schemaAjv', $event)">
      </dc-ajv>
      <div class="footer" v-if="reactiveRefs.schemaAjv">
        <button class="btn btn-outline-secondary btn-rounded mr-3"
          @click="resetSchema()">
          {{ '_datacontainer.ajv.reset-values' | translate }}
        </button>
        <button class="btn btn-primary btn-rounded"
          :disabled="!reactiveRefs.schemaAjv.isValid"
          @click="saveSchema()">
          {{ `_datacontainer.ajv.save.schema` | translate }}
          <i class="mdi mdi-arrow-right label ml-2"></i>
        </button>
      </div>
    </template>
    <template v-else>
      <template v-if="!addListEntry">
        <table class="evan-flex-table">
          <thead>
            <tr class="text-muted">
              <th class="flex-grow-0">#</th>
              <th class="flex-grow-1">{{ '_datacontainer.list.data' | translate }}</th>
              <th class="flex-grow-0"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(listEntry, index) in [ ].concat(entry.value, listEntries)">
              <td class="font-weight-semibold flex-grow-0">
                {{ index + 1}}
              </td>
              <td class="flex-grow-1">
                <template v-if="entry.dataSchema.items.type === 'object'">
                  <div
                    v-for="(key, keyIndex) in Object
                      .keys(listEntry)
                      .slice(0, !expandListEntries[index] ? 5 : 100)">
                    <b style="white-space: nowrap;">{{ key }}</b>:
                    <dc-field
                      :schema="entry.dataSchema.items.properties[key]"
                      :control="{ value: listEntry[key] }"
                      :mode="'view'"
                      :standalone="false">
                    </dc-field>
                  </div>
                  <button class="btn text-secondary p-0"
                    v-if="Object.keys(listEntry).length > 5"
                    @click="$set(expandListEntries, index, !expandListEntries[index])">
                    <template v-if="!expandListEntries[index]">
                      {{ '_datacontainer.list.show-more' | translate }}
                    </template>
                    <template v-else>
                      {{ '_datacontainer.list.show-less' | translate }}
                    </template>
                  </button>
                </template>
                <dc-field v-else
                  :schema="entry.dataSchema.items"
                  :control="{ value: listEntry }"
                  :mode="'view'"
                  :standalone="false">
                </dc-field>
              </td>
              <td class="text-primary flex-grow-0"
                style="white-space: nowrap;">
                <template v-if="!$store.state.saving && entry.value.indexOf(listEntry) !== -1">
                  <i class="mdi mdi-delete clickable"
                    :disabled="$store.state.saving"
                    @click="entry.value.splice(index, 1)">
                  </i>
                </template>
              </td>
            </tr>
          </tbody>
          <evan-loading v-if="loading"></evan-loading>
          <div class="text-center mt-3"
            v-if="contractAddress && entry.mode !== 'schema' && !loading">
            <h5 class="mt-3">
              <b>{{ '_datacontainer.list.results' | translate }}</b>: {{ offset + entry.value.length }} / {{ maxListentries + entry.value.length }}
            </h5>

            <button type="submit"  class="btn btn-rounded btn-outline-secondary mt-3"
              v-if="offset < maxListentries"
              @click="loadEntries()">
              {{ `_datacontainer.list.load-more` | translate }}
            </button>
          </div>
        </table>
      </template>

      <template v-else>
        <dc-ajv
          v-if="entry.dataSchema.items.type === 'object'"
          :mode="'edit'"
          :properties="entry.dataSchema.items.properties"
          :value="entry.edit.value"
          @init="$set(reactiveRefs, 'addAjv', $event)">
        </dc-ajv>
        <dc-field
          v-else
          :schema="entry.dataSchema.items"
          :control="addListEntryForm.value"
          :mode="'edit'"
          :standalone="true">
        </dc-field>

        <div class="footer">
          <button type="submit" class="btn btn-rounded btn-outline-secondary mr-3"
            @click="addListEntry = false">
            {{ `_datacontainer.list.canel-list-entry` | translate }}
          </button>

          <button type="submit" class="btn btn-rounded btn-primary"
            :disabled="entry.dataSchema.items.type === 'object' ?
              (!reactiveRefs.addAjv || !reactiveRefs.addAjv.isValid) :
              !addListEntryForm.isValid"
            @click="addEntry()">
            {{ `_datacontainer.list.add-list-entry` | translate }}
            <i class="mdi mdi-arrow-right label ml-2"></i>
          </button>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './list.ts';
  export default Component;
</script>
