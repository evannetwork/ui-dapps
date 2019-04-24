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
    <evan-loading v-if="loading"></evan-loading>
    <div class="container-wide" v-if="!loading">
      <div class="d-flex align-items-center">
        <div>
          <h3 class="font-weight-bold mb-0">
            {{ '_digitaltwins.left-categories.my-digitaltwins.title' | translate }}
          </h3>
          <p class="text-muted font-weight-semibold m-t-0">
            {{ '_digitaltwins.left-categories.my-digitaltwins.desc' | translate }}
          </p>
        </div>
        <span class="mx-auto"></span>
        <div>
          <a
            class="btn btn-rounded btn-light font-weight-normal"
            :href="`${ dapp.fullUrl }/digitaltwin.${ dapp.domainName }/dt-create`">
            <i class="mdi mdi-plus mr-1 m-0"></i>
            <span>{{ '_digitaltwins.overview.create-twin' | translate }}</span>
          </a>
          <a
            class="btn btn-rounded btn-primary font-weight-semibold"
            :href="`${ dapp.fullUrl }/lookup`">
            {{ '_digitaltwins.lookup.title' | translate }}
            <i class="mdi mdi-arrow-right label ml-3"></i>
          </a>
        </div>
      </div>

      <div class="white-box border rounded mt-3"
        v-for="(category, index) in [ 'lastTwins', 'favorites' ]"
        v-if="categories[category].length > 0">
        <div class="header">
          <div>
            <h3 class="font-weight-semibold m-0">
              {{ `_digitaltwins.overview.${ category }` | translate }}
            </h3>
          </div>
          <span class="mx-auto"></span>
          <div></div>
        </div>
        <div class="row content">
          <div class="col-md-6 col-lg-4 mb-4" v-for="(ensAddress, index) in categories[category]">
            <a class="d-flex bg-level-1 border rounded evan-highlight flex-truncate"
              :href="`${ dapp.fullUrl }/digitaltwin.${ dapp.domainName }/${ ensAddress }/containers`">
              <div class="row align-items-center m-0">
                <div class="col-2">
                  <img class="img-fluid p-3"
                    v-if="descriptions[ensAddress].imgSquare"
                    :src="descriptions[ensAddress].imgSquare">
                  <i
                    class="mdi mdi-fingerprint"
                    style="font-size:60px;">
                  </i>
                </div>
                <div class="col-10">
                  <small class="text-center p-1 d-block text-muted"
                    v-if="descriptions[ensAddress].creating">
                    {{ '_digitaltwins.containers.in-creation' | translate }}
                  </small>
                  <div class="d-flex p-3 flex-truncate">
                    <div>
                      <h4 class="font-weight-semibold mb-0">
                        {{ descriptions[ensAddress].name }}
                      </h4>
                      <span class="text-justify d-block font-weight-semibold text-muted">
                        {{ descriptions[ensAddress].description }}
                      </span>
                    </div>
                    <template v-if="descriptions[ensAddress].loading">
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
      <div class="white-box border rounded"
        v-if="categories.favorites.length === 0 && categories.lastTwins.length === 0">
        <div class="header">
          <h4 class="m-0">
            {{ `_digitaltwins.overview.empty` | translate }}
          </h4>
        </div>
        <div class="content">
          <p class="m-0">
            {{ `_digitaltwins.overview.empty-desc` | translate }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './overview.ts';
  export default Component;
</script>
