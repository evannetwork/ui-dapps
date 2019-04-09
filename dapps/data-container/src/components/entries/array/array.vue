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
  <div class="p-3">
    {{ entry }}
    <template v-if="mode === 'schema'">
      <div class="form-group mb-0">
        <label for="type">
          {{ `_datacontainer.ajv.type.name` | translate }}
        </label>
        <select class="form-control"
          id="type" ref="type"
          :placeholder="`_datacontainer.ajv.type.desc` | translate"
          :disabled="$store.state.saving"
          v-model="entry.dataSchema.items.type">
          <option
            v-for="(arrayType, index) in arrayTypes"
            :value="arrayType">
            {{ `_datacontainer.types.${ arrayType }` | translate }}
          </option>
        </select>
      </div>

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
                <th>{{ '_datacontainer.array.data' | translate }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(listEntry, index) in entry.value">
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
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="text-center mt-3"
          v-if="!addListEntry && mode !== 'view'">
          <button type="submit"  class="btn btn-rounded btn-primary"
            :disabled="$store.state.saving"
            @click="addListEntry = true">
            {{ `_datacontainer.array.add-list-entry` | translate }}
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
          :showLabel="true">
        </dt-field>

        <div class="text-center mt-3">
          <template v-if="addListEntry">
            <button type="submit"  class="btn btn-rounded btn-outline-secondary mr-3"
              @click="addListEntry = false">
              {{ `_datacontainer.array.canel-list-entry` | translate }}
            </button>
            <button type="submit" class="btn btn-rounded btn-primary"
              @click="addEntry()">
              {{ `_datacontainer.array.add-list-entry` | translate }}
            </button>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './array.ts';
  export default Component;
</script>
