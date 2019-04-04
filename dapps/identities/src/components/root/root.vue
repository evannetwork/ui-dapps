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
      v-on:loggedin="initialize()">
      <template v-slot:content>
        <evan-loading v-if="loading"></evan-loading>
        <template v-else>
          <evan-dapp-wrapper-level-2>
            <template v-slot:content>
              <div class="w300">
                <div class="d-flex pl-4 pr-4 pt-3 pb-3 align-items-center justify-content-between">
                  <a :href="`${ dapp.fullUrl }`">
                    <h5 class="font-weight-bolder text-nowrap">
                      {{ '_identities.identities' | translate }}
                    </h5>
                  </a>

                  <a
                    class="btn btn-rounded btn-primary font-weight-normal"
                    :href="`${ dapp.fullUrl }/lookup`">
                    {{ '_identities.lookup.title' | translate }}
                    <i class="fas fa-arrow-right label ml-2"></i>
                  </a>
                </div>

                <evan-loading
                  v-if="$store.state.uiIdentity && $store.state.uiIdentity.loading && sideNav !== 0">
                </evan-loading>

                <template v-if="$store.state.uiIdentity && !$store.state.uiIdentity.loading">
                  <ul class="pl-4 pr-4 pb-4 border-bottom border-sm list-unstyled d-flex">
                    <li class="mr-3">
                      <a 
                        :class="{ 'active border-bottom border-primary pb-1': sideNav === 0, 'text-muted': sideNav !== 0 }"
                        :href="dapp.fullUrl"
                        @click="sideNav = 0">
                        <b>{{ '_identities.overview.title' | translate }}</b>
                      </a>
                    </li>
                    <li class="mr-3">
                      <a
                        :class="{ 'active border-bottom border-primary pb-1': sideNav === 1, 'text-muted': sideNav !== 1 }"
                        :href="`${ dapp.fullUrl }/${ $store.state.uiIdentity.address }`"
                        @click="sideNav = 1">
                        <b>{{ $store.state.uiIdentity.dbcp.name || $store.state.uiIdentity.address }}</b>
                      </a>
                    </li>
                  </ul>

                  <template v-if="!$store.state.uiIdentity.validity.exists && sideNav !== 0">
                    <p class="mt-5 p-3 text-center"
                      v-html="$t('_identities.unlock-identity-panel')">
                    </p>
                  </template>
                </template>

                <ul class="nav font-medium in w-100 mb-3 mt-auto"
                  v-if="sideNav === 0 || ($store.state.uiIdentity && !$store.state.uiIdentity.loading && $store.state.uiIdentity.validity.exists)">
                  <li class="w-100 p-4 clickable"
                    v-for="(category, index) in navigation[sideNav]"
                    :class="{ 'active': category.active }"
                    @click="toggleLeftCategory(navigation[sideNav], category)">
                    <div class="d-flex w-100">
                      <div>
                        <h4 class="mb-0">{{ `_identities.left-categories.${ category.name }.title` | translate }}</h4>
                        <span class="text-muted">{{ `_identities.left-categories.${ category.name }.desc` | translate }}</span>
                      </div>
                      <span class="mx-auto"></span>
                      <i v-if="category.active" class="fas fa-chevron-up"></i>
                      <i v-if="!category.active" class="fas fa-chevron-down"></i>
                    </div>
                    <div class="mt-3" v-if="category.active">
                      <ul class="sub-nav" v-if="category.children.length > 0">
                        <li class="pt-2 pb-2 pl-3 pr-3"
                          v-for="(subCategory, subIndex) in category.children">
                          <a class="font-weight-bold"
                            :href="`${ dapp.fullUrl }/${ subCategory.path }`"
                            :class="{ 'active': $route.path.endsWith(subCategory.path) }">
                            {{ subCategory.i18n ? $t(`_identities.left-categories.${ subCategory.name }`) : subCategory.name }}
                          </a>
                        </li>
                      </ul>
                      <b class="p-3 text-center"
                        v-else
                        v-html="$t(`_identities.empty-navigation`)">
                      </b>
                    </div>
                  </li>
                </ul>
              </div>
            </template>
          </evan-dapp-wrapper-level-2>

          <evan-breadcrumbs :i18nScope="'_identities.breadcrumbs'">
            <template v-slot:content
              v-if="sideNav !== 0 && $store.state.uiIdentity && !$store.state.uiIdentity.loading && $store.state.uiIdentity.validity.exists">
              <div class="mr-4">
                <div class="spinner-border spinner-border-sm"
                  v-if="$store.state.uiIdentity.isFavoriteLoading">
                </div>
                <template v-if="!$store.state.uiIdentity.isFavoriteLoading">
                  <i class="fas fa-star lg text-warning clickable"
                    v-if="$store.state.uiIdentity.isFavorite"
                    @click="$store.state.uiIdentity.toggleFavorite(getRuntime())">
                  </i>
                  <i class="far fa-star lg clickable"
                    v-if="!$store.state.uiIdentity.isFavorite"
                    @click="$store.state.uiIdentity.toggleFavorite(getRuntime())">
                  </i>
                </template>
              </div>

              <button type="button" class="btn btn-primary btn-circle"
                @click="$store.state.uiIdentity.saveChanges(this, getRuntime())"
                :disabled="!$store.state.uiIdentity.dirty || $store.state.uiIdentity.isSaving">
                <div class="spinner-border spinner-border-sm"
                  v-if="$store.state.uiIdentity.isSaving">
                </div>
                <i class="fas fa-save lg" v-else></i>
              </button>
            </template>
          </evan-breadcrumbs>

          <transition name="fade" mode="out-in"
            v-if="$route.name.startsWith('base-') || ($store.state.uiIdentity && !$store.state.uiIdentity.loading)">
            <router-view></router-view>
          </transition>
          <evan-loading v-else></evan-loading>
        </template>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
  import IdentitiesRootComponent from './root.ts';
  export default IdentitiesRootComponent;
</script>

<style lang="scss" scoped>
  @import './root';
</style>
