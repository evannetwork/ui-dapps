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
          </button>
          <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
            @click="restoreTemplate()">
            {{ `_datacontainer.template-cache.action` | translate }}
          </button>
        </template>
      </evan-modal>
      <div class="d-flex border">
        <div class="d-flex align-items-center p-2 text-center border-right clickable all-transition"
          v-for="(property, index) in Object.keys(template.properties)"
          :class="activeTab === index ? 'bg-secondary bg-text-secondary' : 'bg-level-1'"
          @click="activateTab(index)">
          {{ property }}
        </div>
        <div class="d-block p-2 text-center border-right clickable all-transition"
          :class="activeTab === -1 ? 'bg-secondary bg-text-secondary' : 'bg-level-1'"
          @click="activateTab(-1)">
          <i class="mdi mdi-plus-circle large"></i>
        </div>
        <span class="mx-auto"></span>
        <button type="button" class="btn btn-outline-secondary btn-circle btn-sm ml-5 mt-1 mr-2 animate-hop"
          v-if="cachedTemplate"
          @click="$refs.cacheModal.show()">
          <i class="mdi mdi-undo"></i>
        </button>
      </div>

      <div class="bg-level-2 border-bottom border-right border-left p-3"
        v-if="activeTab === -1">
        <div class="bg-level-1 border">
          <div class="d-flex p-3 border-bottom align-items-center">
            <h4 class="m-0">
              {{ `_datacontainer.entry.add` | translate }}
            </h4>
          </div>
          <p class="p-3 m-0">
            {{ `_datacontainer.entry.add-desc` | translate }}
          </p>

          <div class="p-3">
            <form v-on:submit.prevent="addEntry">
              <div class="form-group">
                <label for="type">
                  {{ `_datacontainer.entry.type.title` | translate }}
                </label>
                <select class="form-control"
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
                <select class="form-control"
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

              <div class="mt-3 text-center">
                <button type="submit"
                  class="btn btn-rounded btn-outline-secondary"
                  :disabled="!entryForm.isValid || $store.state.saving">
                  {{ `_datacontainer.entry.add` | translate }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

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
