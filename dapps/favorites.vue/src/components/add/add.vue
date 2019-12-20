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
*/

<template>
  <div>
    <evan-modal
      id="favorite-add-modal"
      ref="favoriteAddModal"
      :maxWidth="'800px'">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_favorites.add` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <evan-modal
          id="favorite-add-modal-accept"
          ref="favoriteAddModalAccept">
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
            <button type="button"
              class="btn btn-primary "
              v-if="addStatus === 'ok'"
              @click="addFavorite();">
              {{ `_favorites.add` | translate }}
              <i class="mdi mdi-arrow-right label ml-3"></i>
            </button>
          </template>
        </evan-modal>

        <div class="form-group">
          <label for="address">
            {{ `_favorites.add-form.address.title` | translate }}
          </label>
          <input class="form-control" required
            id="address" ref="address"
            :placeholder="`_favorites.add-form.address.desc` | translate"
            v-model="favoriteForm.address.value"
            :class="{ 'is-invalid' : favoriteForm.address.error }"
            @blur="favoriteForm.address.setDirty()"
            @keyup.enter="checkFavorite()">
          <div class="invalid-feedback">
            {{ `_favorites.add-form.address.error` | translate }}
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button type="submit"
          class="btn  btn-primary"
          :disabled="!favoriteForm.isValid || checking"
          @click="checkFavorite()">
          <div class="spinner-border spinner-border-sm text-light mr-3"
            v-if="checking">
          </div>
          {{ `_favorites.add` | translate }}
        </button>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './add.ts';
  export default Component;
</script>
