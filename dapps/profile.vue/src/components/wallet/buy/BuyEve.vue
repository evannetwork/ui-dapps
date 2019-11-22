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
    <form @submit.prevent="buyEve">
      <h2>{{ '_wallet.buy-eves' | translate }}</h2>

      <div v-show="step === 0">
        <div>
          <!-- TODO type number not working -->
          <evan-form-control-input
            v-model="eveAmount"
            type="number"
            :label="$t('_wallet.eve-amount')"
            :required="true"
            min="10"
            step="5"
            :id="'eveAmount'"
          />
        </div>

        <div>
          <evan-form-control-select
            :id="'paymentMethods'"
            :options="paymentMethods"
            :label="$t('_wallet.select-payment-method')"
            :placeholder="$t('_evan.choose-here')"
            :required="true"
            @change="methodChangeHandler"
          ></evan-form-control-select>
        </div>

        <label for="stripeElement" v-if="selectedMethod === 'card'">{{ '_wallet.card' | translate }}</label>
        <div ref="stripeElement" id="stripeElement"></div>

        <p>
          <small>{{ '_wallet.disclaimer' | translate }}</small>
        </p>
      </div>

      <div v-show="step === 1">
        <template v-for="input in detailedInputs">
          <evan-form-control-input
            :key="input.id"
            :id="input.id"
            :label="input.label"
            :type="input.type"
            :placeholder="input.label"
            :required="true"
            v-model="input.value"
          />
        </template>
      </div>

      <div class="panel-footer">
        <button type="button" class="btn btn-block btn-primary" @click="step++" v-if="step === 0">
          <span>{{ '_evan.next' | translate }}</span>
        </button>

        <template v-else>
          <button type="button" class="btn btn-secondary" @click="step--">
            <span>{{ '_evan.back' | translate }}</span>
          </button>
          <button type="submit" class="btn btn-block btn-primary" :disabled="isLoading">
            <span
              class="spinner-border spinner-border-sm mr-3"
              role="status"
              aria-hidden="true"
              v-if="isLoading"
            ></span>
            <span>{{ '_evan.buy' | translate }}</span>
          </button>
        </template>
      </div>
    </form>
  </div>
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
}
</style>
