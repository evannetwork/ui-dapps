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
  <div class="white-box border-smooth rounded p-4 d-flex flex-wrap align-items-center"
    :id="`org-ident-detail-${ $route.params.address }`">
    <evan-loading v-if="loading"></evan-loading>
    <div v-else-if="error">
      <h5 class="d-block mb-0 font-weight-semibold">
        {{ '_profile.ident.notary.account-id' | translate }}
      </h5>
      <span>{{ $route.params.address }}</span>
      <h5 class="d-block mb-0 font-weight-semibold">
        {{ '_profile.ident.notary.status.title' | translate }}
      </h5>
      <span>{{ '_profile.ident.notary.request-error' | translate }}</span>
    </div>
    <template v-else>
      <div>
        <h5 class="d-block mb-0 font-weight-semibold">
          {{ '_profile.ident.notary.account-id' | translate }}
        </h5>
        <span>{{ $route.params.address }}</span>

        <h5 class="d-block mb-0 font-weight-semibold mt-3">
          {{ '_profile.ident.notary.status.title' | translate }}

          <i class="mdi mdi-information-outline text-muted clickable">
            <evan-tooltip
              ref="infoTooltip"
              :placement="'right'"
              multiline="true">
              <div class="p-3">
                <span>{{ '_profile.ident.notary.info' | translate }}</span>
                <div class="w-100 text-center mt-3">
                  <u class="clickable"
                    @click="$refs.orgInfo.show(); $refs.infoTooltip.onMouseLeave();">
                    {{ '_profile.ident.notary.learn-more' | translate }}
                  </u>
                </div>
              </div>
            </evan-tooltip>
          </i>
        </h5>

        <org-ident-info-dialog ref="orgInfo"></org-ident-info-dialog>

        <p class="m-0">{{ `_profile.ident.notary.status.${ details.status || 'unknown' }` | translate }}</p>
      </div>
      <span class="mx-auto"></span>
      <div>
        <button class="btn btn-primary " target="_blank"
          v-if="statusActions.indexOf(details.status) !== -1"
          :id="`ident-request-${ details.status }`"
          :disabled="details.status === 'issued' && accepting"
          @click="runStatusAction()">
          {{ `_profile.ident.notary.status-actions.${ details.status }` | translate }}
          <div class="spinner-border spinner-border-sm text-light ml-3" v-if="details.status === 'issued' && accepting"></div>
        </button>
      </div>

      <template v-if="details.status === 'finished'">
        <org-ident-notary-verification
          class="mt-3 w-100"
          v-for="(topic, index) in details.verifications"
          :address="$route.params.address"
          :title="(
            topic.endsWith('company') ?
              '_profile.ident.notary.verification.organization' :
              '_profile.ident.notary.verification.organization-random'
            ) | translate"
          :topic="topic">
        </org-ident-notary-verification>
      </template>
      <org-ident-notary-request
        ref="identAction"
        v-if="details.status === 'unknown'">
      </org-ident-notary-request>

      <org-ident-notary-pin
        ref="identAction"
        v-if="details.status === 'requested' || details.status === 'confirming'"
        :requestId="requestId">
      </org-ident-notary-pin>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './detail.ts';
  export default Component;
</script>
