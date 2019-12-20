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
*/

<template>
  <div>
    <evan-loading v-if="loading"></evan-loading>
    <div class="white-box border-smooth rounded"
      v-else-if="error">
      <div class="header">
        <h3 class="m-0 font-weight-semibold">
          {{ '_datacontainer.no-permissions.title' | translate }}
        </h3>
      </div>
      <p class="content"
        v-html="$t('_datacontainer.no-permissions.desc')">
      </p>
    </div>
    <template v-else>
      <evan-nav-tabs class="flex-shrink-0"
        v-if="tabs.length > 1"
        :tabs="tabs"
        @init="$set(reactiveRefs, 'navTabs', $event)">
      </evan-nav-tabs>
      <div class="container-wide overflow-y-auto flex-grow-1">
        <div class="d-flex mb-5 align-items-center"
          style="min-height: 45px">
          <div style="width: 50%;">
            <h3 class="font-weight-bold mb-0 force-oneline bg-level-3">
              {{ entryName }}
            </h3>
          </div>
          <span class="mx-auto"></span>
          <dc-set-actions
            v-if="reactiveRefs.navTabs"
            :containerAddress="containerAddress"
            :entryName="entryName"
            :displayMode="'buttons'"
            :setActions="true"
            :schemaActions="
              reactiveRefs.navTabs.activeTab === 0 ||
              reactiveRefs.navTabs.activeTab === 1
            "
            :listActions="
              reactiveRefs.setActions &&
              reactiveRefs.setActions.entryType === 'array' &&
              reactiveRefs.navTabs.activeTab === 0
            "
            @init="$set(reactiveRefs, 'setActions', $event)">
          </dc-set-actions>
        </div>

        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './set.ts';
  export default Component;
</script>
