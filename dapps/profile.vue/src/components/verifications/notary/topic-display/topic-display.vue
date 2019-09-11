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
  <profile-verification-card type="filled">
    <evan-loading v-if="loading"></evan-loading>
    <template v-else>
      <svg width="60" height="56" viewBox="0 0 60 56" fill="none">
        <path d="M59.3333 28L52.8267 20.5867L53.7333 10.7733L44.1067 8.58666L39.0667 0.106659L30 3.99999L20.9333 0.106659L15.8933 8.58666L6.26666 10.7467L7.17333 20.56L0.666664 28L7.17333 35.4133L6.26666 45.2533L15.8933 47.44L20.9333 55.92L30 52L39.0667 55.8933L44.1067 47.4133L53.7333 45.2267L52.8267 35.4133L59.3333 28ZM24.6667 41.3333L14 30.6667L17.76 26.9067L24.6667 33.7867L48.92 9.67999L53.7333 10.7733L53.5813 12.4187L24.6667 41.3333Z" fill="black"/>
      </svg>
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
  </profile-verification-card>
</template>

<script lang="ts">
  import Component from './topic-display.ts';
  export default Component;
</script>
