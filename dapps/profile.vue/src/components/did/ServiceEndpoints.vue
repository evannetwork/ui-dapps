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
        {{ '_profile.did.service-endpoints-title' | translate }}
      </h2>
    </div>
    <p>{{ '_profile.did.service-endpoints-desc' | translate }}</p>

    <evan-loading v-if="isLoading" />
    <evan-table
      v-else
      class="simple"
      :show-empty="!isEditMode"
      :fields="columns"
      :items="endpoints"
    >
      <template v-slot:empty>
        {{ '_profile.did.empty-service-endpoints' }}
      </template>

      <template
        v-if="isEditMode"
        v-slot:cell(label)="data"
      >
        <evan-form-control-input
          class="m-0"
          required
          :placeholder="'_profile.did.label-placeholder' | translate"
          :value="data.item.label"
          @input="editLabel($event, data)"
        />
      </template>

      <template
        v-if="isEditMode"
        v-slot:cell(url)="data"
      >
        <evan-form-control-input
          class="table-input m-0"
          type="url"
          required
          :placeholder="'_profile.did.url-placeholder' | translate"
          :value="data.item.url"
          @input="editUrl($event, data)"
        />
      </template>

      <template v-slot:cell(action)="data">
        <evan-button
          v-show="isEditMode"
          class="btn-sm"
          type="icon-secondary"
          icon="mdi mdi-trash-can-outline"
          @click="deleteEndpoint(data.index)"
        />
      </template>

      <template
        v-if="isEditMode"
        v-slot:bottom-row
      >
        <b-td>
          <evan-form-control-input
            v-model="newLabel"
            class="m-0"
            :placeholder="'_profile.did.label-placeholder' | translate"
          />
        </b-td>
        <b-td>
          <evan-form-control-input
            v-model="newUrl"
            class="table-input m-0"
            type="url"
            required
            :placeholder="'_profile.did.url-placeholder' | translate"
            @input="validateUrl"
          />
        </b-td>
        <b-td>
          <evan-button
            type="icon-secondary"
            icon="mdi mdi-plus"
            class="btn-sm"
            :disabled="!newLabel || !newUrl"
            @click="addEndpointRow"
          />
        </b-td>
      </template>

      <template v-slot:empty>
        <span>{{ '_profile.did.service-endpoints-empty' | translate }}</span>
      </template>
    </evan-table>
  </div>
</template>

<script lang="ts">
import Component from './ServiceEndpoints';

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
