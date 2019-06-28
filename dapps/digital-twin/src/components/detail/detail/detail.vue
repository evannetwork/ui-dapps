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
  <div class="d-flex flex-column h-100">
    <div class="container-wide"
      v-if="uiDT.validity.error">
      <div class="white-box border-smooth rounded">
        <div class="header">
          <h3 class="m-0 font-weight-semibold">
            {{ '_digitaltwins.detail.error.title' | translate }}
          </h3>
        </div>
        <div class="content"
          v-html="$t('_digitaltwins.detail.error.desc')">
        </div>
      </div>
    </div>
    <template v-else>
      <evan-nav-tabs class="flex-shrink-0"
        :tabs="tabs"
        @init="$set(reactiveRefs, 'navTabs', $event)">
      </evan-nav-tabs>
      <div class="container-wide overflow-y-auto flex-grow-1">
        <div class="d-flex mb-5 align-items-center">
          <h3 class="font-weight-bold mb-0 force-oneline bg-level-3 w-100">
            {{ uiDT.dbcp.description }}
          </h3>
          <span class="mx-auto"></span>
          <dt-actions
            v-if="reactiveRefs.navTabs"
            :uiDT="uiDT"
            :dtActions="true"
            :containerActions="reactiveRefs.navTabs.activeTab === 0"
            :displayMode="'buttons'">
          </dt-actions>
        </div>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './detail.ts';
  export default Component;
</script>
