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
  <div>
    <evan-loading v-if="loading"></evan-loading>
    <template v-else>
      <notary-action-request
        ref="requestNotary"
        :address="address"
        @requested="checkNewRequests()">
      </notary-action-request>

      <notary-info-dialog ref="orgInfo" :address="address"></notary-info-dialog>

      <div class="white-box border-smooth rounded w-100 p-3 text-center"
        v-if="error">
        <h3>{{ '_profile.verifications.error' | translate }}</h3>
        <span>{{ '_profile.verifications.error-loading' | translate }}</span>
      </div>

      <profile-verification-card
        v-else-if="!requests.length === 0 && verifications.length === 0 || testMode">
        <i class="mdi mdi-plus"
          style="font-size: 80px;">
        </i>
        <h5 class="font-weight-semibold">
          {{ '_profile.verifications.notary.request-notary-verification' | translate }}
        </h5>

        <evan-button class="mt-5" type="secondary"
          @click="$refs.requestNotary.show();">
          {{ '_profile.verifications.notary.request.request-ident' | translate }}
        </evan-button>
        <evan-button type="link" size="sm"
          class="d-block  mt-1 text-muted"
          @click="$refs.orgInfo.show();">
          {{ '_profile.verifications.notary.learn-more' | translate }}
        </evan-button>
      </profile-verification-card>

      <template v-else>
        <div class="mt-3" v-if="verifications && verifications.length !== 0">
          <notary-verification-card
            :address="address"
            :verifications="verifications">
          </notary-verification-card>
        </div>
        <div class="mt-3" v-for="(requestId) in requests">
          <notary-verification-card
            :address="address"
            :requestId="requestId">
          </notary-verification-card>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './notary.ts';
  export default Component;
</script>
