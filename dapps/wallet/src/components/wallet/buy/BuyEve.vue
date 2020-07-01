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
      :title="panelTitle"
      alignment="right"
      class="light"
      @hide="$store.state.uiState.swipePanel = ''"
      @show="$nextTick(() => renderStripeElement())"
    >
      <evan-loading v-if="loading" />
      <div
        v-else-if="buying"
        class="flex-center text-center"
      >
        <div><evan-loading /></div>
        <div>{{ '_wallet.buy-eve.processing-hint' | translate }}</div>
      </div>
      <div
        v-else-if="stripe.success"
        class="flex-center text-center"
      >
        <div><evan-success /></div>
        <div v-html="$t('_wallet.buy-eve.success')" />
        <evan-button
          :label="'_wallet.buy-eve.buy-more' | translate"
          class="mt-3"
          type="primary"
          @click="initialize()"
        />
      </div>
      <div
        v-else-if="!!stripe.payError"
        class="flex-center text-center"
      >
        <div><evan-failed /></div>
        <div v-html="$t(`_wallet.buy-eve.errors.${stripe.payError}`)" />
        <evan-button
          :label="'_wallet.buy-eve.try-again' | translate"
          class="mt-3"
          type="primary"
          @click="removeStripeError()"
        />
      </div>

      <!-- start content -->
      <div
        v-else
        v-show="step === 1"
      >
        <evan-form
          :form="contactForm"
          :i18n-scope="'_wallet.company.contact'"
          :only-form="true"
          :stacked="true"
        />
      </div>

      <!-- do not remove the stripe element from dom! -->
      <div v-show="step === 0 && !loading">
        <evan-form
          :form="payForm"
          :i18n-scope="'_wallet.buy-eve.payForm'"
          :only-form="true"
          :stacked="true"
        />

        <template>
          <label class="col-form-label">
            {{
              `_wallet.buy-eve.payForm.type.${payForm.type.value}`
                | translate
            }}
          </label>
          <div
            id="stripeElement"
            class="stripeElement"
          />
          <small
            v-if="stripe.error && stripe.error.code"
            class="text-red"
          >
            {{
              `_wallet.buy-eve.stripe-element.${stripe.error.code}`
                | translate
            }}
          </small>
          <small
            v-if="payForm.type.value === 'iban'"
            class="disclaimer text-muted"
          >
            {{ '_wallet.buy-eve.disclaimer' | translate }}
          </small>
        </template>
      </div>
      <!-- end content -->

      <template
        v-if="!loading"
        slot="footer"
      >
        <evan-button
          v-if="step === 0"
          :disabled="
            !payForm.isValid ||
              !(stripe.element && stripe.complete && !stripe.error)
          "
          :label="'_wallet.buy-eve.continue' | translate"
          type="primary"
          class="w-100"
          @click="step = 1"
        />

        <!-- keep displayed but hidden, so the loading circle is displayed correctly -->
        <div
          v-else
          :class="{ invisible: buying || stripe.success || stripe.payError }"
          class="w-100"
        >
          <div class="text-center mb-3">
            <div
              v-if="vatCalcTimeout"
              class="vat-loading"
            >
              <div class="spinner-border text-primary" />
            </div>

            <span
              v-if="reverseCharge"
              class="text-muted mb-3"
            >
              {{ '_wallet.buy-eve.reverse-charge' | translate }}
            </span>
            <span>
              {{ '_wallet.buy-eve.reverse-charge-please-check' | translate }}
            </span>
            <small>
              {{ parseFloat(payForm.amount.value).toFixed(2) }} EVE x
              {{ '1€' }} + {{ taxValue }}%
              {{ '_wallet.buy-eve.vat' | translate }} ({{
                ((parseFloat(payForm.amount.value) / 100) * taxValue).toFixed(
                  2
                ) + '€'
              }})
            </small>
            <h3 class="mt-1">
              {{ '_wallet.buy-eve.total-amount' | translate }}:
              {{
                (
                  parseFloat(payForm.amount.value) +
                  (parseFloat(payForm.amount.value) / 100) * taxValue
                ).toFixed(2)
              }}
              {{ '€' }}
            </h3>
          </div>

          <div class="d-flex">
            <evan-button
              type="secondary"
              :label="'_wallet.buy-eve.back' | translate"
              @click="step--"
            />
            <evan-button
              id="execute-payment"
              :disabled="
                !payForm.isValid || !contactForm.isValid || !!vatCalcTimeout
              "
              :label="'_wallet.buy-eve.buy' | translate"
              class="ml-3 btn-block"
              type="primary"
              @click="buyEve()"
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
