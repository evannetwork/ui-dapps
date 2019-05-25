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
      <evan-dapp-wrapper-level-2 ref="level2Wrapper"
        v-if="!digitalTwinAddress">
        <template v-slot:content>
          <div style="width: 360px">
            <dt-tree-root
              :url="`${ twinUrl }/dt-detail`"
              :topic="`_digitaltwins.breadcrumbs.plugin`"
              :title="description.name"
              :icon="`mdi mdi-note-multiple-outline`"
              @rightClick="$refs.pluginActions.showDropdown($event)">
              <template v-slot:context-menu>
                <i class="mdi mdi-dots-vertical clickable"
                  @click="$refs.pluginActions.showDropdown($event)">
                </i>

                <dc-plugin-actions
                  ref="pluginActions"
                  :pluginName="pluginName"
                  :pluginActions="true"
                  :setActions="false"
                  :displayMode="'dropdownHidden'">
                </dc-plugin-actions>
              </template>
            </dt-tree-root>

            <div class="border-bottom border-sm pt-3">
              <dc-tree
                :address="pluginName"
                :baseUrl="twinUrl"
                :dbcp="description"
                :onlySets="true">
              </dc-tree>
            </div>
          </div>
        </template>
      </evan-dapp-wrapper-level-2>
      <evan-nav-tabs class="flex-shrink-0"
        :tabs="tabs">
      </evan-nav-tabs>
      <div class="container-wide overflow-y-auto">
        <div class="d-flex mb-3 align-items-center">
          <div class="flex-truncate" style="max-width: 50%;">
            <h3 class="font-weight-bold mb-0">
              {{ description.name }}
            </h3>
            <p class="text-muted font-weight-semibold m-t-0">
              {{ description.description }}
            </p>
          </div>
          <span class="mx-auto"></span>
          <div>
            <dc-plugin-actions
              :pluginName="pluginName"
              :pluginActions="true"
              :setActions="false"
              :displayMode="'buttons'">
            </dc-plugin-actions>
          </div>
        </div>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './plugin.ts';
  export default Component;
</script>
