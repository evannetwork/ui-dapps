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
  <div class="content-card">
    <div class="mb-3 d-flex flex-row justify-content-between align-items-center">
      <h2>
        <i class="mr-1 mdi mdi-earth" />
        {{ $t('_profile.did.delegates-title') }}
      </h2>
    </div>
    <p>{{ $t('_profile.did.delegates-desc') }}</p>

    <evan-loading v-if="isLoading" />

    <evan-table
      v-else
      class="simple"
      :show-empty="!isEditMode"
      :fields="columns"
      :items="delegates"
    >
      <template #cell(did)="data">
        {{ data.item }}
      </template>

      <template #cell(action)="data">
        <evan-button
          v-show="isEditMode"
          class="btn-sm"
          type="icon-secondary"
          icon="mdi mdi-trash-can-outline"
          @click="deleteDelegate(data.index)"
        />
      </template>

      <template
        v-if="isEditMode"
        #bottom-row
      >
        <b-td colspan="3">
          <!-- $props and $attr binding with evan-form-control-v-select isn't ideal.
          Using "native" v-select instead -->
          <evan-v-select
            class="m-0"
            :value="null"
            :options="filteredContacts"
            :placeholder="$t('_profile.did.choose-contact')"
            :clear-search-on-select="true"
            @input="onSelectContact"
          >
            <template #no-options>
              {{ $t('_profile.did.no-delegate-options') }}
            </template>
          </evan-v-select>
        </b-td>
      </template>

      <template #empty>
        <span>{{ $t('_profile.did.delegates-empty') }}</span>
      </template>
    </evan-table>
  </div>
</template>

<script lang="ts">
import Component from './Delegates';

export default Component;
</script>

<style lang="scss" scoped>
.content-card {
  background: white;
  border-radius: 4px;
  padding: 24px 24px;
}
</style>
