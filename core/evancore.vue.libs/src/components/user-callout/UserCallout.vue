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
    <div
      class="callout"
      :class="{ active: show }"
    >
      <div
        class="active-account"
        style="width:100%; height:64px"
      >
        <evan-profile-preview
          :address="$store.state.runtime.activeIdentity"
        />
      </div>

      <evan-button
        class="toggle-button btn-sm"
        type="icon"
        @click="show = !show"
      >
        <i
          class="mdi"
          :class="{ 'mdi-chevron-down': show, 'mdi-chevron-up': !show }"
        />
      </evan-button>

      <div class="divider-wrapper">
        <hr class="divider">
      </div>

      <evan-button
        class="callout-button account-settings"
      >
        {{ $t('_evan.user-callout.account-settings') }}
        <div class="mx-auto" />
        <i
          class="mdi mdi-settings-outline"
          style="font-size: 18px"
        />
      </evan-button>

      <!-- Switch Account -->
      <template v-if="accounts">
        <div class="switch">
          {{ $t('_evan.user-callout.switch-account') }}
        </div>

        <a
          v-for="account in accounts"
          :key="account.id"
          class="d-block switch-account"
        >
          <evan-profile-preview
            size="sm-plus"
            :address="$store.state.runtime.activeIdentity"
          />
        </a>

        <div class="divider-wrapper">
          <hr class="divider">
        </div>
      </template>

      <evan-button class="callout-button">
        {{ $t('_evan.user-callout.create-new-account') }}
        <div class="mx-auto" />
        <i
          class="mdi mdi-plus"
          style="font-size: 18px"
        />
      </evan-button>

      <evan-button
        class="callout-button"
        @click="$refs.logout.logout()"
      >
        {{ $t('_evan.logout') }}
        <div class="mx-auto" />
        <i
          class="mdi mdi-power"
          style="font-size: 18px"
        />
      </evan-button>
    </div>

    <evan-logout ref="logout" />

    <b-overlay
      :show="show"
      blur="0"
      variant="dark"
      opacity="0.5"
      z-index="1000"
      no-center
      fixed
      no-wrap
      @click="show = false"
    >
      <template #overlay>
        <div
          class="close-overlay"
          @click="show = false"
        />
      </template>
    </b-overlay>
  </div>
</template>

<script lang="ts">
import Component from './UserCallout';

export default Component;
</script>

<style lang="scss" scoped>
@import './UserCallout.scss';
</style>
