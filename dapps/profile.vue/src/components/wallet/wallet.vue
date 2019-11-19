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

<script src="https://js.stripe.com/v3/"></script>

<template>
  <div class="row">
    <div class="p-xxl-11 p-xl-6 p-3 col-12">
      <div class="row">
        <div class="col-xl-6">
          <evan-wallet-card :address="$route.params.address" />
        </div>
        <div class="col-xl-4 d-flex">
          <evan-button>Test</evan-button>
          <evan-button>Test</evan-button>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-xl-12">
          <h1>Last Transactions</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, dolore
            distinctio porro eveniet facere eum saepe consequuntur aliquam
            error, ea, consequatur commodi pariatur. Dolore architecto, quos
            ipsum quidem id corrupti.
          </p>
        </div>
      </div>
      <!-- <evan-swipe-panel
        :alignment="'right'"
        :showBackdrop="true"
      ></evan-swipe-panel> -->
    </div>
    <evan-swipe-panel
      class="light"
      alignment="right"
      ref="wallet-sidebar"
      :showBackdrop="windowWidth < 1200"
      :hideCloseButton="windowWidth >= 1200"
      :mountId="windowWidth < 1200 ? null : 'dapp-wrapper-sidebar-right'"
    >
      <h1>Buy EVEs</h1>

      <div>
        <label for="eveAmount">{{ '_wallet.eve-amount' | translate }}</label>
        <input
          class="form-control"
          type="number"
          required
          min="10"
          step="1"
          id="eveAmount"
          ref="eveAmount"
        />
      </div>

      <div>
        <label for="payment_provider">{{ '_wallet.select-payment-method' | translate }}</label>
        <evan-form-control-select
          :id="payment_provider"
          :options="payment_providers"
          :placeholder="$t('_evan.choose-here')"
        ></evan-form-control-select>
      </div>

      <p>
        <small>
          MOCK By entering your IBAN and confirming this payment, you authorize evan
          GmbH and Stripe, our payment service provider, to send instructions to
          your bank to debit your account and your bank to debit your account in
          accordance with these instructions. You are entitled to a refund from
          your bank in accordance with the terms of your agreement with your bank.
          A refund must be requested within 8 weeks of the date your account was
          debited.
        </small>
      </p>

      <div class="sr-root">
        <div class="sr-main">
          <form id="payment-form" class="sr-payment-form">
            <div class="sr-combo-inputs-row">
              <div class="sr-input sr-card-element" id="card-element"></div>
            </div>
            <div class="sr-field-error" id="card-errors" role="alert"></div>
            <button id="submit">
              <div class="spinner hidden" id="spinner"></div>
              <span id="button-text">Pay</span><span id="order-amount"></span>
            </button>
          </form>
          <div class="sr-result hidden">
            <p>Payment completed<br /></p>
            <pre>
              <code></code>
            </pre>
          </div>
        </div>
      </div>

      <button @click="buyEve">BUY</button>

      <div class="panel-footer" :class="{'relative': this.relative}">
        <evan-button type="secondary" :label="$t('_evan.cancel')" />
        <evan-button
          type="primary"
          :label="$t('_evan.sharing.update')"
        />
      </div>
    </evan-swipe-panel>
    <!-- <div class="col-xl-4 col-xxl-3 wallet-side-panel light">
      <h1>Buy EVEs</h1>

      <div>
        <label for="eveAmount">{{ '_wallet.eve-amount' | translate }}</label>
        <input
          class="form-control"
          type="number"
          required
          min="10"
          step="1"
          id="eveAmount"
          ref="eveAmount"
        />
      </div>

      <div>
        <label for="payment_provider">{{ '_wallet.select-payment-method' | translate }}</label>
        <evan-form-control-select
          :id="payment_provider"
          :options="payment_providers"
          :placeholder="$t('_evan.choose-here')"
        ></evan-form-control-select>
      </div>

      <p>
        <small>
          MOCK By entering your IBAN and confirming this payment, you authorize evan
          GmbH and Stripe, our payment service provider, to send instructions to
          your bank to debit your account and your bank to debit your account in
          accordance with these instructions. You are entitled to a refund from
          your bank in accordance with the terms of your agreement with your bank.
          A refund must be requested within 8 weeks of the date your account was
          debited.
        </small>
      </p>
    </div> -->
  </div>
</template>

<script lang="ts">
import Component from './wallet';
export default Component;
</script>

<style lang="scss">
@import './wallet.scss';
</style>
