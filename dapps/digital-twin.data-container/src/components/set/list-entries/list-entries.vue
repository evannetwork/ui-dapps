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
    <evan-loading v-if="loading"></evan-loading>
    <div class="white-box border-smooth rounded" v-else>
      <div class="header">
        <h3 class="m-0 font-weight-semibold">
          {{ '_digitaltwins.breadcrumbs.list-entries' | translate }}
        </h3>
        <span class="mx-auto"></span>
        <div>
          <dc-set-actions
            :containerAddress="containerAddress"
            :entryName="entryName"
            :displayMode="'buttons'"
            :setActions="true"
            :schemaActions="true"
            :listActions="true">
          </dc-set-actions>
        </div>
      </div>
      <table
        id="entry-list-table"
        class="evan-flex-table">
        <thead>
          <tr class="text-muted" v-if="itemType === 'object'">
            <th class="flex-grow-0">#</th>
            <th class="flex-grow-1"
              v-for="(key, keyIndex) in Object.keys(templateEntry.dataSchema.items.properties)">
              {{ key }}
            </th>
            <th class="flex-grow-0" style="min-width: 65px;"></th>
          </tr>
          <tr class="text-muted" v-else>
            <th class="flex-grow-0">#</th>
            <th class="flex-grow-1">{{ '_datacontainer.list.data' | translate }}</th>
            <th class="flex-grow-0" style="min-width: 65px;"></th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(listEntry, index) in [ ].concat(dispatcherEntries, templateEntry.value, listEntries)">
            <td class="font-weight-semibold flex-grow-0">
              {{ index + 1}}
            </td>
            <template v-if="itemType === 'object'">
              <td class="flex-grow-1"
                v-for="(key, keyIndex) in Object.keys(templateEntry.dataSchema.items.properties)">
                <dc-field
                  :id="`list-value-${ index }`"
                  :schema="templateEntry.dataSchema.items.properties[key]"
                  :control="{ value: listEntry[key] }"
                  :mode="'view'"
                  :standalone="false">
                </dc-field>
              </td>
            </template>
            <td class="flex-grow-1"
              v-else>
              <dc-field
                :schema="templateEntry.dataSchema.items"
                :control="{ value: listEntry }"
                :mode="'view'"
                :standalone="false">
              </dc-field>
            </td>
            <td
              class="flex-grow-0"
              style="min-width: 65px;">
              <div class="spinner-border spinner-border-sm text-secondary"
                v-if="listEntry.loading">
              </div>
            </td>
            <!-- <td class="text-primary flex-grow-0"
              style="white-space: nowrap;">
              <template
                id="entry-list-remove"
                v-if="!saving && templateEntry.value.indexOf(listEntry) !== -1">
                <i class="mdi mdi-delete clickable"
                  :disabled="saving"
                  @click="templateEntry.value.splice(index, 1)">
                </i>
              </template>
            </td> -->
          </tr>
        </tbody>
        <evan-loading v-if="loading"></evan-loading>
        <div class="text-center mt-3"
          v-if="contractAddress && !loading">
          <h5 class="mt-3">
            <b>
              {{ '_datacontainer.list.results' | translate }}
            </b>:
            {{ offset + templateEntry.value.length }} / {{ maxListentries + templateEntry.value.length }}
          </h5>

          <button
            id="entry-list-load-more"
            type="submit" class="btn btn-rounded btn-outline-secondary mt-3"
            v-if="offset < maxListentries"
            @click="loadEntries()">
            {{ `_datacontainer.list.load-more` | translate }}
          </button>
        </div>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './list-entries.ts';
  export default Component;
</script>
