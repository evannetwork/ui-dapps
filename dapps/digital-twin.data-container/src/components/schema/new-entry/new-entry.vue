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
    <evan-modal
      id="entry-add-modal"
      ref="entryAddModal">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_datacontainer.entry.add` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <form
          id="th-entry-add-form"
          v-on:submit.prevent="addEntry">
          <div class="form-group">
            <label for="type">
              {{ `_datacontainer.entry.type.title` | translate }}
            </label>
            <select class="form-control custom-select"
              id="type" ref="type"
              :placeholder="`_datacontainer.entry.type.desc` | translate"
              :disabled="$store.state.saving"
              v-model="entryForm.type.value"
              :class="{ 'is-invalid' : entryForm.type.error }"
              @blur="entryForm.type.setDirty()">
              <option
                v-for="(entryType, index) in entryTypes"
                :value="entryType">
                {{ `_datacontainer.types.${ entryType }` | translate }}
              </option>
            </select>
          </div>
          <div class="form-group" v-if="entryForm.type.value === 'array'">
            <label for="arrayType">
              {{ `_datacontainer.entry.array-type.title` | translate }}
            </label>
            <select class="form-control custom-select"
              id="arrayType" ref="arrayType"
              :placeholder="`_datacontainer.entry.array-type.desc` | translate"
              :disabled="$store.state.saving"
              v-model="entryForm.arrayType.value"
              :class="{ 'is-invalid' : entryForm.arrayType.error }"
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
              :class="{ 'is-invalid' : entryForm.name.error }"
              v-model="entryForm.name.value"
              @blur="entryForm.name.setDirty()">
            <div class="invalid-feedback">
              {{ entryForm.name.error | translate }}
            </div>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <button class="btn  btn-primary"
          id="th-add-entry"
          type="submit"
          @click="addEntry()"
          :disabled="!entryForm.isValid">
          {{ `_datacontainer.entry.add` | translate }}
          <i class="mdi mdi-arrow-right label ml-3"></i>
        </button>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './new-entry.ts';
  export default Component;
</script>
