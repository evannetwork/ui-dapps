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
  <div style="display: contents;">
    <evan-loading v-if="loading"></evan-loading>
    <template v-else-if="details.status === 'finished'">
      <notary-topic-display
        v-for="(topic, index) in details.verifications"
        :address="address"
        :title="(
          topic.endsWith('company') ?
            '_profile.verifications.notary.verification.organization' :
            '_profile.verifications.notary.verification.organization-random'
          ) | translate"
        :topic="topic">
      </notary-topic-display>
    </template>
    <template v-else>
      <div class="position-absolute">
        <notary-info-dialog ref="orgInfo" :address="address"></notary-info-dialog>
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
      </div>
      <evan-card class="mt-3" type="outline">
        <svg width="60" height="56" viewBox="0 0 60 56" fill="none">
          <path d="M59.3333 28L52.8267 20.5867L53.7333 10.7733L44.1067 8.58666L39.0667 0.106659L30 3.99999L20.9333 0.106659L15.8933 8.58666L6.26666 10.7467L7.17332 20.56L0.666656 28L7.17332 35.4133L6.26666 45.2533L15.8933 47.44L20.9333 55.92L30 52L39.0667 55.8933L44.1067 47.4133L53.7333 45.2267L52.8267 35.4133L59.3333 28ZM32.6667 41.3333H27.3333V36H32.6667V41.3333ZM32.6667 30.6667H27.3333V14.6667H32.6667V30.6667Z" fill="black"/>
        </svg>

        <template v-if="error">
          <h5 class="font-weight-semibold">
            {{ '_profile.verifications.notary.request-error' | translate }}
          </h5>

          <small class="text-muted mt-3">
            {{ '_profile.verifications.notary.request-error-desc' | translate }}
          </small>
        </template>
        <template v-else>
          <h5 class="font-weight-semibold">
            {{ '_profile.verifications.notary.title' | translate }}
          </h5>

          <button class="btn btn-primary" target="_blank"
            v-if="statusActions.indexOf(details.status) !== -1"
            :disabled="details.status === 'issued' && accepting"
            @click="runStatusAction()">
            {{ `_profile.verifications.notary.status-actions.${ details.status }` | translate }}
            <div class="spinner-border spinner-border-sm text-light ml-3" v-if="details.status === 'issued' && accepting"></div>
          </button>
          <evan-button type="link" size="sm"
            class="d-block mt-1 text-muted"
            @click="$refs.orgInfo.show();">
            {{ '_profile.verifications.notary.learn-more' | translate }}
          </evan-button>
        </template>
      </evan-card>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './card.ts';
  export default Component;
</script>
