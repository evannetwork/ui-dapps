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
  <div class="evan theme-evan">
    <evan-dapp-wrapper
      :routes="[ ]"
      v-on:loggedin="initialize()">
      <template v-slot:content>
        <evan-loading v-if="loading"></evan-loading>
        <div class="container-wide overflow-y-auto flex-grow-1" v-else>
          <favorite-add
            ref="favoriteAddModal">
          </favorite-add>
          <div class="d-flex mb-5 align-items-center">
            <div style="width: calc(100% - 200px)">
              <h3 class="font-weight-bold mb-0 force-oneline bg-level-3">
                {{ '_favorites.favorites-desc' | translate }}
              </h3>
            </div>
            <span class="mx-auto"></span>
            <button type="button" class="btn btn-primary btn-rounded"
              @click="$refs.favoriteAddModal.show();">
              {{ `_favorites.add` | translate }}
              <i class="mdi mdi-arrow-right label ml-3"></i>
            </button>
          </div>
          <div class="white-box border-smooth rounded"
            v-if="favorites.length === 0">
            <div class="header">
              <h3 class="m-0 font-weight-semibold">
                {{ '_favorites.no-favorites.title' | translate }}
              </h3>
            </div>
            <div class="content">
              <p v-html="$t('_favorites.no-favorites.desc')"></p>

              <div class="text-center mt-3">
                <button type="button" class="btn btn-primary btn-rounded"
                  @click="$refs.favoriteAddModal.show();">
                  {{ `_favorites.add` | translate }}
                  <i class="mdi mdi-arrow-right label ml-3"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="d-flex flex-wrap" v-else>
            <template
              v-for="(favorite, index) in favorites">
              <evan-modal ref="favoriteRemoveModal">
                <template v-slot:header>
                  <h5 class="modal-title">
                    {{ `_favorites.remove-modal.title` | translate }}
                  </h5>
                </template>
                <template v-slot:body>
                  <p class="text-left">
                    {{ `_favorites.remove-modal.desc`  | translate }}
                  </p>
                </template>
                <template v-slot:footer>
                  <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
                    @click="
                      removeFavorite(favorite);
                      $refs.favoriteRemoveModal[index].hide($event);
                      $event.stopPropagation();
                    ">
                    {{ `_favorites.remove` | translate }}
                  </button>
                </template>
              </evan-modal>
              <div
                class="col-md-4 col-lg-3 p-md-3 pb-3"
                style="min-width: 250px">
                <div class="favorite position-relative
                    text-center
                    bg-level-1 border evan-highlight"
                  @click="openFavorite(favorite)">
                  <img class="img-fluid p-4"
                    style="max-width: 200px; min-height: 200px; max-height: 200px;"
                    :src="favorite.imgSquare"
                    :style="favorite.address === 'lindig.evan' ? 'filter: invert(1)' : ''">

                  <div class="text-left p-3 border-top highlight">
                    <h5 class="font-weight-bold">{{ favorite.name }}</h5>
                    <small>{{ favorite.description }}</small>
                  </div>

                  <div class="top-right">
                    <div class="pt-1 pb-1 pr-2 pl-2" v-if="favorite.loading">
                      <div class="spinner-border spinner-border-sm text-secondary"></div>
                    </div>
                    <div v-else>
                      <div class="btn"
                        @click="
                          $refs.favoriteRemove[index].show();
                          $event.stopPropagation()
                        ">
                        <i class="mdi mdi-dots-vertical"></i>
                      </div>
                      <evan-dropdown ref="favoriteRemove"
                        :alignment="'right'"
                        :width="'300px'">
                        <template v-slot:content>
                          <a class="dropdown-item pt-2 pb-2 pl-3 pr-3"
                            @click="
                              $refs.favoriteRemoveModal[index].show($event);
                              $refs.favoriteRemove[index].hide($event);
                              $event.stopPropagation();
                            ">
                            <i class="mdi mdi-delete mr-3" style="width: 16px;"></i>
                            {{ `_favorites.remove` | translate }}
                          </a>
                        </template>
                      </evan-dropdown>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
  import Component from './root.ts';
  export default Component;
</script>

