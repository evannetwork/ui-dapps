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
    <div class="p-3 text-left">
      <div class="bg-level-1 border">
        <div class="d-flex p-3 border-bottom align-items-center">
          <h4 class="m-0">
            {{ `_favorites.add` | translate }}
          </h4>
        </div>

        <evan-modal ref="favoriteAddModal">
          <template v-slot:header>
            <h5 class="modal-title">
              {{ `_favorites.add-form.modal.${ addStatus }.title` | translate }}
            </h5>
          </template>
          <template v-slot:body>
            <p class="text-left">
              {{ `_favorites.add-form.modal.${ addStatus }.desc`  | translate }}
            </p>
          </template>
          <template v-slot:footer>
            <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
             v-if="addStatus === 'ok'"
              @click="addFavorite();">
              {{ `_favorites.add` | translate }}
            </button>
          </template>
        </evan-modal>

        <form class="p-4" v-on:submit.prevent="checkFavorite">
          <div class="form-group">
            <label for="address">
              {{ `_favorites.add-form.address.title` | translate }}
            </label>
            <input class="form-control" required
              id="address" ref="address"
              :placeholder="`_favorites.add-form.address.desc` | translate"
              v-model="favoriteForm.address.value"
              v-bind:class="{ 'is-invalid' : favoriteForm.address.error }"
              @blur="favoriteForm.address.setDirty()">
            <div class="invalid-feedback">
              {{ `_favorites.add-form.address.error` | translate }}
            </div>
          </div>

          <div class="text-center mt-3 w-100">
            <button type="submit"
              class="btn btn-rounded btn-primary"
              :disabled="!favoriteForm.isValid || checking">
              <div class="spinner-border spinner-border-sm text-light mr-3"
                v-if="checking">
              </div>
              {{ `_favorites.add` | translate }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './add.ts';
  export default Component;
</script>
