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
        {{ '_profile.did.delegates-title' | translate }}
      </h2>
    </div>
    <p>{{ '_profile.did.delegates-desc' | translate }}</p>

    <evan-loading v-if="isLoading" />

    <evan-table
      v-else
      class="simple"
      :show-empty="true"
      :fields="columns"
      :items="delegates"
    >
      <template v-slot:empty>
        {{ '_profile.did.empty-delegates' }}
      </template>

      <template
        v-if="isEditMode"
        v-slot:cell(label)="data"
      >
        <evan-form-control-input
          class="clean-input"
          :value="data.item.label"
        />
      </template>

      <template
        v-if="isEditMode"
        v-slot:cell(url)="data"
      >
        <evan-form-control-input
          class="clean-input"
          :value="data.item.url"
        />
      </template>

      <template v-slot:cell(action)="data">
        <evan-button
          v-show="isEditMode"
          type="icon-secondary"
          icon="mdi mdi-trash-can-outline"
          @click="deleteDelegate(data.index)"
        />
      </template>

      <template
        v-if="isEditMode"
        v-slot:bottom-row
      >
        <b-td colspan="3">
          <!-- $props and $attr binding with evan-form-control-v-select isn't ideal.
          Using "native" v-select instead -->
          <evan-v-select
            class="m-0"
            :value="null"
            :options="contacts"
            :placeholder="'_profile.did.choose-contact' | translate"
            :clear-search-on-select="true"
            @input="onSelectContact"
          />
        </b-td>
      </template>

      <template v-slot:empty>
        <span>{{ '_profile.did.delegates-empty' | translate }}</span>
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
  width: 560px;
  padding: 24px 24px;
}
</style>
