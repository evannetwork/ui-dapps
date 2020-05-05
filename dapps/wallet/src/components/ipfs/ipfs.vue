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
    <evan-loading v-if="loading" />
    <div
      v-else
      class="evan-content-container"
    >
      <div class="mb-3">
        <div class="mb-1 d-flex flex-row justify-content-between">
          <div>
            <h1>{{ $t('_wallet.ipfs.storage-fees') }}</h1>
          </div>
          <p>{{ $t('_wallet.ipfs.storage-fees-description') }}</p>
        </div>
      </div>

      <div
        id="ipfs-status"
        class="content-card mb-3"
      >
        <h2 class="card-heading">
          <i class="mr-1 mdi mdi-earth" />
          {{ $t('_wallet.ipfs.status-title') }}
        </h2>

        <table class="mt-3 w-100">
          <tbody>
            <tr>
              <td style="width: 150px">
                {{ $t('_wallet.ipfs.available-funds') }}
              </td>
              <td>{{ channelStatus.fundsAvailable }}</td>
            </tr>
            <tr>
              <td style="width: 150px">
                {{ $t('_wallet.ipfs.monthly-costs') }}
              </td>
              <td>{{ channelStatus.monthlyPayments }}</td>
            </tr>
            <tr>
              <td style="width: 150px">
                {{ $t('_wallet.ipfs.stored-files') }}
              </td>
              <td>{{ channelStatus.pinnedHashes }}</td>
            </tr>
            <tr>
              <td style="width: 150px">
                {{ $t('_wallet.ipfs.stored-size') }}
              </td>
              <td>{{ channelStatus.overallSize }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        id="ipfs-status"
        class="content-card mb-3"
      >
        <h2 class="card-heading">
          <i class="mr-1 mdi mdi-earth" />
          {{ $t('_wallet.ipfs.actions-title') }}
        </h2>
        <div class="row">
          <div class="col-8">
            <evan-form-control-input
              id="newUrl"
              v-model="amount"
              class="m-0"
            />
          </div>
          <div class="col-4">
            <evan-button
              class="nav-button"
              type="secondary"
              :label="'Open Channel'"
              @click="openChannel();"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from './ipfs';

export default Component;
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 64px 24px;
}
.content-card {
  background: white;
  border-radius: 4px;
  width: 100%;
  padding: 24px 24px;

  .card-heading {
    font-size: 18px;
    font-weight: bold;
  }
}
.action {
  width: 48px;
  text-align: right;
}
</style>
