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
  <div class="evan-table table-responsive-md border-0 p-0">
    <table>
      <thead>
        <tr>
          <th>{{ '_datacontainer.ajv.name.title' | translate }}</th>
          <th v-if="mode !=='view'">{{ '_datacontainer.ajv.type.title' | translate }}</th>
          <th>{{ '_datacontainer.ajv.value.title' | translate }}</th>
          <th v-if="mode === 'schema'"> <!-- used for controls --></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(form, index) in forms">
          <tr v-if="index !== 0">
            <td class="p-2"></td>
          </tr>
          <tr>
            <td>
              <span class="text-primary" v-if="mode !== 'schema'">
                {{ form.name.value }}
              </span>
              <span class="text-primary" v-if="mode === 'schema'">
                <div class="form-group mb-0">
                  <input class="form-control" required
                    id="name" ref="name"
                    :placeholder="`_datacontainer.ajv.name.desc` | translate"
                    v-model="form.name.value"
                    v-bind:class="{ 'is-invalid' : form.name.error }"
                    @blur="form.name.setDirty()">
                  <div class="invalid-feedback">
                    {{ `_datacontainer.ajv.name.error` | translate }}
                  </div>
                </div>
              </span>
            </td>
            <td v-if="mode !== 'view'">
              <div class="form-group mb-0" v-if="mode === 'schema'">
                <select class="form-control"
                  id="type" ref="type"
                  :placeholder="`_datacontainer.ajv.type.desc` | translate"
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
            <td>
              <dt-field
                :mode="mode"
                :form="form"
                :type="form.type.value"
                :showLabel="false">
              </dt-field>
            </td>
            <td v-if="mode === 'schema'">
              <i class="fas fa-trash clickable"
                @click="forms.splice(forms.indexOf(form), 1)">
              </i>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div class="text-center mt-3">
      <button type="submit"  class="btn btn-rounded btn-outline-secondary"
        @click="addProperty('')">
        {{ `_datacontainer.ajv.add` | translate }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './ajv.ts';
  export default Component;
</script>
