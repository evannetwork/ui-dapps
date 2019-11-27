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
    <form>
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
            :value="selectedMethod"
            :options="paymentMethods"
            :label="$t('_wallet.select-payment-method')"
            :placeholder="$t('_evan.choose-here')"
            :required="true"
            @change="methodChangeHandler"
          />
        </div>
      
        <div v-show="selectedMethod">
          <div class="stripeElementLabel">{{ `_wallet.${selectedMethod}` | translate }}</div>
          <div id="stripeElement" class="stripeElement"/>
          <small v-show="selectedMethod === 'iban'">
            {{ '_wallet.disclaimer' | translate }}
          </small>
        </div>
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
    </form>
</template>

<script lang="ts">
  import Component from './BuyEve';
  export default Component;
</script>

<style lang="scss">
  @import './BuyEve.scss';
</style>