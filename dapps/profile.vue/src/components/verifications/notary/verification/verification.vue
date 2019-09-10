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
  <div class="border bg-level-2 p-3 border-sm"
    :id="`identification-verification-${ topic.replace('/') }`">
    <div class="text-center" v-if="loading">
      <div class="spinner-border spinner-border-sm"></div>
    </div>
    <div v-else>
      <div class="d-flex align-items-center">
        <div class="">
          <b class="mb-0 font-weight-semibold">{{ title }}</b>
          <p class="mt-1 mb-0">
            {{ topic }}
          </p>
        </div>
        <span class="mx-auto"></span>
        <i class="mdi"
          style="font-size: 30px;"
          :class="{
            'mdi-alert-circle-outline text-danger': verification.status === 'red',
            'mdi-checkbox-marked-circle-outline text-warning': verification.status === 'yellow',
            'mdi-checkbox-marked-circle-outline text-success': verification.status === 'green',
          }">
        </i>
      </div>
      <i class="d-block mt-3 small"
        v-if="verification.status === 'red'">
        {{ '_profile.ident.notary.verification.incorrect' | translate }}
      </i>
      <evan-file-input
        id="issued-files" ref="files"
        v-model="files"
        :disabled="true">
      </evan-file-input>
      <button type="button" class="btn btn-primary  mt-3"
        id="ident-pin-print"
        v-if="verification.status === 'yellow'"
        :disabled="accepting"
        @click="acceptVerification()">
        {{ `_profile.ident.notary.verification.accept` | translate }}
        <div class="spinner-border spinner-border-sm text-light ml-3" v-if="accepting"></div>
        <i class="mdi mdi-arrow-right label ml-3" v-else></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './verification.ts';
  export default Component;
</script>
