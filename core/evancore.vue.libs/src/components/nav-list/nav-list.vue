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
  <div class="evan-nav-list">
    <evan-logout
      v-if="showLogout"
      ref="logoutComp"
      disable-button="true"
    />
    <slot name="header">
      <evan-profile-preview
        v-if="showProfile"
        class="p-4"
        size="sm"
        :address="$store.state.runtime.activeAccount"
      />
    </slot>
    <div class="nav-entries">
      <template v-for="(entry, index) in entries">
        <!-- Render spacer -->
        <span
          v-if="!entry"
          :key="index"
          class="my-auto"
        />
        <!-- Render nav item -->
        <router-link
          v-else
          :key="index"
          v-slot="{ route, isActive }"
          :to="entry.to"
        >
          <button
            :id="entry.id"
            :class="[
              { 'active': isActive },
              `entry-${ index + 1 }`
            ]"
            :disabled="entry.disabled"
            @click="onClick(entry, route)"
          >
            <i
              class="mr-3"
              :class="entry.icon"
            />
            {{ entry.text | translate }}
          </button>
        </router-link>
      </template>
    </div>

    <div
      v-if="showLogout"
      class="nav-entries"
      style="flex: 0"
    >
      <a
        id="evan-logout"
        @click="$refs.logoutComp.logout();"
      >
        <i class="mr-3 mdi mdi-logout" />
        {{ '_evan.logout' | translate }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Component from './nav-list';

export default Component;
</script>
