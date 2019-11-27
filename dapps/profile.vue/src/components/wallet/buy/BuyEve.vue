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

        <div v-show="selectedMethod">
          <div class="stripeElementLabel">{{ `_wallet.${selectedMethod}` | translate }}</div>
          <div id="stripeElement" class="stripeElement"/>
          <small v-show="selectedMethod === 'iban'">
            {{ '_wallet.disclaimer' | translate }}
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
  </div>
</template>

<script lang="ts">
  import Component from './BuyEve';
  export default Component;
</script>

<style lang="scss">
  @import './BuyEve.scss';
</style>
