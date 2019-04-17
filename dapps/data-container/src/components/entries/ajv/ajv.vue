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
  <table class="evan-flex-table">
    <thead>
      <tr class="text-muted">
        <th>
          {{ '_datacontainer.ajv.name.title' | translate }}
        </th>
        <th v-if="mode !=='view'">
          {{ '_datacontainer.ajv.type.title' | translate }}
        </th>
        <th v-if="enableValue">
          {{ '_datacontainer.ajv.value.title' | translate }}
        </th>
        <th class="last" v-if="mode === 'schema'"><!-- used for controls --></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(form, index) in forms">
        <td class="fill-content">
          <span class="font-weight-semibold" v-if="mode !== 'schema'">
            {{ form.name.value }}
          </span>
          <span class="text-primary" v-if="mode === 'schema'">
            <div class="form-group mb-0">
              <input class="form-control" required
                id="name" ref="name"
                :placeholder="`_datacontainer.ajv.name.desc` | translate"
                :disabled="$store.state.saving"
                v-model="form.name.value"
                v-bind:class="{ 'is-invalid' : form.name.error }"
                @blur="form.name.setDirty()">
              <div class="invalid-feedback">
                {{ `_datacontainer.ajv.name.error` | translate }}
              </div>
            </div>
          </span>
        </td>
        <td class="fill-content" v-if="mode !== 'view'">
          <div class="form-group mb-0" v-if="mode === 'schema'">
            <select class="form-control"
              id="type" ref="type"
              :placeholder="`_datacontainer.ajv.type.desc` | translate"
              :disabled="$store.state.saving"
              v-model="form.type.value"
              v-bind:class="{ 'is-invalid' : form.type.error }"
              @blur="form.type.setDirty()">
              <option
                v-for="(fieldType, index) in fieldTypes"
                :value="fieldType">
                {{ `_datacontainer.types.${ fieldType }` | translate }}
              </option>
            </select>
          </div>
          <div v-else>
            {{ `_datacontainer.types.${ form.type.value }` | translate }}
          </div>
        </td>
        <td class="fill-content" v-if="enableValue">
          <dt-field
            :mode="mode"
            :form="form"
            :type="form.type.value">
          </dt-field>
        </td>
        <td class="last" v-if="mode === 'schema'">
          <i class="mdi mdi-delete clickable"
            :disabled="$store.state.saving"
            @click="!$store.state.saving && removeProperty()">
          </i>
        </td>
      </tr>
      <!-- add empty row that watches on click events for adding new entries -->
      <tr class="clickable position-relative"
        v-if="mode === 'schema'"
        @click="!$store.state.saving && addProperty('')">
        <td class="fill-content">
          <div class="ajv-add-overlay">
            <!-- <h5 class="text-muted">{{ '_datacontainer.ajv.add' | translate }}</h5> -->
          </div>
          <div class="form-group mb-0" v-if="mode === 'schema'">
            <input class="form-control bg-level-1"
              disabled
              :placeholder="`_datacontainer.ajv.name.desc` | translate">
          </div>
        </td>
        <td class="fill-content">
          <div class="form-group mb-0" v-if="mode === 'schema'">
            <select class="form-control bg-level-1" disabled
              :placeholder="`_datacontainer.ajv.type.desc` | translate">
              <option>
                {{ `_datacontainer.types.string` | translate }}
              </option>
            </select>
          </div>
        </td>
        <td class="fill-content" v-if="enableValue">
          <input class="form-control bg-level-1"
            type="text" disabled
            :placeholder="`_datacontainer.ajv.value.desc` | translate">
        </td>
        <td class="last"></td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
  import Component from './ajv.ts';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './ajv.scss';
</style>
