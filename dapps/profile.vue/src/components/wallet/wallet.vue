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

    <evan-swipe-panel
      class="light"
      alignment="right"
      :title="getSwipePanelTitle()"
      :showBackdrop="windowWidth < 1200"
      :hideCloseButton="windowWidth >= 1200"
      :mountId="windowWidth < 1200 ? null : 'dapp-wrapper-sidebar-right'"
    >
      <profile-buy-eve
        v-if="activeMode === 0"
        @init="buyEveComponent = $event"
      />
      <profile-send-eve
        v-else-if="activeMode === 1"
        @init="sendEveComponent = $event"
      />

      <template slot="footer" v-if="!!buyEveComponent || !!sendEveComponent">
          <template v-if="activeMode === 0 && buyEveComponent">
            <evan-button
              v-if="buyEveComponent.step === 0"
              :disabled="!buyEveComponent.payForm.isValid"
              :label="'_profile.wallet.buy-eve.continue' | translate"
              @click="buyEveComponent.step = 1"
              type="primary"
            />
            
            <div class="w-100" v-else>
              <div class="text-center mb-3">
                <span class="text-muted mb-3 d-block"
                  v-if="buyEveComponent.reverseCharge"
                  v-html="$t('_profile.wallet.buy-eve.reverse-charge')"
                />
                <small>
                  {{ buyEveComponent.payForm.amount.value.toFixed(2) }} EVE x
                  {{ '1€' }} + {{ buyEveComponent.taxValue }}
                  ({{ (parseFloat(buyEveComponent.payForm.amount.value) / 100 * buyEveComponent.taxValue).toFixed(2) + '€' }})
                </small>
                <h3 class="mt-1">
                  {{ '_profile.wallet.buy-eve.total-amount' | translate }}:
                  {{ (buyEveComponent.payForm.amount.value + (parseFloat(buyEveComponent.payForm.amount.value) / 100 * buyEveComponent.taxValue)).toFixed(2) }} {{ '€' }}
                </h3>
              </div>

              <div class="d-flex">
                <evan-button
                  type="secondary"
                  @click="buyEveComponent.step--"
                  :label="'_profile.wallet.buy-eve.back' | translate"
                />
                <evan-button
                  :disabled="!buyEveComponent.payForm.isValid || !buyEveComponent.contactForm.isValid || buyEveComponent.vatCalcTimeout"
                  :label="'_profile.wallet.buy-eve.buy' | translate"
                  @click="buyEveComponent.$refs.acceptModal.show()"
                  class="ml-3 btn-block"
                  type="primary"
                />
              </div>
            </div>
          </template>
          <template v-else-if="activeMode === 1 && sendEveComponent">
            <!-- <evan-button
              :disabled="!sendEveComponent.form.isValid || sendEveComponent.sending"
              :isLoading="sendEveComponent.sending"
              :label="'_profile.wallet.send-eve.send' | translate"
              @click="sendEveComponent.$refs.acceptModal.show()"
              type="primary">
            </evan-button> -->
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
