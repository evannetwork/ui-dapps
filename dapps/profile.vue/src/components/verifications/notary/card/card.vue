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
  <div class="white-box border-smooth rounded p-4 d-flex flex-wrap align-items-center">
    <evan-loading v-if="loading"></evan-loading>
    <div v-else-if="error">
      <h5 class="d-block mb-0 font-weight-semibold">
        {{ '_profile.verifications.notary.account-id' | translate }}
      </h5>
      <span>{{ $route.params.address }}</span>
      <h5 class="d-block mb-0 font-weight-semibold">
        {{ '_profile.verifications.notary.status.title' | translate }}
      </h5>
      <span>{{ '_profile.verifications.notary.request-error' | translate }}</span>
    </div>
    <template v-else>
      <div>
        <h5 class="d-block mb-0 font-weight-semibold">
          {{ '_profile.verifications.notary.account-id' | translate }}
        </h5>
        <span>{{ $route.params.address }}</span>

        <h5 class="d-block mb-0 font-weight-semibold mt-3">
          {{ '_profile.verifications.notary.status.title' | translate }}

          <i class="mdi mdi-information-outline text-muted clickable">
            <evan-tooltip multiline="true"
              ref="infoTooltip"
              :placement="'right'">
              <div class="p-3">
                <span>{{ '_profile.verifications.notary.info' | translate }}</span>
                <div class="w-100 text-center mt-3">
                  <u class="clickable"
                    @click="$refs.orgInfo.show();">
                    {{ '_profile.verifications.notary.learn-more' | translate }}
                  </u>
                </div>
              </div>
            </evan-tooltip>
          </i>
        </h5>

        <notary-info-dialog ref="orgInfo" :address="address"></notary-info-dialog>

        <p class="m-0">{{ `_profile.verifications.notary.status.${ details.status || 'unknown' }` | translate }}</p>
      </div>
      <span class="mx-auto"></span>
      <div>
        <button class="btn btn-primary " target="_blank"
          v-if="statusActions.indexOf(details.status) !== -1"
          :disabled="details.status === 'issued' && accepting"
          @click="runStatusAction()">
          {{ `_profile.verifications.notary.status-actions.${ details.status }` | translate }}
          <div class="spinner-border spinner-border-sm text-light ml-3" v-if="details.status === 'issued' && accepting"></div>
        </button>
      </div>

      <template v-if="details.status === 'finished'">
        <notary-topic-display
          class="mt-3 w-100"
          v-for="(topic, index) in details.verifications"
          :address="$route.params.address"
          :title="(
            topic.endsWith('company') ?
              '_profile.verifications.notary.verification.organization' :
              '_profile.verifications.notary.verification.organization-random'
            ) | translate"
          :topic="topic">
        </notary-topic-display>
      </template>
      <notary-action-request
        ref="identAction"
        v-if="details.status === 'unknown'"
        :address="address">
      </notary-action-request>
      <notary-action-pin
        ref="identAction"
        v-if="details.status === 'requested' || details.status === 'confirming'"
        :address="address"
        :requestId="requestId">
      </notary-action-pin>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './card.ts';
  export default Component;
</script>
