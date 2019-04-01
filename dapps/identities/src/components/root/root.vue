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
        <evan-dapp-wrapper-level-2>
          <template v-slot:content>
            <div class="w300">
              <div class="d-flex pl-4 pr-4 pt-3 pb-3 align-items-center justify-content-between">
                <h5 class="font-weight-bolder text-nowrap">
                  {{ '_identities.identities' | translate }}
                </h5>

                <a
                  class="btn btn-rounded btn-primary font-weight-normal"
                  :href="`${ dapp.fullUrl }/add`">
                  {{ '_identities.add' | translate }}
                  <i class="fas fa-arrow-right label ml-2"></i>
                </a>
              </div>

              <evan-loading v-if="loading"></evan-loading>
              <ul class="pl-4 pr-4 pb-4 border-bottom border-sm list-unstyled d-flex">
                <li class="mr-3">
                  <a 
                    :class="{ 'active border-bottom border-primary pb-1': leftPanelOverview, 'text-muted': !leftPanelOverview }"
                    :href="dapp.fullUrl"
                    @click="leftPanelOverview = true">
                    <b>{{ '_identities.overview' | translate }}</b>
                  </a>
                </li>
                <li class="mr-3" v-if="identity">
                  <a
                    :class="{ 'active border-bottom border-primary pb-1': !leftPanelOverview, 'text-muted': leftPanelOverview }"
                    :href="`${ dapp.fullUrl }/${ $store.state.identity.address }`"
                    @click="leftPanelOverview = false">
                    <b v-if="identity.address === 'add'">{{ '_identities.add-identity' | translate }}</b>
                    <b v-else>{{ $store.state.identity.dbcp.name }}</b>
                  </a>
                </li>
              </ul>

              <ul class="nav font-medium in w-100 mb-3 mt-auto" v-if="!loading">
                <li class="w-100 p-4 clickable"
                  v-for="(category, index) in leftPanelOverview ? overviewCategories : containerCagegories"
                  :class="{ 'active': category.active }"
                  @click="toggleLeftCategory(leftPanelOverview ? overviewCategories : containerCagegories, category)">
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
                          :href="`${ dapp.fullUrl }/${ subCategory.path }`">
                          {{ `_identities.left-categories.${ subCategory.name }` | translate }}
                        </a>
                      </li>
                    </ul>
                    <div class="text-center mt-3" v-else>
                      <a
                        class="btn btn-rounded btn-primary font-weight-normal"
                        :href="`${ dapp.fullUrl }/add`">
                        {{ '_identities.add' | translate }}
                        <i class="fas fa-arrow-right label ml-2"></i>
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </template>
        </evan-dapp-wrapper-level-2>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
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
