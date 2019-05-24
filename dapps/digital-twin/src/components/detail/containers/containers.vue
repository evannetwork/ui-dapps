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
  <div class="white-box border-smooth rounded">
    <div class="header">
      <h3 class="font-weight-semibold m-0">
        <template
          v-if="$store.state.uiDT.containers.length !== 0">
          {{ `_digitaltwins.breadcrumbs.dt-plugins` | translate }}
        </template>
        <template v-else>
          {{ `_digitaltwins.containers.empty` | translate }}
        </template>
      </h3>
      <span class="mx-auto"></span>
      <dt-actions
        v-if="$store.state.uiDT.isOwner"
        :uiDT="uiDT"
        :dtActions="false"
        :containerActions="true"
        :displayMode="'buttons'">
      </dt-actions>
    </div>
    <div class="content row pb-0" v-if="$store.state.uiDT.containers.length !== 0">
      <div class="col-md-4 mb-4"
        v-for="(container, index) in $store.state.uiDT.containers"
        style="min-width: 350px;">
        <a class="d-flex bg-level-1 border-smooth rounded evan-highlight flex-truncate"
          :id="`evan-dt-container-${ container.path ? container.path.split('/').pop() : 'creating' }`"
          :href="!container.path ? null : `${ dapp.fullUrl }/${ container.path }`">
          <div class="row align-items-center m-0 w-100">
            <div class="col-2">
              <img class="img-fluid p-3"
                v-if="container.imgSquare"
                :src="container.imgSquare">
              <i
                class="mdi mdi-buffer"
                style="font-size:50px;">
              </i>
            </div>
            <div class="col-10">
              <div class="d-flex p-3 flex-truncate">
                <div>
                  <h4 class="font-weight-semibold mb-0">
                    {{ container.description.name }}
                  </h4>
                  <span class="text-justify d-block font-weight-semibold text-muted"
                    v-if="!container.creating">
                    {{ container.description.description }}
                  </span>
                  <span v-else>
                    {{ '_digitaltwins.containers.in-creation' | translate }}
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
    <div class="content" v-else>
      <p class="text-justify m-0"
        v-html="$t(`_digitaltwins.containers.empty-desc`)">
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './containers.ts';
  export default Component;
</script>
