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
  <div class="container-wide">
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
      <div v-if="uiDT.validity.exists">
        <button class="btn btn-circle btn-sm btn-tertiary mr-3"
          id="dt-general-favorite-toggle"
          @click="
            $store.state.uiDT.toggleFavorite(getRuntime())
            $refs.contextMenu.hide($event);
          ">
          <div class="spinner-border spinner-border-sm"
            v-if="$store.state.uiDT.isFavoriteLoading">
          </div>
          <i class="mdi mdi-star" v-else></i>
          <evan-tooltip :placement="'bottom'">
            <template v-if="$store.state.uiDT.isFavorite">
              {{ `_digitaltwins.detailForm.remove-favorite` | translate }}
            </template>
            <template v-else>
              {{ `_digitaltwins.detailForm.add-favorite` | translate }}
            </template>
          </evan-tooltip>
        </button>
        <button class="btn btn-circle btn-sm btn-tertiary"
          id="dt-general-map-ens"
          @click="
            evanNavigate(`${ $route.params.digitalTwinAddress }/map`)
            $refs.contextMenu.hide($event);
          ">
          <i class="mdi mdi-link-variant" style="width: 16px;"></i>
          <evan-tooltip :placement="'bottom'">
            {{ `_digitaltwins.detailForm.map-to-ens` | translate }}
          </evan-tooltip>
        </button>
      </div>
    </div>
    <div class="d-flex mb-5 align-items-center" v-if="standalone">
      <div>
        <h3 class="font-weight-bold mb-0">
          {{ detailForm.name.value }}
        </h3>
      </div>
      <span class="mx-auto"></span>
      <div v-if="uiDT.validity.exists">
        <button class="btn btn-circle btn-sm btn-tertiary mr-3"
          id="dt-general-favorite-toggle"
          @click="
            $store.state.uiDT.toggleFavorite(getRuntime())
            $refs.contextMenu.hide($event);
          ">
          <div class="spinner-border spinner-border-sm"
            v-if="$store.state.uiDT.isFavoriteLoading">
          </div>
          <i class="mdi mdi-star" v-else></i>
          <evan-tooltip :placement="'bottom'">
            <template v-if="$store.state.uiDT.isFavorite">
              {{ `_digitaltwins.detailForm.remove-favorite` | translate }}
            </template>
            <template v-else>
              {{ `_digitaltwins.detailForm.add-favorite` | translate }}
            </template>
          </evan-tooltip>
        </button>
        <button class="btn btn-circle btn-sm btn-tertiary mr-3"
          id="dt-general-map-ens"
          @click="
            evanNavigate(`${ $route.params.digitalTwinAddress }/map`)
            $refs.contextMenu.hide($event);
          ">
          <i class="mdi mdi-link-variant" style="width: 16px;"></i>
          <evan-tooltip :placement="'bottom'">
            {{ `_digitaltwins.detailForm.map-to-ens` | translate }}
          </evan-tooltip>
        </button>
        <div class="spinner-border spinner-border-sm"
          v-if="$store.state.uiDT.isFavoriteLoading">
        </div>
        <template v-if="!$store.state.uiDT.isFavoriteLoading">
          <button class="btn"
            id="dt-general-dropdown"
            @click="$refs.contextMenu.show();">
            <i class="mdi mdi-chevron-down"></i>
          </button>
          <div class="position-relative">
            <evan-dropdown ref="contextMenu"
              :alignment="'right'"
              :width="'300px'">
              <template v-slot:content>
                
              </template>
            </evan-dropdown>
          </div>
        </template>
      </div>
    </div>
    <div class="white-box border rounded">
      <div class="header">
        <h3 class="m-0 font-weight-semibold">
          {{ `_digitaltwins.detailForm.title` | translate }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './detail.ts';
  export default Component;
</script>
