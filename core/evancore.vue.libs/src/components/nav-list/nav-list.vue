/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received button copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/
*/

<template>
  <div class="evan-nav-list">
    <slot name="header">
      <evan-profile-preview
        v-if="showProfile"
        class="p-4"
        size="sm"
        :address="$store.state.runtime.activeIdentity"
      />
    </slot>
    <div class="nav-entries">
      <template v-for="(entry, index) in entries">
        <!-- Render spacer -->
        <div
          v-if="!entry"
          :key="index"
          class="flex-grow-1"
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
            :class="[{ 'active': isActive }]"
            :disabled="entry.disabled"
            @click="onClick(entry, route)"
          >
            <i
              v-if="entry.icon"
              class="mr-3"
              :class="entry.icon"
            />
            {{ entry.text | translate }}
          </button>
        </router-link>
      </template>

      <button
        v-if="showLogout"
        id="evan-logout"
        class="mt-auto"
        @click="$refs.logoutComp.logout();"
      >
        <i class="mr-3 mdi mdi-logout" />
        {{ '_evan.logout' | translate }}
      </button>
    </div>
    <evan-logout
      v-if="showLogout"
      ref="logoutComp"
      disable-button="true"
    />
  </div>
</template>

<script lang="ts">
import Component from './nav-list';

export default Component;
</script>

<style lang="scss" scoped>
  @import './nav-list.scss';
</style>
