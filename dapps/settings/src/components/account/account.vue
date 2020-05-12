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
  <div class="evan-content-container">
    <evan-loading v-if="loading" />
    <template v-else>
      <h3 class="d-block">
        {{ $t('_settings.account.info.title') }}
      </h3>

      <evan-base-list
        class="mt-5"
        :data="loginInfoList"
      >
        <template
          v-slot:item="{ item }"
          style="height: 80px;"
        >
          <div class="d-flex align-items-center h-100 px-3">
            <div>
              <p class="mb-0 font-weight-semibold">
                {{ $t(item.title) }}
              </p>
            </div>
            <span class="mx-auto" />
            <span>
              {{ item.value }}
            </span>
          </div>
        </template>
      </evan-base-list>

      <h3 class="mt-7 d-block">
        {{ $t('_settings.account.security-info') }}
      </h3>

      <div
        class="mt-5 white-box d-flex justify-content-center"
      >
        <evan-button
          class="mr-3"
          type="danger"
          @click="exportPrivateKey()"
        >
          {{ $t('_settings.account.private-key.title') }}
        </evan-button>
        <evan-button
          class="mr-3"
          type="danger"
          @click="exportEncryptionKey()"
        >
          {{ $t('_settings.account.encryption-key.title') }}
        </evan-button>
        <evan-button
          type="danger"
          @click="exportRuntimeConfig()"
        >
          {{ $t('_settings.account.runtime-config.title') }}
        </evan-button>
      </div>

      <h3 class="mt-7 d-block">
        {{ $t('_settings.account.localStorage.title') }}
      </h3>
      <p>
        {{ $t('_settings.account.localStorage.desc') }}
      </p>

      <evan-base-list
        class="localstorage-list mt-5"
        :data="localStorageParams"
      >
        <template
          v-slot:item="{ item }"
          style="height: 80px;"
        >
          <div class="d-flex align-items-center h-100 px-3">
            <div>
              <p class="mb-0 font-weight-semibold">
                {{ $t(item) }}
              </p>
            </div>
            <span class="mx-auto" />
            <div style="width: 80%">
              <evan-form-control-textarea
                class="mb-0"
                :value="localStorage[item]"
                @input="onLocalStorageChange(item, $event)"
              />
            </div>
          </div>
        </template>
      </evan-base-list>
    </template>
  </div>
</template>

<script lang="ts">
import Component from './account';

export default Component;
</script>

<style lang="scss" scoped>
@import '~@evan.network/ui/src/style/utils';
/deep/ {
  .localstorage-list {
    li {
      height: auto;
      padding: 10px;
    }
  }
}
</style>
