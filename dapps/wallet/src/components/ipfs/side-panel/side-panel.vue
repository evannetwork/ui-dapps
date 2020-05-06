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
    <evan-swipe-panel
      :hide-close-button="windowWidth >= 1400"
      :is-open="$store.state.uiState.swipePanel === 'buyEve'"
      :mount-id="windowWidth < 1400 ? null : 'dapp-wrapper-sidebar-right'"
      :show-backdrop="windowWidth < 1400"
      :title="'_wallet.ipfs.top-up.title' | translate"
      alignment="right"
      class="light"
      @hide="$store.state.uiState.swipePanel = ''"
    >
      <evan-form
        :disabled="toppingUp"
        :form="topupForm"
        :i18n-scope="'_wallet.ipfs.top-up.form'"
        :only-form="true"
        :stacked="true"
      />

      <template slot="footer">
        <evan-button
          v-if="isLoading"
          id="evan-eve-send"
          :disabled="!topupForm.isValid || toppingUp"
          :is-loading="toppingUp"
          :label="$t(toppingUp ? '_wallet.ipfs.top-up.topping-up' : '_wallet.ipfs.top-up.top-up')"
          class="w-100"
          type="primary"
          @click="topupPaymentChannel()"
        />
      </template>
    </evan-swipe-panel>
  </div>
</template>

<script lang="ts">
import Component from './side-panel';

export default Component;
</script>
