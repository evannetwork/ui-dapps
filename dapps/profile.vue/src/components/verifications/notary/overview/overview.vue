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
  <div class="container-wide">
    <div class="d-flex align-items-center mb-5">
      <div class="d-flex align-items-center">
        <h3 class="font-weight-bold mb-0">
          {{ '_profile.ident.notary.title' | translate }}
        </h3>

        <button class="btn btn-icon ml-3" @click="loadRequests(true)">
          <i class="mdi mdi-reload"></i>
          <evan-tooltip :placement="'bottom'">
            {{ `_profile.ident.notary.reload` | translate }}
          </evan-tooltip>
        </button>
      </div>
      <span class="mx-auto"></span>
      <!-- v-if="testMode || (requests.length === 0 && verifications.length === 0)" -->

      <span class="mx-auto"></span>
      <div v-if="!loading">
        <org-ident-notary-request
          ref="identAction"
          @requested="checkNewRequests()">
        </org-ident-notary-request>

        <template v-if="canIssue">
          <org-ident-notary-issue
            ref="orgIdentIssue">
          </org-ident-notary-issue>
          <button type="button" class="btn btn-primary "
            id="ident-request"
            @click="$refs.orgIdentIssue.show()">
            {{ `_profile.ident.notary.issue.issue` | translate }}
            <i class="mdi mdi-arrow-right label ml-3"></i>
          </button>
        </template>
      </div>
    </div>

    <evan-loading v-if="loading"></evan-loading>
    <template v-else>
      <div class="white-box border-smooth rounded w-100 p-3 text-center" v-if="error">
        <h3>{{ '_profile.ident.error' | translate }}</h3>
        <span>{{ '_profile.ident.error-loading' | translate }}</span>
      </div>
      <div class="white-box border-smooth rounded w-100 text-center"
        v-else-if="reloading">
        <div class="white-box content text-center">
          <evan-loading></evan-loading>
          <h4>{{ '_profile.ident.notary.check-updates' | translate }}</h4>
        </div>
      </div>
      <div class="white-box border-smooth rounded w-100 text-center"
        v-else-if="requests.length === 0 && verifications.length === 0 || testMode">
        <div class="content">
          {{ '_profile.ident.notary.no-requests' | translate }}
          <br>
          <button class="btn btn-primary  mt-3" target="_blank"
            :id="`ident-request-unknown`"
            @click="$refs.identAction.show()">
            {{ `_profile.ident.notary.status-actions.unknown-long` | translate }}
            <i class="mdi mdi-plus right"></i>
          </button>
        </div>
      </div>
      <div v-if="!rerender">
        <div class="mt-3" v-if="verifications && verifications.length !== 0">
          <org-ident-notary-detail
            :verifications="verifications">
          </org-ident-notary-detail>
        </div>
        <div class="mt-3" v-for="(requestId) in requests">
          <org-ident-notary-detail
            :requestId="requestId">
          </org-ident-notary-detail>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './overview.ts';
  export default Component;
</script>
