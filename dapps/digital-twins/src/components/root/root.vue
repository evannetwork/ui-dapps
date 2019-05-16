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
        <template v-if="
          $route.path.indexOf(`digitaltwin.${ dapp.domainName }`) === -1 ||
          $route.path.indexOf(`digitaltwins.${ dapp.domainName }/datacontainer.digitaltwin.${ dapp.domainName }`) !== -1
        ">
          <evan-dapp-wrapper-level-2 ref="level2Wrapper"></evan-dapp-wrapper-level-2>
          <evan-breadcrumbs
            :i18nScope="'_digitaltwins.breadcrumbs'">
          </evan-breadcrumbs>
          <div class="evan-navigation-tabs">
            <a class="evan-tab bg-secondary text-white"
              id="dt-overview"
              :class="{ 'active': activeTab === 0 }"
              :href="`${ dapp.fullUrl }/overview`"
              @click="activeTab = 0">
              {{ '_digitaltwins.left-categories.my-digitaltwins.title' | translate }}
            </a>
            <a class="evan-tab bg-inverted text-white"
              id="dt-templates"
              :class="{ 'active': activeTab === 1 }"
              :href="`${ dapp.fullUrl }/templates`"
              @click="activeTab = 1">
              {{ '_digitaltwins.left-categories.my-templates.title' | translate }}
            </a>
          </div>
        </template>

        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
  import TwinsRootComponent from './root.ts';
  export default TwinsRootComponent;
</script>

