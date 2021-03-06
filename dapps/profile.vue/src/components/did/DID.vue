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
    <evan-loading v-if="!didDocument" />
    <div
      v-else
      class="evan-content-container"
    >
      <evan-onpage-navigation
        class="d-none d-xxl-block"
        :entries="onPageEntries"
        scroll-container-selector=".scroll-container"
      />

      <div class="mb-3">
        <div class="mb-1 d-flex flex-row justify-content-between">
          <div>
            <h1>{{ $t('_profile.did.did-title') }} ({{ $t('_profile.did.did' ) }})</h1>
            <p>
              {{ $t('_profile.did.created-at') }} {{ didDocument.created | moment('L') }},
              &nbsp;
              {{ $t('_profile.did.updated-at') }} {{ didDocument.updated | moment('L') }}
            </p>
          </div>
          <div class="text-right">
            <evan-button
              v-if="!isEditMode"
              class="mr-1 btn-sm"
              :disabled="!hasEditRights"
              @click="onEditStart"
            >
              {{ $t('_evan.edit') }}
            </evan-button>
            <template v-else>
              <evan-button
                class="btn-sm"
                :disabled="isLoading"
                @click="onEditCancel"
              >
                {{ $t('_evan.cancel') }}
              </evan-button>
              <evan-button
                class="ml-1 btn-sm"
                type="primary"
                :disabled="!canSave"
                @click="saveDidDocument"
              >
                {{ $t('_evan.save') }}
              </evan-button>
              <div class="d-flex align-items-center">
                <i class="mdi mdi-information-outline mr-2" />
                <span>{{ $t('_evan.transaction_costs_hint') }}</span>
              </div>
            </template>

            <evan-button
              v-if="!isEditMode"
              class="btn-sm"
              @click="exportDidDoc"
            >
              {{ $t('_profile.did.export-document') }}
            </evan-button>
          </div>
        </div>
        <p>{{ $t('_profile.did.description') }}</p>
      </div>

      <div
        id="did"
        class="content-card mb-3"
      >
        <h2 class="card-heading">
          <i class="mr-1 mdi mdi-earth" />
          {{ $t('_profile.did.did-title') }}
        </h2>

        <table class="mt-3 w-100">
          <tbody>
            <tr>
              <td style="width: 60px">
                {{ $t('_profile.did.did') }}
              </td>
              <td>{{ didDocument.id }}</td>
              <td class="action">
                <evan-button
                  icon="mdi mdi-mdi mdi-content-copy"
                  type="icon-secondary"
                  size="sm"
                  @click="copyToClipboard(didDocument.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <service-endpoints
        id="service-endpoints"
        :endpoints="endpoints"
        :is-edit-mode="isEditMode"
        :is-loading="isLoading"
        class="mb-3"
        @updateEndpoints="onUpdateEndpoints"
      />

      <delegates
        id="delegates"
        :delegates="delegates"
        :is-edit-mode="isEditMode"
        :is-loading="isLoading"
        @addDelegate="onAddDelegate"
        @deleteDelegate="onDeleteDelegate"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Component from './DID';

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
