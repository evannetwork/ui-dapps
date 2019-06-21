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
    <div class="row content row pb-0" v-if="$store.state.uiDT.containers.length !== 0">
      <div class="col-xl-4 col-md-6 mb-4"
        v-for="(container, index) in $store.state.uiDT.containers">
        <a class="d-flex bg-level-1 border-smooth rounded evan-highlight w-100"
          :id="`evan-dt-container-${ container.path ? container.path.split('/').pop() : 'creating' }`"
          :href="!container.path ? null : `${ dapp.fullUrl }/${ container.path }`">
          <div class="row align-items-center m-0 w-100">
<!--             <div class="col-2" style="overflow: visible">
              <img class="img-fluid p-3"
                v-if="container.imgSquare"
                :src="container.imgSquare">
              <i
                class="mdi mdi-note-multiple-outline text-muted"
                style="font-size:50px;">
              </i>
            </div> -->
            <div class="col-12 d-flex align-items-center">
              <div class="w-100 p-3" style="height: 81px; max-width: calc(100% - 20px)">
                <h4 class="font-weight-semibold mb-0 force-oneline">
                  {{ container.description.name }}
                </h4>
                <span class="text-justify d-block font-weight-semibold text-muted force-oneline"
                  v-if="!container.creating">
                  {{ container.description.description }}
                </span>
                <span v-else>
                  {{ '_digitaltwins.containers.in-creation' | translate }}
                </span>
              </div>
              <span class="mx-auto"></span>
              <div class="spinner-border spinner-border-sm text-secondary ml-3"
                v-if="container.loading">
              </div>
              <i class="mdi mdi-dots-vertical clickable text-dark"
                v-else
                @click="$refs.dcActions[index].showDropdown($event)">
              </i>
            </div>
          </div>
        </a>
        <dc-actions
          v-if="!container.loading"
          ref="dcActions"
          :containerAddress="container.address"
          :dcActions="true"
          :digitalTwinAddress="$store.state.uiDT.contractAddress"
          :displayMode="'dropdownHidden'"
          :setActions="true">
        </dc-actions>
      </div>
    </div>
    <div class="white-box border-smooth rounded" v-else>
      <div class="content">
        <p class="text-justify m-0"
          v-html="$t(`_digitaltwins.containers.empty-desc`)">
        </p>
        <p v-if="$store.state.uiDT.isOwner"
          v-html="$t(`_digitaltwins.containers.empty-desc-perm`)">
        </p>
        <p v-else
          v-html="$t(`_digitaltwins.containers.empty-desc-noperm`)">
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './containers.ts';
  export default Component;
</script>
