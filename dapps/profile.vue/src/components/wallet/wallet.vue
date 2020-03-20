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
    <evan-loading v-if="loading" />
    <div
      v-else
      class="p-xxl-11 p-xl-6 p-3"
    >
      <div class="d-flex flex-wrap justify-content-center">
        <evan-wallet-card :address="$store.state.profileDApp.address" />
        <div
          class="d-flex flex-column flex-grow-1 align-items-center justify-content-center align-items-lg-end p-3"
        >
          <evan-button
            class="nav-button"
            type="secondary"
            :disabled="balance < 0.1"
            :label="'_profile.wallet.send-eve.title' | translate"
            @click="
              activeMode = 1;
              $store.state.uiState.swipePanel = 'sendEve';
            "
          />
          <evan-button
            class="mt-2 nav-button"
            type="secondary"
            :label="'_profile.wallet.buy-eve.titles.buy-eve' | translate"
            @click="
              activeMode = 0;
              $store.state.uiState.swipePanel = 'buyEve';
            "
          />
        </div>
      </div>

      <profile-transactions class="mt-10" />
    </div>

    <profile-buy-eve v-if="activeMode === 0" />
    <profile-send-eve v-if="activeMode === 1" />
  </div>
</template>

<script lang="ts">
import Component from './wallet';

export default Component;
</script>

<style lang="scss" scoped>
.nav-button {
  // fixed width of the wallet card
  max-width: 323px;
  width: 100%;
}
</style>
