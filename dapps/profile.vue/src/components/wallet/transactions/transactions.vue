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
  <div class="profile-transactions">
    <h3 class="font-weight-bold">
      {{ '_profile.wallet.transactions.title' | translate }}
    </h3>
    <span
      v-html="
        $t('_profile.wallet.transactions.description', {
          explorerUrl: explorerTransactionsUrl
        })
      "
    />

    <evan-loading v-if="loading" />
    <template v-else>
      <evan-base-list
        v-if="transactions.length === 0"
        :data="[null]"
        class="mt-5"
      >
        <template
          v-slot:item
          style="height: 80px;"
        >
          <div
            class="p-3 h-100 d-flex justify-content-center align-items-center"
          >
            <p class="mb-0 font-weight-semibold">
              {{ '_profile.wallet.transactions.empty' | translate }}
            </p>
          </div>
        </template>
      </evan-base-list>

      <evan-base-list
        v-else
        class="mt-5"
        :data="renderedTransactions()"
      >
        <template
          v-slot:item="{ item }"
          style="height: 80px;"
        >
          <div class="d-flex align-items-center h-100 px-3">
            <template v-if="item.type === 'creditCharged'">
              <i
                class="mdi mdi-credit-card-outline mr-3"
                style="font-size: 2rem;"
              />
              <div>
                <p class="mb-0 font-weight-semibold">
                  {{
                    '_profile.wallet.transactions.credit-charged' | translate
                  }}
                </p>
                <small class="text-muted">
                  {{ '_profile.wallet.transactions.charged-at' | translate }}
                  {{ item.timestamp | moment('LLL') }}
                </small>
              </div>
              <span class="mx-auto" />
              <span :class="{ 'text-primary': item.amount > 0 }">
                <template v-if="item.amount > 0">+</template>
                {{ item.amount.toFixed(2) }} EVE
              </span>
            </template>
            <template v-else>
              <i
                style="font-size: 2rem;"
                :class="{
                  'mr-3 mdi': true,
                  'mdi-progress-close text-red':
                    item.type === 'failedTransaction',
                  'mdi-progress-upload': item.type === 'transferringTransaction'
                }"
              />
              <div>
                <p class="mb-0 font-weight-semibold">
                  <template v-if="item.type === 'failedTransaction'">
                    {{
                      '_profile.wallet.transactions.credit-failed-charge'
                        | translate
                    }}
                  </template>
                  <template v-else>
                    {{
                      '_profile.wallet.transactions.credit-running-charge'
                        | translate
                    }}
                  </template>
                </p>
                <small class="text-muted">
                  {{ '_profile.wallet.transactions.charged-at' | translate }}
                  {{ item.timestamp | moment('LLL') }}
                </small>
              </div>
              <span class="mx-auto" />
              <span :class="{ 'text-muted': item.amount > 0 }">
                <template v-if="item.amount > 0">+</template>
                {{ item.amount.toFixed(2) }} EVE
              </span>
            </template>
          </div>
        </template>
      </evan-base-list>

      <div class="text-center mt-3">
        <evan-button
          v-if="displayedTransactions < transactions.length"
          type="secondary"
          :label="'_profile.wallet.transactions.load-more' | translate"
          @click="displayedTransactions += 5"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Component from './transactions';

export default Component;
</script>

<style lang="scss">
@import './transactions.scss';
</style>
