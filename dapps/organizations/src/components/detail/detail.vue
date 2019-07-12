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
    <template v-else>
      <evan-dapp-wrapper-level-2 ref="level2Wrapper">
        <template v-slot:content>
          <div style="width: 300px">
            <div class="bg-level-1 border-bottom border-sm evan-triangle left">
              <div class="px-3 pt-3">
                <small class="text-muted text-uppercase font-weight-semibold">
                  {{ `_org.breadcrumbs.${ $store.state.organization.type }` | translate }}
                </small>
              </div>
              <div class="d-flex align-items-center px-3 py-4">
                <a class="d-flex align-items-center dark-link active"
                  :href="`${ dapp.fullUrl }/${ $route.params.address }`">
                  <i class="mdi mdi-domain text-muted mr-2" style="font-size: 17px;" />
                  <h6 class="m-0 font-weight-semibold">
                    {{ $store.state.organization.alias }}
                  </h6>
                </a>
                <span class="mx-auto" />
                <div class="position-relative d-flex align-items-center">
                </div>
              </div>
            </div>

            <template v-for="(category, index) in categories">
              <div class="d-flex align-items-center pl-3 pr-3 py-3"
                style="height: 60px;">
                <button class="btn mini mr-3"
                  @click="category.isOpen = !category.isOpen"
                  v-if="!creating">
                  <i
                    :class="{
                      'mdi mdi-chevron-up': category.isOpen,
                      'mdi mdi-chevron-down': !category.isOpen,
                    }">
                  </i>
                </button>
                <a
                  class="d-flex align-items-center dark-link"
                  :class="{ 'active': `${ dapp.baseUrl }#${ $route.path }`.indexOf(category.route) !== -1 }"
                  :href="`${ dapp.fullUrl }/${ $route.params.address }/${ category.route }`"
                  @click="category.isOpen = true; hideSidebar2();">
                  <i class="text-muted mr-2"
                    style="font-size: 17px"
                    :class="category.icon">
                  </i>
                  <span class="m-0 font-weight-semibold">
                    {{ category.title | translate }}
                  </span>
                </a>
                <span class="mx-auto"></span>
                <div class="position-relative d-flex align-items-center">
                 
                </div>
              </div>
              <template v-if="category.isOpen">
                <div class="d-flex align-items-center pl-8 pr-3 py-2"
                  style="height: 40px;"
                  v-for="(child, index) in category.children">
                  <a
                    class="d-flex align-items-center dark-link"
                    :class="{ 'active': `${ dapp.baseUrl }#${ $route.path }/${ child.route }`.indexOf(`${ category.route }/${ child.route }`) !== -1 }"
                    :href="`${ dapp.fullUrl }/${ $route.params.address }/${ category.route }/${ child.route }`"
                    @click="hideSidebar2();">
                    <span class="position-relative">
                      <i class="text-muted mr-2"
                        style="font-size: 17px"
                        :class="child.icon">
                      </i>
                      <span class="m-0">{{ child.title | translate }}</span>
                    </span>
                  </a>
                  <span class="mx-auto"></span>
                </div>
              </template>
            </template>
          </div>
        </template>
      </evan-dapp-wrapper-level-2>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './detail.ts';
  export default Component;
</script>
