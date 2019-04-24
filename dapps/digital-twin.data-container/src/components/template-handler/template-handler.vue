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
    <template v-else>
      <evan-modal ref="cacheModal">
        <template v-slot:header>
          <h5 class="modal-title">
            {{ `_datacontainer.template-cache.title` | translate }}
          </h5>
        </template>
        <template v-slot:body>
          <p class="text-left m-0"
            v-html="$t(`_datacontainer.template-cache.desc`, modalParams)">
          </p>
        </template>
        <template v-slot:footer>
          <button type="button" class="btn btn-danger btn-rounded font-weight-normal"
            @click="clearCachedTemplate()">
            {{ `_datacontainer.template-cache.clear` | translate }}
            <i class="mdi mdi-delete label"></i>
          </button>
          <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
            @click="restoreTemplate()">
            {{ `_datacontainer.template-cache.action` | translate }}
            <i class="mdi mdi-arrow-right label"></i>
          </button>
        </template>
      </evan-modal>
      <div class="bg-level-1 p-3 border rounded d-flex flex-wrap">
        <div class="batch-label"
          v-for="(property, index) in Object.keys(template.properties)"
          :class="{ 'active': activeTab === index }"
          @click="activateTab(index)">
          {{ property }}
        </div>
        <div class="batch-label"
          :class="{ 'active': activeTab === -1 }"
          @click="activateTab(-1)">
          <i class="mdi mdi-plus-circle"></i>
        </div>

        <div class="batch-label animate-hop bg-primary bg-text-primary"
          v-if="cachedTemplate"
          @click="$refs.cacheModal.show()">
          <i class="mdi mdi-undo"></i>
        </div>
      </div>

      <template v-if="activeTab === -1">
        <div class="white-box border rounded mt-3">
          <div class="header">
            <h3 class="m-0 font-weight-semibold">
              {{ `_datacontainer.entry.add` | translate }}
            </h3>
          </div>

          <div class="content">
            <p class="mb-3">
              {{ `_datacontainer.entry.add-desc` | translate }}
            </p>

            <form v-on:submit.prevent="addEntry">
              <div class="form-group">
                <label for="type">
                  {{ `_datacontainer.entry.type.title` | translate }}
                </label>
                <select class="form-control custom-select"
                  id="type" ref="type"
                  :placeholder="`_datacontainer.entry.type.desc` | translate"
                  :disabled="$store.state.saving"
                  v-model="entryForm.type.value"
                  v-bind:class="{ 'is-invalid' : entryForm.type.error }"
                  @blur="entryForm.type.setDirty()">
                  <option
                    v-for="(entryType, index) in entryTypes"
                    :value="entryType">
                    {{ `_datacontainer.types.${ entryType }` | translate }}
                  </option>
                </select>
              </div>
              <div class="form-group" v-if="entryForm.type.value === 'array'">
                <label for="type">
                  {{ `_datacontainer.entry.array-type.title` | translate }}
                </label>
                <select class="form-control custom-select"
                  id="type" ref="type"
                  :placeholder="`_datacontainer.entry.array-type.desc` | translate"
                  :disabled="$store.state.saving"
                  v-model="entryForm.arrayType.value"
                  v-bind:class="{ 'is-invalid' : entryForm.arrayType.error }"
                  @blur="entryForm.arrayType.setDirty()">
                  <option
                    v-for="(arrayType, index) in arrayTypes"
                    :value="arrayType">
                    {{ `_datacontainer.types.${ arrayType }` | translate }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="name">
                  {{ `_datacontainer.entry.name.title` | translate }}
                </label>
                <input class="form-control" required
                  id="name" ref="name"
                  :placeholder="`_datacontainer.entry.name.desc` | translate"
                  :disabled="$store.state.saving"
                  v-model="entryForm.name.value"
                  v-bind:class="{ 'is-invalid' : entryForm.name.error }"
                  @blur="entryForm.name.setDirty()">
                <div class="invalid-feedback">
                  {{ `_datacontainer.entry.name.error` | translate }}
                </div>
              </div>
            </form>
          </div>
          <div class="footer">
            <button type="submit"
              class="btn btn-rounded btn-primary"
              @click="addEntry()"
              :disabled="!entryForm.isValid || $store.state.saving">
              {{ `_datacontainer.entry.add` | translate }}
              <i class="mdi mdi-arrow-right label ml-3"></i>
            </button>
          </div>
        </div>
      </template>

      <dt-entry
        v-if="activeTab > -1 && activeEntry"
        :address="address"
        :entry="activeEntry"
        :permissions="permissions"
        :name="activeEntryName">
      </dt-entry>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './template-handler.ts';
  export default Component;
</script>
