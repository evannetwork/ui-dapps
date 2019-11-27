/* Copyright (C) 2018-present evan GmbH. This program is free software: you can
redistribute it and/or modify it under the terms of the GNU Affero General
Public License, version 3, as published by the Free Software Foundation. This
program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along
with this program. If not, see http://www.gnu.org/licenses/ or write to the Free
Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA,
02110-1301 USA, or download the license from the following URL:
https://evan.network/license/ */

<template>
  <div>
    <evan-loading v-if="loading" />
    <div class="p-xxl-11 p-xl-6 p-3" v-else>
      <div class="d-flex flex-wrap">
        <evan-wallet-card :address="$route.params.address" />
        <div class="d-flex flex-column flex-grow-1 align-items-end justify-content-center">
          <evan-button
            :label="'_profile.wallet.send-eve.title' | translate"
            @click="activeMode = 1"
            style="min-width: 250px"
            type="secondary"
          />
          <evan-button
            :label="'_profile.wallet.buy-eve.title' | translate"
            @click="activeMode = 0"
            class="mt-2"
            style="min-width: 250px"
            type="secondary"
          />
        </div>
      </div>

      <div class="mt-5">
        <h1>Last Transactions</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, dolore
          distinctio porro eveniet facere eum saepe consequuntur aliquam
          error, ea, consequatur commodi pariatur. Dolore architecto, quos
          ipsum quidem id corrupti.
        </p>
      </div>
    </div>

    <evan-swipe-panel
      class="light"
      alignment="right"
      :title="'_wallet.buy-eves' | translate"
      :showBackdrop="windowWidth < 1200"
      :hideCloseButton="windowWidth >= 1200"
      :mountId="windowWidth < 1200 ? null : 'dapp-wrapper-sidebar-right'"
    >
      <template>
        <profile-buy-eve v-if="activeMode === 0" @init="buyEveComponent = $event" />
        <profile-send-eve v-else-if="activeMode === 1" />
      </template>

      <template slot="footer" v-if="!!buyEveComponent">
          
          <evan-button
            v-if="buyEveComponent.step === 0"
            type="primary"
            @click="buyEveComponent.step++"
            :label="'_evan.next' | translate"
          />

          <template v-else>
            <evan-button 
              type="secondary" 
              :label="'_evan.back' | translate" 
              @click="buyEveComponent.step--"
            />
            <evan-button
              type="primary"
              :isLoading="buyEveComponent.isLoading"
              :label="'_evan.buy' | translate"
              @click="buyEveComponent.buyEve()"
            />
          </template>
      </template>
    </evan-swipe-panel>
  </div>
</template>

<script lang="ts">
import Component from './wallet';
export default Component;
</script>

<style lang="scss">
@import './wallet.scss';
</style>
