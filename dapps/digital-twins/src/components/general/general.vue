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
    <div class="text-left"
      :class="{ 'p-1 p-md-4': standalone }">
      <div class="bg-level-1"
        :class="{ 'border': standalone }">
        <div class="d-flex p-5 border-bottom border-sm align-items-center">
          <h3 class="m-0 font-weight-semibold">
            {{ `_digitaltwins.generalForm.title` | translate }}
          </h3>
        </div>
        <form class="p-4"
          v-if="!uiDT.isCreating"
          v-on:submit.prevent="createDigitalTwin">
          <div class="form-group">
            <label for="name">
              {{ `_digitaltwins.generalForm.name.title` | translate }}
            </label>
            <input class="form-control" required
              id="name" ref="name"
              :placeholder="`_digitaltwins.generalForm.name.desc` | translate"
              v-model="generalForm.name.value"
              v-bind:class="{ 'is-invalid' : generalForm.name.error }"
              @blur="generalForm.name.setDirty()">
            <div class="invalid-feedback">
              {{ `_digitaltwins.generalForm.name.error` | translate }}
            </div>
          </div>
          <div class="form-group">
            <label for="description">
              {{ `_digitaltwins.generalForm.description.title` | translate }}
            </label>
            <textarea class="form-control" rows="7"
              id="description" ref="description"
              :placeholder="`_digitaltwins.generalForm.description.desc` | translate"
              v-model="generalForm.description.value"
              v-bind:class="{ 'is-invalid' : generalForm.description.error }"
              @blur="generalForm.description.setDirty()">
            </textarea>
          </div>

          <div class="text-center mt-3 w-100">
            <button type="submit"
              class="btn btn-rounded btn-primary"
              v-if="!uiDT.validity.exists"
              :disabled="!generalForm.isValid || checking">
              <div class="spinner-border spinner-border-sm text-light mr-3"
                v-if="checking">
              </div>
              {{ `_digitaltwins.generalForm.create` | translate }}
            </button>
          </div>
        </form>

        <div class="text-center" v-else>
          <h4 class="mt-5 mb-3">{{ '_digitaltwins.in-creation' | translate }}</h4>
          <b> {{ generalForm.name.value }} </b>
          <evan-loading></evan-loading>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './general.ts';
  export default Component;
</script>
