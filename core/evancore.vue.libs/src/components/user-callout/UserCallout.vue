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
      <evan-loading v-if="isChangingRuntime" />
      <div
        v-else
        class="active-identity"
        style="width:100%; height:64px"
        @click="show = !show"
      >
        <evan-profile-preview
          :address="$store.state.runtime.activeIdentity"
          :disable-link="true"
          size="sm-plus"
          class="callout-profile-preview main"
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
        class="callout-button identity-settings"
        :href="`#/${dapp.rootEns}/settings.${dapp.domainName}/identity`"
        @click="show = false"
      >
        {{ $t('_evan.user-callout.identity-settings') }}
        <div class="mx-auto" />
        <i
          class="mdi mdi-settings-outline"
          style="font-size: 18px"
        />
      </evan-button>

      <!-- Switch identity -->
      <template v-if="identities.length">
        <div class="switch">
          {{ $t('_evan.user-callout.switch-identity') }}
        </div>

        <a
          v-for="identity in identities"
          :key="identity"
          class="d-block switch-identity"
          @click="switchIdentity(identity)"
        >
          <evan-profile-preview
            size="sm"
            :address="identity"
            :disable-link="true"
          />
        </a>

        <div class="divider-wrapper">
          <hr class="divider">
        </div>
      </template>

      <evan-button class="callout-button">
        {{ $t('_evan.user-callout.create-new-identity') }}
        <div class="mx-auto" />
        <i
          class="mdi mdi-plus"
          style="font-size: 18px"
        />
        <evan-tooltip placement="right">
          {{ $t('_evan.coming-soon') }}
        </evan-tooltip>
      </evan-button>

      <evan-button
        id="evan-logout"
        class="callout-button"
        @click="$refs.logout.logout()"
      >
        {{ $t('_evan.logout') }}
        <div class="mx-auto" />
        <i
          class="mdi mdi-power"
        />
      </evan-button>
    </div>

    <evan-logout ref="logout" />

    <b-overlay
      :show="show || isChangingRuntime"
      blur="0"
      variant="dark"
      opacity="0.5"
      :z-index="isChangingRuntime ? 999 : 998"
      no-center
      fixed
      no-wrap
      @click="show = false"
    >
      <template #overlay>
        <div
          v-if="isChangingRuntime"
          class="switching-identity"
        >
          <div>
            <p>
              {{ $t('_evan.switching-identity') }}
            </p>
          </div>
        </div>

        <div
          v-else
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
