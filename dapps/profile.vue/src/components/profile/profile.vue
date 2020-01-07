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
    <evan-loading v-if="loading"></evan-loading>
    <template v-else>
      <div class="row profile-row">
        <div class="col left-col mb-3">
          <profile-permission-wrapper entryName="accountDetails">
            <div class="d-flex align-items-center">
              <evan-profile-preview
                class="w-100"
                ref="profilePreview"
                size="lg"
                :accountDetails="userInfo"
                :address="address"
                :editable="true"
                @update="userInfo = $event"
                @save="saveUserInfo"
              />
              <div class="mx-auto"></div>
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
            :accountDetails="userInfo"
            :address="$route.params.address"
            :href="$route.params.address == runtimeAddress ? undefined : null"
          />
        </div>
      </div>

      <div class="row profile-row" v-if="userInfo">
        <div class="col left-col mt-3">
          <div class="text-center" v-if="userInfo.profileType === 'user'">
            <template v-if="this.isLoading()">
              <evan-loading></evan-loading>
              <h5>{{ '_profile.dispatchers.profile-update' | translate }}</h5>
            </template>
            <template v-else-if="$store.state.profileDApp.isMyProfile">
              <h5>{{ '_profile.type.missing-type' | translate }}</h5>

              <div class="d-flex justify-content-center my-5">
                <evan-card class="clickable fixed-size"
                  v-for="(type, index) in profileTypes"
                  :key="index"
                  :class="{
                    'ml-3': index !== 0,
                    'evan-highlight active': newType === type,
                  }"
                  @click="newType = type">
                  <evan-profile-picture
                    class="mb-3"
                    :src="`${ $store.state.profileBaseUrl }/assets/${ type }.svg`"
                    :type="type"
                    size="lg"
                  />
                  <h5 class="mb-3">{{ `_evan.profile.types.${ type }` | translate }}</h5>
                  <small class="text-muted">{{ `_evan.profile.types.${ type }-desc` | translate }}</small>
                </evan-card>
              </div>

              <div class="text-center mt-3">
                <evan-button type="primary"
                  :disabled="!newType"
                  :label="'_profile.type.choose' | translate"
                  @click="changeType()">
                </evan-button>
              </div>
            </template>
            <template v-else>
              <h5>{{ '_profile.type.missing-type-foreign' | translate }}</h5>
            </template>
          </div>
          <template v-if="userInfo.profileType === 'company'">
            <profile-permission-wrapper entryName="contact">
              <profile-company-contact :address="address"></profile-company-contact>
            </profile-permission-wrapper>
            <profile-permission-wrapper
              class="mt-5"
              entryName="registration"
              v-if="$store.state.profileDApp.data.contact.country === 'DE'">
              <profile-company-registration :address="address"></profile-company-registration>
            </profile-permission-wrapper>
          </template>
          <profile-permission-wrapper entryName="deviceDetails"
            v-else-if="userInfo.profileType === 'device'">
            <profile-device-detail :address="address"></profile-device-detail>
          </profile-permission-wrapper>
        </div>
        <div class="col right-col">
          <template v-if="verificationCount === 0">
            <evan-card class="mt-3"
              icon="mdi mdi-plus"
              highlight="true"
              v-if="$store.state.profileDApp.isMyProfile"
              :href="`${ dapp.fullUrl }/${ address }/verifications`"
              :title="'_profile.verifications.add' | translate"
            />
            <div class="mt-5 text-center" v-else>
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
        :isOpen="$store.state.uiState.swipePanel === 'sharing'"
        :title="'_profile.sharing.permissionsTitle' | translate"
        @hide="$store.state.uiState.swipePanel = ''"
        alignment="right"
        class="light"
        ref="shareSidebar"
        showBackdrop="true"
        type="default"
        v-if="userInfo">
        <evan-permissions-editor
          @init="permissionsEditor = $event"
          :contacts="contacts"
          :selectedContact="selectedSharedContacts"
          :onSelect="handleOnSelect"
          :loadPermissions="loadPermissions"
          :updatePermissions="updatePermissions"
          :sortFilters="$store.state.profileDApp.sharingFilter"
          i18nScope="_profile.sharing"
        />
        <template slot="footer" v-if="!!permissionsEditor">
          <div class="d-flex">
            <evan-button
              type="secondary"
              :label="$t('_evan.cancel')"
              @click="permissionsEditor.cancel()"
              :disabled="!selectedSharedContacts"
              class="mr-3"
            />
            <evan-button
              type="primary"
              :label="$t('_evan.sharing.update')"
              :disabled="!permissionsEditor.permissionsChanged ||
                $store.state.dispatcher.curr.running.shareProfileDispatcher"
              @click="permissionsEditor.writePermissions()"
              class="btn-block"
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
