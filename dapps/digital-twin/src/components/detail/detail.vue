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
  <div class="d-flex flex-column h-100">
    <div class="container-wide"
      v-if="uiDT.validity.error">
      <div class="white-box border rounded">
        <div class="header">
          <h3 class="m-0 font-weight-semibold">
            {{ '_digitaltwins.detail.error.title' | translate }}
          </h3>
        </div>
        <div class="content"
          v-html="$t('_digitaltwins.detail.error.desc')">
        </div>
      </div>
    </div>
    <template v-else>
      <evan-nav-tabs class="flex-shrink-0"
        :tabs="tabs">
      </evan-nav-tabs>
      <div class="container-wide overflow-y-auto">
        <div class="d-flex mb-5 align-items-center">
          <div>
            <h3 class="font-weight-bold mb-0">
              {{ uiDT.dbcp.name }}
            </h3>
            <p class="text-muted font-weight-semibold m-0">
              {{ uiDT.dbcp.description }}
            </p>
          </div>
          <span class="mx-auto"></span>
          <div>
            <button class="btn btn-circle btn-sm btn-tertiary mr-2"
              id="dt-favorite-toggle"
              :disabled="uiDT.isFavoriteLoading"
              @click="uiDT.toggleFavorite(getRuntime())">
              <div class="spinner-border spinner-border-sm"
                v-if="uiDT.isFavoriteLoading">
              </div>
              <i class="mdi mdi-star"
                :class="{ 'text-warning': uiDT.isFavorite }"
                v-else>
              </i>
              <evan-tooltip :placement="'bottom'">
                <template v-if="uiDT.isFavorite">
                  {{ `_digitaltwins.detail.remove-favorite` | translate }}
                </template>
                <template v-else>
                  {{ `_digitaltwins.detail.add-favorite` | translate }}
                </template>
              </evan-tooltip>
            </button>
            <button class="btn btn-circle btn-sm btn-tertiary mr-2"
              id="dt-map-ens"
              @click="reactiveRefs.dtEnsMap.$refs.mapEnsModal.show();">
              <i class="mdi mdi-link-variant" style="width: 16px;"></i>
              <evan-tooltip :placement="'bottom'">
                {{ `_digitaltwins.detail.map-to-ens` | translate }}
              </evan-tooltip>
            </button>
            <button class="btn btn-circle btn-sm btn-tertiary"
              id="dt-edit"
              :disabled="uiDT.isSaving"
              @click="$refs.dbcpModal.show();">
              <div class="spinner-border spinner-border-sm"
                v-if="uiDT.isSaving">
              </div>
              <i class="mdi mdi-pencil"
                style="width: 16px;"
                v-else>
              </i>
              <evan-tooltip :placement="'bottom'">
                {{ `_digitaltwins.detail.edit` | translate }}
              </evan-tooltip>
            </button>
          </div>
        </div>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
      <evan-modal
        id="dt-dbcp-modal"
        ref="dbcpModal">
        <template v-slot:header>
          <h5 class="modal-title">
            {{ '_datacontainer.edit-dbcp' | translate }}
          </h5>
        </template>
        <template v-slot:body>
          <dt-dbcp
            ref="dbcpForm"
            :dbcp="uiDT.dbcp"
            @init="$set(reactiveRefs, 'dbcpForm', $event)"
            @submit="saveDbcp($event)">
          </dt-dbcp>
        </template>
        <template v-slot:footer v-if="reactiveRefs.dbcpForm">
          <button type="submit"
            id="container-dbcp-save"
            class="btn btn-rounded btn-primary"
            @click="reactiveRefs.dbcpForm.save()"
            :disabled="!reactiveRefs.dbcpForm._form.isValid">
            {{ `_digitaltwins.detail.save` | translate }}
            <i class="mdi mdi-arrow-right label"></i>
          </button>
        </template>
      </evan-modal>
      <dt-ens-map
        @init="$set(reactiveRefs, 'dtEnsMap', $event)">
      </dt-ens-map>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './detail.ts';
  export default Component;
</script>
