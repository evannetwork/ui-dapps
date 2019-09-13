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
  <div class="profile-detail p-md-11 p-1">
    <evan-loading v-if="loading"></evan-loading>
    <template v-else>
      <div class="row">
        <div class="col-xl-8 col-lg-6 mb-3">
          <evan-profile-preview
            size="lg"
            :address="address"
          />
        </div>
        <div class="col-xl-4 col-lg-6">
          <a class="
            d-block p-3 position-relative
            bg-inverted rounded text-decoration-none"
            style="height: 166px"
            :href="$store.state.isMyProfile ? `${ dapp.fullUrl }/wallet` : null"
            :class="{
              'evan-highlight': $store.state.isMyProfile
            }">
            <h1>{{ balance.amount }} EVE</h1>
            <small class="font-weight-semibold">{{ '_profile.current-balance' | translate }}</small>
            <small class="position-absolute bottom-right p-2" style="opacity: 0.6">
              {{ balance.timestamp | moment('MMMM Do YYYY, h:mm:ss a') }}
            </small>
          </a>
        </div>
      </div>

      <div class="row">
        <div class="col-xl-8 col-lg-6">
          
        </div>
        <div class="col-xl-4 col-lg-6">
          <template v-if="verificationCount() === 0">
            <evan-card class="mt-3"
              v-if="$store.state.isMyProfile"
              :href="`${ dapp.fullUrl }/verifications/${ address }`">
              <svg viewBox="0 0 38 38" fill="none">
                <path d="M37.6666 21.6667H21.6666V37.6667H16.3333V21.6667H0.333252V16.3333H16.3333V0.333328H21.6666V16.3333H37.6666V21.6667Z" fill="black"/>
              </svg>
              <h5 class="font-weight-semibold">
                {{ '_profile.verifications.add' | translate }}
              </h5>
            </evan-card>
            <div class="mt-t text-center">
              <h5 class="font-weight-semibold">
                {{ '_profile.verifications.empty' | translate }}
              </h5>
            </div>
          </template>

          <div
            :class="{
              'd-none': verificationCount() === 0
            }">
            <notary-verification
              ref="notaryVerifications"
              :address="address">
            </notary-verification>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './profile.ts';
  export default Component;
</script>

<style lang="scss">
  @import './profile.scss';
</style>