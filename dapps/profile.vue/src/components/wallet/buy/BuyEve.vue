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
    <evan-swipe-panel
      class="light"
      alignment="right"
      :title="'_profile.wallet.buy-eve.title' | translate"
      :showBackdrop="windowWidth < 1200"
      :hideCloseButton="windowWidth >= 1200"
      :mountId="windowWidth < 1200 ? null : 'dapp-wrapper-sidebar-right'"
      :isOpen="$store.state.uiState.swipePanel === 'buyEve'"
    >
      <evan-loading v-if="loading" />
      <evan-success v-else-if="success" />
      <!-- start content -->
      <template v-else>
        
        <evan-modal
          ref="acceptModal"
          :maxWidth="'600px'">
          <template v-slot:header>
            <h5 class="modal-title">
              {{ `_profile.wallet.buy-eve.accept.title` | translate }}
            </h5>
          </template>
          <template v-slot:body>
            <span v-html="
              $t(`_profile.wallet.buy-eve.accept.description`, {
                amount: payform.amount.value,
              })
            " />
          </template>
          <template v-slot:footer>
            <evan-button
              @click="buyEve(); $refs.acceptModal.hide()"
              type="primary">
              {{ '_profile.wallet.buy-eve.accept.send' | translate }}
            </evan-button>
          </template>
        </evan-modal>

        <div v-show="step === 0">
          <evan-form
            :form="payForm"
            :i18nScope="'_profile.wallet.buy-eve.payForm'"
            :onlyForm="true"
            :stacked="true">
          </evan-form>

          <div class="my-3">
            <div class="stripeElementLabel">
              {{ `_profile.wallet.buy-eve.payForm.type.${ payForm.type.value }` | translate }}
            </div>
            <div id="stripeElement" class="stripeElement"/>
            <small
              class="text-muted"
              v-if="stripe.error && stripe.error.code">
              {{ `_profile.wallet.buy-eve.stripe-element.${ stripe.error.code }` }}
            </small>
            <small v-show="payForm.type.value === 'iban'">
              {{ '_profile.wallet.buy-eve.disclaimer' | translate }}
            </small>
          </div>
        </div>

        <div v-show="step === 1">
          <evan-form
            :form="contactForm"
            :i18nScope="'_profile.company.contact'"
            :onlyForm="true"
            :stacked="true">
          </evan-form>
        </div>
      </template>
      <!-- end content -->

      <template slot="footer">  
        <evan-button
          v-if="step === 0"
          :disabled="!payForm.isValid || !(stripe.element && stripe.complete && !stripe.error)"
          :label="'_profile.wallet.buy-eve.continue' | translate"
          @click="step = 1"
          type="primary"
        />
            
        <div class="w-100" v-else>
          <div class="text-center mb-3">
            <span class="text-muted mb-3 d-block"
              v-if="reverseCharge"
              v-html="$t('_profile.wallet.buy-eve.reverse-charge')"
            />
            <small>
              {{ payForm.amount.value.toFixed(2) }} EVE x
              {{ '1€' }} + {{ taxValue }}
              ({{ (parseFloat(payForm.amount.value) / 100 * taxValue).toFixed(2) + '€' }})
            </small>
            <h3 class="mt-1">
              {{ '_profile.wallet.buy-eve.total-amount' | translate }}:
              {{ (payForm.amount.value + (parseFloat(payForm.amount.value) / 100 * taxValue)).toFixed(2) }} {{ '€' }}
            </h3>
          </div>

          <div class="d-flex">
            <evan-button
              type="secondary"
              @click="step--"
              :label="'_profile.wallet.buy-eve.back' | translate"
            />
            <evan-button
              :disabled="!payForm.isValid || !contactForm.isValid || vatCalcTimeout"
              :label="'_profile.wallet.buy-eve.buy' | translate"
              @click="$refs.acceptModal.show()"
              class="ml-3 btn-block"
              type="primary"
            />
          </div>
        </div>
      </template>
    </evan-swipe-panel>
  </div>
</template>

<script lang="ts">
  import Component from './BuyEve';
  export default Component;
</script>

<style lang="scss">
  @import './BuyEve.scss';
</style>