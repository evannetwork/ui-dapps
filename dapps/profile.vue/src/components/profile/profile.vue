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
  <div class="profile-detail p-xxl-11 p-xl-6 p-3">
    <evan-loading v-if="loading"></evan-loading>
    <template v-else>
      <div class="row">
        <div class="col-xl-8 mb-3">
          <evan-profile-preview
            ref="profilePreview"
            size="lg"
            :editable="userInfo && userInfo.profileType !== 'unspecified'"
            :address="address"
            @typeClick="typeSwitchModal()"
            @update="userInfo = $event"
            @save="saveUserInfo"
          />
          <profile-type-switch
            ref="profileType"
            :type="userInfo.profileType"
            v-if="$store.state.isMyProfile && userInfo"
          />
        </div>
        <div class="col-xl-4">
          <a class="
            d-block p-3 position-relative
            bg-inverted rounded text-decoration-none"
            style="height: 166px"
            :href="$store.state.isMyProfile ? `${ dapp.fullUrl }/wallet/${ $store.state.runtime.activeAccount }` : null"
            :class="{
              'evan-highlight': $store.state.isMyProfile
            }">
            <h1>{{ balance.amount }} EVE</h1>
            <small class="font-weight-semibold">{{ '_profile.current-balance' | translate }}</small>
            <small class="position-absolute bottom-right p-2" style="opacity: 0.6">
              {{ balance.timestamp | moment('LLL') }}
            </small>
          </a>
        </div>
      </div>

      <div class="row" v-if="userInfo">
        <div class="col-xl-8 mt-3">
          <div class="text-center" v-if="userInfo.profileType === 'unspecified'">
            <template v-if="this.isLoading()">
              <evan-loading></evan-loading>
              <h5>{{ '_profile.dispatchers.profile-update' | translate }}</h5>
            </template>
            <template v-else>
              <h5>{{ '_profile.type.missing-type' | translate }}</h5>
              <evan-button
                class="mt-3"
                type="primary"
                :label="'_profile.type.choose' | translate"
                @click="typeSwitchModal()">
              </evan-button>
            </template>
          </div>
          <template v-if="userInfo.profileType === 'company'">
            <profile-company-registration :address="address"></profile-company-registration>
            <profile-company-contact :address="address"></profile-company-contact>
          </template>
          <template v-else-if="userInfo.profileType === 'device'">
            <profile-device-detail :address="address"></profile-device-detail>
          </template>
        </div>
        <div class="col-xl-4">
          <template v-if="verificationCount === 0">
            <evan-card class="mt-3"
              icon="mdi mdi-plus"
              highlight="true"
              v-if="$store.state.isMyProfile"
              :href="`${ dapp.fullUrl }/verifications/${ address }`"
              :title="'_profile.verifications.add' | translate"
            />
            <div class="mt-5 text-center" v-else>
              <h5 class="font-weight-semibold">
                {{ '_profile.verifications.empty' | translate }}
              </h5>
            </div>
          </template>

          <div
            :class="{
              'd-none': verificationCount === 0
            }">
            <notary-verification
              ref="notaryVerifications"
              :address="address"
              @loaded="setVerificationCount()"
            />
          </div>
        </div>
      </div>
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