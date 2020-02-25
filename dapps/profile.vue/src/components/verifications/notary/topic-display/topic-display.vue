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
  <div>
    <evan-card
      class="mt-3"
      type="filled"
      highlight="true"
      @click="showDetail()"
    >
      <evan-loading v-if="loading" />
      <template v-else>
        <img
          :src="`${ $store.state.uiLibBaseUrl }/assets/verification.svg`"
          width="80"
        >
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
          {{ issuerName }}
        </small>

        <button
          v-if="verification.status === 'yellow'"
          type="button"
          class="btn btn-primary mt-3"
          :disabled="accepting"
          @click="acceptVerification()"
        >
          {{ `_profile.verifications.notary.verification.accept` | translate }}
        </button>
      </template>
    </evan-card>
    <evan-swipe-panel
      v-if="!loading"
      ref="verificationDetail"
      class="light"
      alignment="right"
      show-backdrop="true"
      type="default"
      :is-open="$store.state.uiState.swipePanel === topic"
      @hide="$store.state.uiState.swipePanel = ''"
    >
      <div class="h-100 d-flex flex-column">
        <div>
          <div class="text-center">
            <img
              width="80"
              :src="`${ $store.state.uiLibBaseUrl }/assets/verification.svg`"
            >
            <h3 class="font-weight-semibold mt-3">
              {{ title }}
            </h3>
            <p :class="{ 'text-primary': !isExpired, 'text-warning': isExpired }">
              {{ expiredTranslationString }}
              {{ expirationDate ? (expirationDate | moment('LLL')) : '' }}
            </p>
          </div>
          <small class="d-block text-justify text-muted">
            {{ $t('_profile.verifications.notary.verification.topic-desc', { companyName: companyName }) }}
          </small>
          <div class="mt-5 d-table">
            <div class="d-table-row">
              <b class="d-table-cell pr-1">{{ '_profile.verifications.notary.verification.created' | translate }}:</b>
              <span class="d-table-cell">{{ verification.verifications[0].details.creationDate | moment('LLL') }}</span>
            </div>
            <div class="d-table-row pt-2 text-break">
              <b class="d-table-cell pr-1 pt-2">{{ '_profile.verifications.notary.verification.verified-by' | translate }}:</b>
              <div class="d-table-cell pt-2">
                <span class="d-block">{{ issuerName }}</span>
                <small class="d-block text-muted">{{ issuer }}</small>
                <small class="d-block text-muted">
                  <strong>{{ '_profile.verifications.notary.verification.topic' | translate }}:</strong> {{ topic }}</small>
              </div>
            </div>
          </div>

          <div class="mt-5">
            <h5 class="font-weight-semibold text-uppercase">
              {{ '_profile.verifications.notary.verification.attachments' | translate }}
            </h5>

            <a
              v-for="(file, index) in files"
              :id="`file-input-download-${ index }`"
              :key="index"
              class="d-flex align-items-center p-2 pl-3 border border-sm bg-level-3 dark-link"
              :href="file.blobUri"
              :download="file.name"
            >
              <small class="force-oneline font-weight-semibold pr-2">{{ file.name }}</small>
              <i
                class="mdi mdi-file-document-box-outline text-dark"
                style="font-size: 24px"
              />
            </a>
          </div>

          <button
            v-if="verification.status === 'yellow'"
            type="button"
            class="btn btn-primary mt-5"
            :disabled="accepting"
            @click="acceptVerification()"
          >
            {{ `_profile.verifications.notary.verification.accept` | translate }}
          </button>
        </div>

        <span class="my-auto" />

        <button
          type="button"
          class="btn btn-primary mt-5 w-100"
          @click="$store.commit('toggleSidePanel', topic)"
        >
          {{ `_profile.verifications.notary.verification.close-detail` | translate }}
        </button>
      </div>
    </evan-swipe-panel>
  </div>
</template>

<script lang="ts">
import Component from './topic-display';

export default Component;
</script>
