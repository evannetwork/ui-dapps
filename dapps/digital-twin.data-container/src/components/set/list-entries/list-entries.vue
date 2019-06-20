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
    <div class="white-box border-smooth rounded"
      v-else-if="error || !permitted">
      <div class="header">
        <h3 class="m-0 font-weight-semibold">
          {{ '_datacontainer.no-permissions.title' | translate }}
        </h3>
      </div>
      <p class="content"
        v-html="$t('_datacontainer.no-permissions.desc')">
      </p>
    </div>
    <div class="white-box border-smooth rounded" v-else>
      <div class="table-scroll-container">
        <table
          id="entry-list-table"
          class="evan-table no-wrap w-100">
          <thead>
            <tr class="text-muted" v-if="itemType === 'object'">
              <th
                style="white-space: nowrap;">
                #
              </th>
              <th
                v-for="(key, keyIndex) in Object.keys(templateEntry.dataSchema.items.properties)"
                style="min-width: 200px;">
                {{ key }}
                <evan-tooltip :placement="'bottom'">
                  {{ key }}
                </evan-tooltip>
              </th>
              <th style="min-width: 65px;"></th>
            </tr>
            <tr class="text-muted" v-else>
              <th>#</th>
              <th>{{ '_datacontainer.list.data' | translate }}</th>
              <th style="min-width: 65px;"></th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(listEntry, index) in [ ].concat(dispatcherEntries, listEntries)">
              <td class="font-weight-semibold"
                style="white-space: nowrap;">
                <span>{{ index + 1}}</span>
              </td>
              <template v-if="itemType === 'object'">
                <td
                  v-for="(key, keyIndex) in Object.keys(templateEntry.dataSchema.items.properties)">
                  <dc-field
                    :id="`list-value-${ index }`"
                    :schema="templateEntry.dataSchema.items.properties[key]"
                    :control="{ value: listEntry.data[key] }"
                    :mode="'view'"
                    :standalone="false">
                  </dc-field>
                </td>
              </template>
              <td v-else>
                <dc-field
                  :schema="templateEntry.dataSchema.items"
                  :control="{ value: listEntry.data }"
                  :mode="'view'"
                  :standalone="false">
                </dc-field>
              </td>
              <td
                style="min-width: 65px;">
                <div class="spinner-border spinner-border-sm text-secondary"
                  v-if="listEntry.loading">
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-center my-3">
        <h5 class="mt-3">
          <b>
            {{ '_datacontainer.list.results' | translate }}
          </b>:
          {{ offset + templateEntry.value.length }} / {{ maxListentries + templateEntry.value.length }}
        </h5>

        <evan-loading v-if="loadingEntries"></evan-loading>
        <button
          id="entry-list-load-more"
          type="submit" class="btn btn-rounded btn-outline-secondary mt-3"
          v-else-if="offset < maxListentries"
          @click="loadEntries()">
          {{ `_datacontainer.list.load-more` | translate }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './list-entries.ts';
  export default Component;
</script>
