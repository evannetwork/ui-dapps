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
      <template #empty>
        {{ '_profile.did.empty-service-endpoints' }}
      </template>

      <template
        v-if="isEditMode"
        #cell(id)="data"
      >
        <evan-form-control-input
          class="m-0"
          required
          :placeholder="'_profile.did.id-placeholder' | translate"
          :value="data.item.id"
          @input="editId($event, data)"
        />
      </template>

      <template
        v-if="isEditMode"
        #cell(type)="data"
      >
        <evan-form-control-input
          class="m-0"
          required
          :placeholder="'_profile.did.type-placeholder' | translate"
          :value="data.item.type"
          @input="editType($event, data)"
        />
      </template>

      <template
        v-if="isEditMode"
        #cell(url)="data"
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

      <template #cell(action)="data">
        <evan-button
          v-show="isEditMode"
          class="btn-sm"
          type="icon-secondary"
          icon="mdi mdi-trash-can-outline"
          @click="deleteEndpoint(data.index)"
        />
      </template>

      <!-- New Endpoint Row -->
      <template
        v-if="isEditMode"
        #bottom-row
      >
        <b-td>
          <FormulateInput
            v-model="newId"
            type="text"
            name="newId"
            validation="required"
            :placeholder="'_profile.did.id-placeholder' | translate"
          />
        </b-td>
        <b-td>
          <FormulateInput
            v-model="newType"
            type="text"
            name="newType"
            validation="required"
            :placeholder="'_profile.did.id-placeholder' | translate"
          />
        </b-td>
        <b-td>
          <FormulateInput
            v-model="newUrl"
            type="url"
            name="newUrl"
            validation="required|url"
            :placeholder="'_profile.did.url-placeholder' | translate"
          />
        </b-td>
        <b-td>
          <evan-button
            type="icon-secondary"
            icon="mdi mdi-plus"
            class="btn-sm"
            :disabled="!newId || !newUrl || !newType"
            @click="addEndpointRow"
          />
        </b-td>
      </template>

      <template #empty>
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
@import '~@evan.network/ui/src/style/utils';

.content-card {
  background: white;
  border-radius: 4px;
  padding: 24px 24px;
}

.simple {
  tr > td {
    padding: 0.5em;
  }
}

/deep/ .formulate-input {
  .formulate-input-wrapper {
    input, textarea {
      font-size: 12px;

      color: cssVar('gray-900');
      border: 1px solid cssVar('gray-500');

      display: block;
      width: 100%;
      height: calc(1.5em + 0.8rem + 2px);
      padding: 0.4rem 1.125rem;
      line-height: 1.5;
      background-clip: padding-box;
      border-radius: 5px;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

      &:focus {
        border: 1px solid cssVar('primary');
      }

      &[disabled] {
        color: cssVar('gray-600');
        border: 1px solid cssVar('gray-200');
      }
    }
  }

  /deep/ .formulate-input-errors {
    list-style: none;
    padding: 0;

    .formulate-input-error {
      color: cssVar('danger');
    }
  }

  // TODO: Discuss if we need danger border too
  // &[data-has-errors="true"] {
  //   input, textarea {
  //     border: 1px solid cssVar('danger');
  //   }
  // }
}
</style>
