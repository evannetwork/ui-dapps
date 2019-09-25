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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

<template>
  <evan-card class="mt-3" type="filled">
    <evan-loading v-if="loading"></evan-loading>
    <template v-else>
      <i class="mdi mdi-check-decagram"></i>
      <h5 class="font-weight-semibold">
        {{ title }}
      </h5>
      <small class="mb-2">
        {{ '_profile.verifications.notary.title' | translate }}
      </small>
      <small>
        {{ '_profile.verifications.notary.verification.verified-by' | translate }}
      </small>
      <small class="text-muted">
        {{ verification.verifications[0].details.issuer }}
      </small>

      <!-- <a v-for="(file, index) in files"
        :id="`file-input-download-${ index }`"
        :href="file.blobUri"
        :download="file.name">
        <i class="mdi mdi-download-outline"></i>
      </a> -->

      <button type="button"
        class="btn btn-primary mt-3"
        v-if="verification.status === 'yellow'"
        :disabled="accepting"
        @click="acceptVerification()">
        {{ `_profile.verifications.notary.verification.accept` | translate }}
      </button>
    </template>
  </evan-card>
</template>

<script lang="ts">
  import Component from './topic-display';
  export default Component;
</script>
