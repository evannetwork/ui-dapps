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
  <div class="profile-detail p-xxl-11 p-xl-6 p-3">
    <evan-loading v-if="loading" />
    <template v-else>
      <div class="row profile-row">
        <div class="col left-col mb-3">
          <profile-permission-wrapper entry-name="accountDetails">
            <div class="d-flex align-items-center">
              <evan-profile-preview
                ref="profilePreview"
                class="w-100"
                size="lg"
                :account-details="userInfo"
                :address="address"
                :editable="true"
                @update="userInfo = $event"
                @save="saveUserInfo"
              />
              <div class="mx-auto" />
              <evan-button
                v-if="$store.state.runtime && $route.params.address === $store.state.runtime.activeAccount"
                type="secondary"
                size="sm"
                @click="() => $store.commit('toggleSidePanel', 'sharing')"
              >
                {{ '_evan.share' | translate }}
              </evan-button>
            </div>
          </profile-permission-wrapper>
        </div>
        <div class="col right-col d-flex justify-content-end">
          <evan-wallet-card
            :account-details="userInfo"
            :address="$route.params.address"
            :href="$store.state.profileDApp.isMyProfile ? undefined : null"
          />
        </div>
      </div>

      <div
        v-if="userInfo"
        class="row profile-row"
      >
        <div class="col left-col mt-3">
          <div
            v-if="userInfo.profileType === 'user'"
            class="text-center"
          >
            <template v-if="this.isLoading()">
              <evan-loading />
              <h5>{{ '_profile.dispatchers.profile-update' | translate }}</h5>
            </template>
            <template v-else-if="$store.state.profileDApp.isMyProfile">
              <h5>{{ '_profile.type.missing-type' | translate }}</h5>

              <div class="d-flex justify-content-center my-5">
                <evan-card
                  v-for="(type, index) in profileTypes"
                  :key="index"
                  class="clickable fixed-size"
                  :class="{
                    'ml-3': index !== 0,
                    'evan-highlight active': newType === type,
                  }"
                  @click="newType = type"
                >
                  <evan-profile-picture
                    class="mb-3"
                    :src="`${ $store.state.profileBaseUrl }/assets/${ type }.svg`"
                    :type="type"
                    size="lg"
                  />
                  <h5 class="mb-3">
                    {{ `_evan.profile.types.${ type }` | translate }}
                  </h5>
                  <small class="text-muted">{{ `_evan.profile.types.${ type }-desc` | translate }}</small>
                </evan-card>
              </div>

              <div class="text-center mt-3">
                <evan-button
                  type="primary"
                  :disabled="!newType"
                  :label="'_profile.type.choose' | translate"
                  @click="changeType()"
                />
              </div>
            </template>
            <template v-else>
              <h5>{{ '_profile.type.missing-type-foreign' | translate }}</h5>
            </template>
          </div>
          <template v-if="userInfo.profileType === 'company'">
            <profile-permission-wrapper entry-name="contact">
              <profile-company-contact :address="address" />
            </profile-permission-wrapper>
            <profile-permission-wrapper
              v-if="$store.state.profileDApp.data.contact.country === 'DE'"
              class="mt-5"
              entry-name="registration"
            >
              <profile-company-registration :address="address" />
            </profile-permission-wrapper>
          </template>
          <profile-permission-wrapper
            v-else-if="userInfo.profileType === 'device'"
            entry-name="deviceDetails"
          >
            <profile-device-detail :address="address" />
          </profile-permission-wrapper>
        </div>
        <div class="col right-col">
          <template v-if="verificationCount === 0">
            <evan-card
              v-if="$store.state.profileDApp.isMyProfile"
              class="mt-3"
              icon="mdi mdi-plus"
              highlight="true"
              :href="`${ dapp.fullUrl }/${ address }/verifications`"
              :title="'_profile.verifications.add' | translate"
            />
            <div
              v-else
              class="mt-5 text-center"
            >
              <h5 class="font-weight-semibold">
                {{ '_profile.verifications.empty' | translate }}
              </h5>
            </div>
          </template>

          <div :class="{ 'd-none': verificationCount === 0 }">
            <notary-verification
              ref="notaryVerifications"
              :address="address"
              @loaded="setVerificationCount()"
            />
          </div>
        </div>
      </div>
      <evan-swipe-panel
        ref="shareSidebar"
        :is-open="$store.state.uiState.swipePanel === 'sharing'"
        :title="'_profile.sharing.permissionsTitle' | translate"
        v-if="userInfo"
        alignment="right"
        class="light"
        show-backdrop="true"
        type="default"
        @hide="$store.state.uiState.swipePanel = ''"
      >
        <evan-permissions-editor
          :contacts="contacts"
          :selected-contact="selectedSharedContacts"
          :on-select="handleOnSelect"
          :load-permissions="loadPermissions"
          :update-permissions="updatePermissions"
          :sort-filters="$store.state.profileDApp.sharingFilter"
          i18n-scope="_profile.sharing"
          @init="permissionsEditor = $event"
        />
        <template
          v-if="!!permissionsEditor"
          slot="footer"
        >
          <div class="d-flex">
            <evan-button
              type="secondary"
              :label="$t('_evan.cancel')"
              :disabled="!selectedSharedContacts"
              class="mr-3"
              @click="permissionsEditor.cancel()"
            />
            <evan-button
              type="primary"
              :label="$t('_evan.sharing.update')"
              :disabled="!permissionsEditor.permissionsChanged
                || $store.state.dispatcher.curr.running.shareProfileDispatcher
                || !selectedSharedContacts"
              class="btn-block"
              @click="permissionsEditor.writePermissions()"
            />
          </div>
        </template>
      </evan-swipe-panel>
    </template>
  </div>
</template>

<script lang="ts">
import Component from './profile';

export default Component;
</script>

<style lang="scss">
  @import './profile.scss';
</style>
