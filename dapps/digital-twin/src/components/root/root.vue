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
              <div class="bg-level-1" style="width: 360px">
                <evan-loading
                  v-if="$store.state.uiDT.loading && !$store.state.uiDT.initialized">
                </evan-loading>

                <template v-else>
                  <div class="evan-tree">
                    <div class="evan-tree-entry"
                      :class="{ 'active': isActive() }"
                      @contextmenu="$refs.dtActions.showDropdown($event)">
                      <i class="toggle-icon"
                        :class="{
                          'mdi mdi-chevron-up': isTreeOpen,
                          'mdi mdi-chevron-down': !isTreeOpen,
                        }"
                        @click="isTreeOpen = !isTreeOpen">
                      </i>
                      <a
                        :href="`${ twinUrl }/dt-detail`">
                        {{ $store.state.uiDT.dbcp.name }}
                      </a>

                      <dt-actions
                        ref="dtActions"
                        :uiDT="$store.state.uiDT"
                        :dtActions="true"
                        :containerActions="true"
                        :displayMode="'dropdownHidden'">
                      </dt-actions>
                    </div>

                    <dc-tree
                      v-if="isTreeOpen"
                      v-for="(container, index) in $store.state.uiDT.containers"
                      :address="container.address"
                      :baseUrl="twinUrl"
                      :dbcp="container.description">
                    </dc-tree>
                  </div>
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
