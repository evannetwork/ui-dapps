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
    <evan-card class="mt-3" type="filled" highlight="true"
      @click="showDetail()">
      <evan-loading v-if="loading"></evan-loading>
      <template v-else>
        <img :src="`${ $store.state.uiLibBaseUrl }/assets/verification.svg`" />
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

        <button type="button"
          class="btn btn-primary mt-3"
          v-if="verification.status === 'yellow'"
          :disabled="accepting"
          @click="acceptVerification()">
          {{ `_profile.verifications.notary.verification.accept` | translate }}
        </button>
      </template>
    </evan-card>
    <evan-swipe-panel class="light"
      v-if="!loading"
      alignment="right"
      ref="verificationDetail"
      showBackdrop="true"
      type="default"
      :isOpen="$store.state.uiState.swipePanel === topic"
      @hide="$store.state.uiState.swipePanel = ''">
      <div class="h-100 d-flex flex-column">
        <div>
          <div class="text-center">
            <img
              style="width: 100px;"
              :src="`${ $store.state.uiLibBaseUrl }/assets/verification.svg`"
            />
            <h3 class="font-weight-semibold mt-3">
              {{ title }}
            </h3>
          </div>
          <small class="d-block text-justify text-muted">
            {{ $t('_profile.verifications.notary.verification.topic-desc', { companyName: companyName }) }}
          </small>
          <div class="mt-5">
            <div class="mt-2">
              <b>{{ '_profile.verifications.notary.verification.created' | translate }}:</b>
              <span>{{ verification.verifications[0].details.creationDate | moment('LLL') }}</span>
            </div>
            <div class="mt-2">
              <b>{{ '_profile.verifications.notary.verification.verified-by' | translate }}:</b>
              <span>{{ issuerName }}</span>
            </div>
          </div>

          <div class="mt-5">
            <h5 class="font-weight-semibold text-uppercase">
              {{ '_profile.verifications.notary.verification.attachments' | translate }}
            </h5>

            <a class="d-flex align-items-center p-3 border border-sm bg-level-3 dark-link"
              v-for="(file, index) in files"
              :id="`file-input-download-${ index }`"
              :href="file.blobUri"
              :download="file.name">
              <span class="force-oneline">{{ file.name }}</span>
              <i class="mdi mdi-file-document-box-outline"></i>
            </a>
          </div>

          <div class="mt-5">
            <div class="mt-5" v-if="showTechnicalDetail">
              <div class="mt-2">
                <b>{{ '_profile.verifications.notary.verification.topic' | translate }}:</b>
                <span>{{ topic }} </span>
              </div>
              <div class="mt-2">
                <b>{{ '_profile.verifications.notary.verification.issuer' | translate }}:</b>
                <span>{{ issuer }} </span>
              </div>
            </div>

            <div class="text-center mt-5">
              <evan-button
                class="mb-3"
                :type="'text-secondary'"
                :label="$t(`_profile.verifications.notary.verification.${ showTechnicalDetail ? 'hide-technical' : 'show-technical' }`)"
                :icon="`mdi ${ showTechnicalDetail ? 'mdi-arrow-up' : 'mdi-arrow-down' }`"
                @click="showTechnicalDetail = !showTechnicalDetail"
              />
            </div>
          </div>

          <button type="button"
            class="btn btn-primary mt-5"
            v-if="verification.status === 'yellow'"
            :disabled="accepting"
            @click="acceptVerification()">
            {{ `_profile.verifications.notary.verification.accept` | translate }}
          </button>
        </div>

        <span class="my-auto"></span>

        <button type="button"
          class="btn btn-primary mt-5 w-100"
          @click="$store.commit('toggleSidePanel', topic)">
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
