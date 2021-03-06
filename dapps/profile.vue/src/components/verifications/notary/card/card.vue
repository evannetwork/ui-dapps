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
    <evan-loading v-if="loading" />
    <template v-else-if="details.status === 'finished'">
      <notary-topic-display
        v-for="(topic, index) in details.verifications"
        :address="address"
        :title="(
          topic.endsWith('company') ?
            '_profile.verifications.notary.verification.organization' :
            '_profile.verifications.notary.verification.organization-random'
        ) | translate"
        :topic="topic"
      />
    </template>
    <template v-else>
      <div class="position-absolute">
        <notary-info-dialog
          ref="orgInfo"
          :address="address"
        />
        <notary-action-request
          v-if="details.status === 'unknown'"
          ref="identAction"
          :address="address"
        />
        <notary-action-pin
          v-if="details.status === 'requested' || details.status === 'confirming'"
          ref="identAction"
          :address="address"
          :request-id="requestId"
        />
      </div>
      <evan-card
        class="mt-3"
        type="outline"
        icon="mdi mdi-alert-circle-outline"
        highlight="true"
        :title="(error ? '_profile.verifications.notary.request-error' : '_profile.verifications.notary.title') | translate"
        :description="error ? ('_profile.verifications.notary.request-error-desc' | translate) : ''"
      >
        <template
          v-if="!error"
          v-slot:actions
        >
          <button
            v-if="statusActions.indexOf(details.status) !== -1"
            class="btn btn-primary"
            target="_blank"
            :disabled="details.status === 'issued' && accepting"
            @click="runStatusAction()"
          >
            {{ `_profile.verifications.notary.status-actions.${ details.status }` | translate }}
            <div
              v-if="details.status === 'issued' && accepting"
              class="spinner-border spinner-border-sm text-light ml-3"
            />
          </button>
          <evan-button
            type="link"
            size="sm"
            class="d-block mt-1 text-muted"
            @click="$refs.orgInfo.show();"
          >
            {{ '_profile.verifications.notary.learn-more' | translate }}
          </evan-button>
        </template>
      </evan-card>
    </template>
  </div>
</template>

<script lang="ts">
import Component from './card';

export default Component;
</script>
