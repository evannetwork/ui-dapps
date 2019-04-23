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
    <div class="white-box border rounded"
      v-if="$store.state.uiDT.containers.length !== 0">
      <div class="header">
        <div>
          <h3 class="font-weight-semibold m-0">
            {{ `_digitaltwins.breadcrumbs.containers` | translate }}
          </h3>
        </div>
        <span class="mx-auto"></span>
        <div class="d-flex align-items-center">
          <button class="btn"
            @click="$refs.containerContextMenu.show();">
            <div class="spinner-border spinner-border-sm"
              v-if="$store.state.saving">
            </div>
            <i class="mdi mdi-chevron-down" v-else></i>
          </button>
          <div class="position-relative">
            <evan-dropdown ref="containerContextMenu"
              :alignment="'right'"
              :width="'300px'">
              <template v-slot:content>
                <a class="dropdown-item pt-2 pb-2 pl-3 pr-3 clickable"
                  @click="
                    evanNavigate(`${ $store.state.uiDT.address }/containerlink`)
                    $refs.containerContextMenu.hide($event);
                  ">
                  <i class="mdi mdi-link-variant mr-3" style="width: 16px;"></i>
                  {{ `_digitaltwins.context-menu.link` | translate }}
                </a>
              </template>
            </evan-dropdown>
          </div>
          <a
            class="btn btn-primary btn-circle
              d-flex align-items-center justify-content-center"
            :href="`${ dapp.fullUrl }/${ $store.state.uiDT.address }/datacontainer.digitaltwin.${ dapp.domainName }/create`">
            <i class="mdi mdi-plus"></i>
          </a>
        </div>
      </div>
      <div class="content">
        <div class="col-md-6 mb-4"
          v-for="(container, index) in $store.state.uiDT.containers">
          <a class="d-flex bg-level-1 border rounded evan-highlight flex-truncate"
            :href="!container.path ? null : `${ dapp.fullUrl }/${ container.path }`"
            style="min-width: 350px;">
            <div class="row align-items-center m-0 w-100">
              <div class="col-2">
                <img class="img-fluid p-3"
                  v-if="container.imgSquare"
                  :src="container.imgSquare">
                <i
                  class="mdi mdi-buffer"
                  style="font-size:60px;">
                </i>
              </div>
              <div class="col-10">
                <small class="text-center p-1 d-block text-muted"
                  v-if="container.creating">
                  {{ '_digitaltwins.containers.in-creation' | translate }}
                </small>
                <div class="d-flex p-3 flex-truncate">
                  <div>
                    <h4 class="font-weight-semibold mb-0">
                      {{ container.description.name }}
                    </h4>
                    <span class="text-justify d-block font-weight-semibold text-muted">
                      {{ container.description.description }}
                    </span>
                  </div>
                  <template v-if="container.loading">
                    <span class="mx-auto"></span>
                    <div class="spinner-border spinner-border-sm ml-3"></div>
                  </template>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="white-box border-rounded"
      v-else>
      <div class="header">
        <h3 class="m-0 font-weight-semibold">
          {{ `_digitaltwins.containers.empty` | translate }}
        </h3>
      </div>
      <div class="content">
        <p class="text-justify m-0">
          {{ `_digitaltwins.containers.empty-desc` | translate }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './containers.ts';
  export default Component;
</script>
