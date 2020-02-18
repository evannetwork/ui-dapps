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
  <div class="evan theme-evan">
    <evan-dapp-wrapper
      :routes="[ ]"
      @loggedin="initialize()"
    >
      <template v-slot:content>
        <div class="h-100 d-flex flex-column">
          <evan-loading v-if="loading" />
          <template v-else>
            <evan-dapp-wrapper-level-2
              v-if="$store.state.profileDApp.isMyProfile"
            >
              <evan-nav-list :entries="navEntries">
                <template slot="header">
                  <evan-profile-preview
                    class="p-4"
                    size="sm"
                    :account-details="$store.state.profileDApp.data.accountDetails"
                    :address="$store.state.runtime.activeAccount"
                  />
                </template>
              </evan-nav-list>
            </evan-dapp-wrapper-level-2>
            <div
              class="h-100 overflow-auto"
              style="flex: 1"
            >
              <div
                v-if="!$store.state.profileDApp.isMyProfile && $route.name !== 'detail'"
                class="h-100 text-center mt-10"
              >
                <h3>{{ '_profile.not-permitted-view' | translate }}</h3>
              </div>
              <transition
                v-else
                name="fade"
                mode="out-in"
              >
                <router-view />
              </transition>
            </div>
          </template>
        </div>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
import Component from './root';

export default Component;
</script>
