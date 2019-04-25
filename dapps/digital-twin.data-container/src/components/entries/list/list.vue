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
      <h3 class="m-0 font-weight-semibold" v-if="!addListEntry && mode !== 'schema'">
        {{ '_datacontainer.types.array' | translate }}: {{ listName }}
      </h3>
      <h3 class="m-0 font-weight-semibold" v-if="addListEntry">
        {{ '_datacontainer.list.add-list-entry' | translate }}
      </h3>
      <h3 class="m-0 font-weight-semibold" v-if="mode === 'schema'">
        {{ '_datacontainer.edit-schema' | translate }}
      </h3>

      <span class="mx-auto"></span>

      <div class="spinner-border spinner-border-sm text-light mr-3"
        v-if="$store.state.saving">
      </div>
      
      <template v-else>
        <template v-if="mode !== 'schema'">
          <template v-if="modes.indexOf('edit') !== -1 || modes.indexOf('schema') !== -1">
            <button type="submit" class="btn btn-rounded btn-primary mr-3"
              v-if="!addListEntry"
              :disabled="$store.state.saving"
              @click="addListEntry = true">
              {{ `_datacontainer.list.add-list-entry` | translate }}
              <i class="mdi mdi-arrow-right label"></i>
            </button>
          </template>
        </template>

        <template v-if="entry.dataSchema.items.type === 'object' && !addListEntry">
          <button type="button" class="btn btn-outline-secondary btn-circle"
            v-if="modes.indexOf('schema') !== -1 && mode !== 'schema'"
            @click="mode = 'schema'">
            <i class="mdi mdi-cogs"></i>
          </button>
        </template>
      </template>
    </div>
    <div>
      <template v-if="mode === 'schema'">
        <template v-if="entry.dataSchema.items.type === 'object'">
          <dt-ajv
            ref="ajvComp"
            :enableValue="false"
            :mode="mode"
            :properties="entry.dataSchema.items.properties">
          </dt-ajv>
          <!-- 
          {{ Object.keys($refs) }}
          <div class="footer" v-if="$refs.ajvComp">
            <button class="btn btn-primary btn-rounded"
              :disabled="!$refs.ajvComp.isValid"
              @click="mode = 'view'">
              {{ '_datacontainer.ajv.save' | translate }}
              <i class="mdi mdi-arrow-right label ml-2"></i>
            </button>
          </div> -->
        </template>
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
                      v-for="(key, index) in Object
                        .keys(listEntry)
                        .slice(0, !expandListEntries[i] ? 5 : 100)">
                      <b style="white-space: nowrap;">{{ key }}</b>:
                      <dt-field
                        :mode="'view'"
                        :modes="[ 'view' ]"
                        :form="{ value: { value: listEntry[key] }}"
                        :type="entry.dataSchema.items.properties[key].type">
                      </dt-field>
                    </div>
                    <button class="btn text-secondary p-0"
                      v-if="Object.keys(listEntry).length > 5"
                      @click="$set(expandListEntries, i, !expandListEntries[i])">
                      <template v-if="!expandListEntries[i]">
                        {{ '_datacontainer.list.show-more' | translate }}
                      </template>
                      <template v-else>
                        {{ '_datacontainer.list.show-less' | translate }}
                      </template>
                    </button>
                  </template>
                  <dt-field v-else
                    :mode="'view'"
                    :type="entry.dataSchema.items.type"
                    :value.sync="listEntry"
                    :standalone="false">
                  </dt-field>
                </td>
                <td class="text-primary flex-grow-0"
                  style="white-space: nowrap;">
                  <template v-if="entry.value.indexOf(listEntry) !== -1">
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
              v-if="contractAddress && mode !== 'schema' && !loading">
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
          <dt-ajv
            v-if="entry.dataSchema.items.type === 'object'"
            :enableValue="true"
            :mode="'edit'"
            :properties="entry.dataSchema.items.properties"
            :value="entry.addValue">
          </dt-ajv>
          <dt-field
            v-else
            :mode="'edit'"
            :type="entry.dataSchema.items.type"
            :value.sync="entry.addValue"
            :integrated="true">
          </dt-field>

          <div class="footer" v-if="addListEntry">
            <button type="submit" class="btn btn-rounded btn-outline-secondary mr-3"
              @click="addListEntry = false">
              {{ `_datacontainer.list.canel-list-entry` | translate }}
            </button>

            <button type="submit" class="btn btn-rounded btn-primary"
              @click="addEntry()">
              {{ `_datacontainer.list.add-list-entry` | translate }}
              <i class="mdi mdi-arrow-right label ml-2"></i>
            </button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './list.ts';
  export default Component;
</script>
