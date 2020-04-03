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
      class="white-box mt-5"
    >
      <h3 class="mb-5 d-block">
        {{ '_settings.account.security-info' | translate }}
      </h3>

      <div class="d-flex justify-content-center mt-3">
        <evan-button
          class="mr-3"
          type="danger"
          @click="exportPrivateKey()"
        >
          {{ '_settings.account.private-key.title' | translate }}
        </evan-button>
        <evan-button
          type="danger"
          @click="exportEncryptionKey()"
        >
          {{ '_settings.account.encryption-key.title' | translate }}
        </evan-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from './account';

export default Component;
</script>
