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
      :class="{ 'container-wide': standalone }">
      <div class="d-flex mb-5 align-items-center" v-if="standalone">
        <div>
          <h3 class="font-weight-bold mb-0">
            {{ generalForm.name.value }}
          </h3>
        </div>
        <span class="mx-auto"></span>
        <div v-if="!uiDT.isCreating">
          <div class="spinner-border spinner-border-sm"
            v-if="$store.state.uiDT.isFavoriteLoading">
          </div>
          <template v-if="!$store.state.uiDT.isFavoriteLoading">
            <button class="btn"
              @click="$refs.contextMenu.show();">
              <i class="mdi mdi-chevron-down"></i>
            </button>
            <div class="position-relative">
              <evan-dropdown ref="contextMenu"
                :alignment="'right'"
                :width="'300px'">
                <template v-slot:content>
                  <a class="dropdown-item pt-2 pb-2 pl-3 pr-3 clickable"
                    @click="
                      $store.state.uiDT.toggleFavorite(getRuntime())
                      $refs.contextMenu.hide($event);
                    ">
                    <i class="mdi mdi-star mr-3"></i>
                    <template v-if="$store.state.uiDT.isFavorite">
                      {{ `_digitaltwins.generalForm.remove-favorite` | translate }}
                    </template>
                    <template v-else>
                      {{ `_digitaltwins.generalForm.add-favorite` | translate }}
                    </template>
                  </a>
                  <a class="dropdown-item pt-2 pb-2 pl-3 pr-3 clickable"
                    @click="
                      evanNavigate(`${ $route.params.digitalTwinAddress }/map`)
                      $refs.contextMenu.hide($event);
                    ">
                    <i class="mdi mdi-link-variant mr-3" style="width: 16px;"></i>
                    {{ `_digitaltwins.generalForm.map-to-ens` | translate }}
                  </a>
                </template>
              </evan-dropdown>
            </div>
          </template>
        </div>
      </div>
      <div class="white-box" :class="{ 'border rounded': standalone }">
        <div class="header">
          <h3 class="m-0 font-weight-semibold">
            {{ `_digitaltwins.generalForm.title` | translate }}
          </h3>
        </div>
        <template
          v-if="!uiDT.isCreating">
          <form class="content"
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
          </form>
          <div class="footer">
            <button type="submit"
              class="btn btn-rounded btn-primary"
              v-if="!uiDT.validity.exists"
              @click="createDigitalTwin()"
              :disabled="!generalForm.isValid">
              {{ `_digitaltwins.generalForm.create` | translate }}
              <i class="mdi mdi-content-save label"></i>
            </button>
            <button type="button" class="btn btn-primary btn-rounded"
              v-else
              @click="$store.state.uiDT.saveChanges(this, getRuntime())"
              :disabled="!$store.state.uiDT.dirty || $store.state.uiDT.isSaving">
              {{ `_digitaltwins.generalForm.save` | translate }}
              <div class="spinner-border spinner-border-sm ml-3"
                v-if="$store.state.uiDT.isSaving">
              </div>
              <i class="mdi mdi-content-save label" v-else></i>
            </button>
          </div>
        </template>

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
