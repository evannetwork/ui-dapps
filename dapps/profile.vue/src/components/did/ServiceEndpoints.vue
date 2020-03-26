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
        {{ $t('_profile.did.service-endpoints-title') }}
      </h2>
    </div>
    <p>{{ $t('_profile.did.service-endpoints-desc') }}</p>

    <evan-loading v-if="isLoading" />

    <ValidationObserver
      v-else
      v-slot="{ invalid }"
      slim
    >
      <form
        :key="formKey"
        @submit.prevent="onSubmitRow"
      >
        <evan-table
          class="simple"
          :show-empty="!isEditMode"
          :fields="columns"
          :items="endpoints"
        >
          <template #empty>
            {{ $t('_profile.did.empty-service-endpoints') }}
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
              <ValidationProvider
                name="newId"
                :rules="{
                  required,
                  excluded: endpointIds,
                  startsWith: 'did:'
                }"
                slim
              >
                <div slot-scope="{ errors }">
                  <evan-form-control-input
                    v-model="newId"
                    class="m-0"
                  />
                  <span>{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
            </b-td>
            <b-td>
              <ValidationProvider
                name="newType"
                rules="required"
                slim
              >
                <div slot-scope="{ errors }">
                  <evan-form-control-input
                    v-model="newType"
                    class="m-0"
                  />
                  <span>{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
            </b-td>
            <b-td>
              <ValidationProvider
                name="newUrl"
                rules="required|url"
                slim
              >
                <div slot-scope="{ errors }">
                  <evan-form-control-input
                    v-model="newUrl"
                    class="m-0"
                  />
                  <span>{{ errors[0] }}</span>
                </div>
              </ValidationProvider>
            </b-td>
            <b-td>
              <evan-button
                native-type="submit"
                type="icon-secondary"
                icon="mdi mdi-plus"
                class="btn-sm"
                :disabled="invalid"
              />
            </b-td>
          </template>

          <template #empty>
            <span>{{ $t('_profile.did.service-endpoints-empty') }}</span>
          </template>
        </evan-table>
      </form>
    </ValidationObserver>
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
  padding: 24px 24px;
}

.simple {
  tr > td {
    padding: 0.5em;
  }
}
</style>
