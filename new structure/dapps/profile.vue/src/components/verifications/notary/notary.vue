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
  <div style="display: contents;">
    <evan-loading v-if="loading || reloading"></evan-loading>
    <template v-else>
      <div class="position-absolute">
        <notary-action-request
          ref="requestNotary"
          :address="address"
          @requested="checkNewRequests()">
        </notary-action-request>
        <notary-info-dialog ref="orgInfo" :address="address"></notary-info-dialog>
      </div>

      <div class="white-box border-smooth rounded w-100 p-3 text-center"
        v-if="error">
        <h3>{{ '_profile.verifications.error' | translate }}</h3>
        <span>{{ '_profile.verifications.error-loading' | translate }}</span>
      </div>

      <template v-else-if="$store.state.profileDApp.isMyProfile">
        <evan-card class="mt-3"
          icon="mdi mdi-plus"
          highlight="true"
          v-if="requests.length === 0 && verifications.length === 0 || testMode"
          :title="'_profile.verifications.notary.request-notary-verification' | translate">
          <template v-slot:actions>
            <evan-button type="secondary"
              @click="$refs.requestNotary.show();">
              {{ '_profile.verifications.notary.request.request-ident' | translate }}
            </evan-button>
            <evan-button type="link" size="sm"
              class="d-block  mt-1 text-muted"
              @click="$refs.orgInfo.show();">
              {{ '_profile.verifications.notary.learn-more' | translate }}
            </evan-button>
          </template>
        </evan-card>
        <evan-card class="mt-3"
          highlight="true"
          v-else-if="requests.length === 0 && verifications.length === 0 || testMode">
          <svg viewBox="0 0 38 38" fill="none">
            <path d="M37.6666 21.6667H21.6666V37.6667H16.3333V21.6667H0.333252V16.3333H16.3333V0.333328H21.6666V16.3333H37.6666V21.6667Z" fill="black"/>
          </svg>
          <h5 class="font-weight-semibold">
            {{ '_profile.verifications.notary.request-notary-verification' | translate }}
          </h5>

          <evan-button type="secondary"
            @click="$refs.requestNotary.show();">
            {{ '_profile.verifications.notary.request.request-ident' | translate }}
          </evan-button>
          <evan-button type="link" size="sm"
            class="d-block mt-1 text-muted"
            @click="$refs.orgInfo.show();">
            {{ '_profile.verifications.notary.learn-more' | translate }}
          </evan-button>
        </evan-card>
      </template>
      <template v-else-if="!verifications || verifications.length !== 0">
        {{ '_profile.verifications.no-verifications' | translate }}
      </template>

      <template v-if="verifications && verifications.length !== 0">
        <notary-verification-card
          :address="address"
          :verifications="verifications">
        </notary-verification-card>
      </template>
      <notary-verification-card
        v-for="(requestId) in requests"
        :address="address"
        :requestId="requestId">
      </notary-verification-card>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './notary';
  export default Component;
</script>
