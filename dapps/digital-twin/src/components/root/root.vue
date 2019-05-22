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
      <template v-slot:header
        v-if="$route.path.indexOf(`digitaltwins.${ dapp.domainName }`) === -1">
        <dt-breadcrumbs></dt-breadcrumbs>
      </template>
      <template v-slot:content>
        <evan-loading v-if="loading || ($store.state.uiDT && $store.state.uiDT.loading)"></evan-loading>
        <template v-else>
          <evan-dapp-wrapper-level-2 ref="level2Wrapper"
            v-if="$store.state.uiDT && $store.state.uiDT.validity.exists">
            <template v-slot:content>
              <div style="width: 360px">
                <evan-loading
                  v-if="$store.state.uiDT.loading && !$store.state.uiDT.initialized">
                </evan-loading>

                <template v-else>
                  <ul class="nav font-medium in w-100 mb-3 mt-auto">
                    <li class="w-100 p-4 clickable border-top border-sm"
                      v-for="(category, index) in twinNavigation"
                      :id="`evan-dt-nav-${ category.name }`"
                      :class="{ 'active': category.active }"
                      @click="toggleLeftCategory(twinNavigation, category)">
                      <div class="d-flex w-100">
                        <div>
                          <h6 class="mb-1 font-weight-semibold">
                            {{ `_digitaltwins.left-categories.${ category.name }.title` | translate }}
                          </h6>
                          <small class="text-muted font-weight-semibold">
                            {{ `_digitaltwins.left-categories.${ category.name }.desc` | translate }}
                          </small>
                        </div>
                        <span class="mx-auto"></span>
                        <i v-if="category.active" class="mdi mdi-chevron-up"></i>
                        <i v-if="!category.active" class="mdi mdi-chevron-down"></i>
                      </div>
                      <div class="mt-3" v-if="category.active">
                        <ul class="sub-nav" v-if="category.children.length > 0">
                          <li class="pt-2 pb-2 pl-3 pr-3 d-flex flex-truncate"
                            v-for="(subCategory, subIndex) in category.children">
                            <a class="font-weight-semibold"
                              :id="`evan-dt-nav-${ subCategory.path.split('/').pop() }`"
                              @click="$refs.level2Wrapper.hide()"
                              :href="!subCategory.path ? null : `${ dapp.fullUrl }/${ subCategory.path }`"
                              :class="{ 'active': $route.path.indexOf(subCategory.path) !== -1 }">
                              {{ subCategory.i18n ? $t(`_digitaltwins.left-categories.${ subCategory.name }`) : subCategory.name }}
                            </a>
                            <template v-if="subCategory.loading">
                              <span class="mx-auto"></span>
                              <div class="spinner-border spinner-border-sm ml-3"></div>
                            </template>
                          </li>
                        </ul>
                        <b class="p-2 text-center small d-block"
                          v-else
                          v-html="$t(`_digitaltwins.empty-navigation`)">
                        </b>
                      </div>
                    </li>
                  </ul>
                </template>
              </div>
            </template>
          </evan-dapp-wrapper-level-2>

          <transition name="fade" mode="out-in"
            v-if="!$store.state.uiDT || ($store.state.uiDT && !$store.state.uiDT.loading)">
            <router-view></router-view>
          </transition>
          <evan-loading v-else></evan-loading>
        </template>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
  import TwinsRootComponent from './root.ts';
  export default TwinsRootComponent;
</script>
