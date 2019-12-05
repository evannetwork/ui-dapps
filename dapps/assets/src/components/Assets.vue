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
    <evan-dapp-wrapper>
      <template v-slot:content>
        <evan-dapp-wrapper-level-2 ref="level2Wrapper">
          <div class="sidenav">
            <!-- Not using nav-list because it doesnt support router-link properly -->
            <div class="evan-nav-list">
              <div class="nav-entries">
                <template v-for="navItem in navItems">
                  <router-link
                    :id="navItem.id"
                    :key="navItem.id"
                    :to="navItem.to"
                    :active-class="'active'"
                  >
                    <i class="mr-3" :class="navItem.icon"></i>
                    {{ navItem.label | translate }}
                  </router-link>
                </template>
              </div>
              <div class="spacer"></div>
              <div class="nav-entries">
                <div class="bg-white border-top d-flex">
                  <i class="mdi mdi-magnify text-muted px-3"></i>
                  <input
                    placeholder="0x123ABC..."
                    class="border-0 p-3 w-100 form-control"
                    style="height: 60px;"
                    v-model="searchQuery"
                    @keyup.enter="onSearchEnter"
                  />
                </div>
              </div>
            </div>
          </div>
        </evan-dapp-wrapper-level-2>
        <transition name="fade" mode="out-in">
          <div class="container py-3">
            <router-view></router-view>
          </div>
        </transition>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
import AssetsComponent from './Assets';
export default AssetsComponent;
</script>

<style lang="scss" scoped>
.sidenav {
  width: 300px;
}

.spacer {
  display: flex;
  flex: 1;
}

.evan-nav-list > .nav-entries {
  flex: 0;
}
</style>
