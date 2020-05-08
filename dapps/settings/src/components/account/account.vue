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
    <div
      class="white-box mb-5"
    >
      <h3 class="mb-5 d-block">
        {{ $t('_settings.account.security-info') }}
      </h3>

      <div class="d-flex justify-content-center mt-3">
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
    </div>
  </div>
</template>

<script lang="ts">
import Component from './account';

export default Component;
</script>
