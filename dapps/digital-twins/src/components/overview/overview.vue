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
    <div class="p-3 text-left" v-if="!loading">
      <template class="bg-level-1 border mb-3"
        v-for="(category, index) in [ 'lastTwins', 'favorites' ]"
        v-if="categories[category].length > 0">
        <div class="d-flex p-3 border-bottom align-items-center">
          <h4 class="m-0">
            {{ `_digitaltwins.overview.${ category }` | translate }}
          </h4>
        </div>
        <div class="container d-md-flex flex-wrap justify-content-left">
          <div class="col-md-6 col-lg-4 p-3"
            v-for="(ensAddress, index) in categories[category]">
            <a class="text-center bg-level-1 border evan-highlight p-4"
              style="min-width: 250px"
              :href="`${ dapp.fullUrl }/${ ensAddress }`">
              <img class="img-fluid p-3"
                style="max-width: 200px; min-height: 200px;"
                :src="descriptions[ensAddress].imgSquare">
                
              <div class="text-left border-top highlight">
                <small class="text-center p-1 d-block text-muted"
                  v-if="descriptions[ensAddress].creating">
                  {{ '_digitaltwins.containers.in-creation' | translate }}
                </small>
                <div class="d-flex p-3">
                  <div>
                    <h5 class="font-weight-bold">{{ descriptions[ensAddress].name }}</h5>
                    <span class="overflow-multiline">{{ descriptions[ensAddress].description }}</span>
                  </div>
                  <template v-if="descriptions[ensAddress].loading">
                    <span class="mx-auto"></span>
                    <div class="spinner-border spinner-border-sm ml-3"></div>
                  </template>
                </div>
              </div>
            </a>
          </div>
        </div>
      </template>
      <div class="bg-level-1 border mb-3"
        v-if="categories.favorites.length === 0 && categories.lastTwins.length === 0">
        <div class="d-flex p-3 border-bottom align-items-center">
          <h4 class="m-0">
            {{ `_digitaltwins.overview.empty` | translate }}
          </h4>
        </div>
        <div class="p-3">
          <p>
            {{ `_digitaltwins.overview.empty-desc` | translate }}
          </p>

          <div class="text-center">
            <a
              class="btn btn-rounded btn-primary font-weight-normal"
              :href="`${ dapp.fullUrl }/lookup`">
              {{ '_digitaltwins.lookup.title' | translate }}
              <i class="mdi mdi-arrow-right label ml-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './overview.ts';
  export default Component;
</script>
