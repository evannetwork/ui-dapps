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
  <form @submit.prevent="buyEve">
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
        @change="methodChangeHandler"
      ></evan-form-control-select>
    </div>

    <div ref="card" id="card"></div>
    <p>
      <small>
        MOCK By entering your IBAN and confirming this payment, you authorize
        evan GmbH and Stripe, our payment service provider, to send
        instructions to your bank to debit your account and your bank to debit
        your account in accordance with these instructions. You are entitled
        to a refund from your bank in accordance with the terms of your
        agreement with your bank. A refund must be requested within 8 weeks of
        the date your account was debited.
      </small>
    </p>
    <div class="panel-footer">
      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        <span
          class="spinner-border spinner-border-sm mr-3"
          role="status"
          aria-hidden="true"
          v-if="isLoading"
        ></span>
        <span>{{ '_evan.buy' | translate }}</span>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import Component from './BuyEve';
export default Component;
</script>

<style lang="scss">
@import '~@evan.network/ui/src/style/utils';

.panel-footer {
  display: flex;
  width: 100%;
  padding: 24px;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid cssVar('border-color-2');
  bottom: 0;
  left: 0;
  position: absolute;
  background: cssVar('bg-level-1');

  &.relative {
    position: relative;
    padding: 24px 0;
  }

  button.btn-primary {
    width: 100%;
    margin-left: 20px;
  }
}
</style>
