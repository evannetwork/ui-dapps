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
    <h2>{{ '_profile.wallet.buy-eve.title' | translate }}</h2>
    <evan-loading v-if="loading" />
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

        <label for="stripeElement"
          v-if="selectedMethod === 'card'">
          {{ '_wallet.card' | translate }}
        </label>

        <div ref="stripeElement" id="stripeElement"></div>

        <p>
          <small>{{ '_wallet.disclaimer' | translate }}</small>
        </p>
      </div>

      <div v-show="step === 1">
        <evan-form
          :form="contactForm"
          :i18nScope="'_profile.company.contact'"
          :onlyForm="true"
          :stacked="true">
        </evan-form>
      </div>

      <div class="panel-footer">
        <evan-button
          :disabled="!payForm.isValid"
          :label="'_profile.wallet.buy-eve.continue' | translate"
          @click="step = 1"
          class="btn-block"
          type="primary"
          v-if="step === 0"
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
      </div>
    </template>
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
