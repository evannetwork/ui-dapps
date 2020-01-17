/*
  Copyright (C) 2018-present evan GmbH. This program is free software: you can
  redistribute it and/or modify it under the terms of the GNU Affero General
  Public License, version 3, as published by the Free Software Foundation. This
  program is distributed in the hope that it will be useful, but WITHOUT ANY
  WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
  PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
  You should have received a copy of the GNU Affero General Public License along
  with this program. If not, see http://www.gnu.org/licenses/ or write to the Free
  Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA,
  02110-1301 USA, or download the license from the following URL:
  https://evan.network/license/
*/

<template>
  <div>
    <evan-loading v-if="loading" />
    <div class="p-xxl-11 p-xl-6 p-3" v-else>
      <div class="d-flex flex-wrap">
        <evan-wallet-card :address="$route.params.address" />
        <div
          class="d-flex flex-column flex-grow-1 align-items-end justify-content-center"
        >
          <evan-button
            :label="'_profile.wallet.send-eve.title' | translate"
            @click="
              activeMode = 1;
              $store.state.uiState.swipePanel = 'sendEve';
            "
            style="min-width: 250px"
            type="secondary"
            :disabled="balance < 0.1"
          />
          <evan-button
            :label="'_profile.wallet.buy-eve.titles.buy-eve' | translate"
            @click="
              activeMode = 0;
              $store.state.uiState.swipePanel = 'buyEve';
            "
            class="mt-2"
            style="min-width: 250px"
            type="secondary"
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
