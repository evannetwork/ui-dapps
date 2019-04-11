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
    <div class="d-flex p-3 align-items-center border-bottom">
      <h4 class="m-0" v-if="!addListEntry && mode !== 'schema'">
        {{ '_datacontainer.types.array' | translate }}: {{ listName }}
      </h4>
      <h4 class="m-0" v-if="addListEntry">
        {{ '_datacontainer.list.add-list-entry' | translate }}
      </h4>
      <h4 class="m-0" v-if="mode === 'schema'">
        {{ '_datacontainer.edit-schema' | translate }}
      </h4>

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
            </button>

            <template v-else>
              <button type="submit" class="btn btn-rounded btn-outline-secondary mr-3"
                @click="addListEntry = false">
                {{ `_datacontainer.list.canel-list-entry` | translate }}
              </button>

              <button type="submit" class="btn btn-rounded btn-primary"
                @click="addEntry()">
                {{ `_datacontainer.list.add-list-entry` | translate }}
              </button>
            </template>
          </template>
        </template>

        <template v-if="entry.dataSchema.items.type === 'object' && !addListEntry">
          <button type="button" class="btn btn-outline-secondary btn-circle"
            v-if="modes.indexOf('schema') !== -1 && mode !== 'schema'"
            @click="mode = 'schema'">
            <i class="fas fa-cogs"></i>
          </button>
          <button type="button" class="btn btn-primary btn-circle"
            v-if="mode === 'schema'"
            @click="mode = 'view'">
            <i class="fas fa-save"></i>
          </button>
        </template>
      </template>
    </div>
    <div class="px-3 pb-3">
      <template v-if="mode === 'schema'">
        <dt-ajv
          v-if="entry.dataSchema.items.type === 'object'"
          :enableValue="false"
          :mode="mode"
          :properties="entry.dataSchema.items.properties">
        </dt-ajv>
      </template>
      <template v-else>
        <template v-if="!addListEntry">
          <div class="evan-table table-responsive-md border-0 p-0">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{{ '_datacontainer.list.data' | translate }}</th>
                  <th style="width: 50px"></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(listEntry, index) in [ ].concat(entry.value, listEntries)">
                  <tr v-if="index !== 0">
                    <td class="p-2"></td>
                  </tr>
                  <tr>
                    <td>
                      {{ index + 1}}
                    </td>
                    <td>
                      {{ listEntry }}
                    </td>
                    <td class="text-primary" style="width: 50px">
                      <span v-if="entry.value.indexOf(listEntry) !== -1">
                        {{ '_datacontainer.list.new' | translate }}
                      </span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <evan-loading v-if="loading"></evan-loading>
          </div>

          <div class="text-center"
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
            :value.sync="entry.addValue">
          </dt-field>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './list.ts';
  export default Component;
</script>
