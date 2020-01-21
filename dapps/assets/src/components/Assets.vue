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
            <div class="sidenav-header">
              <i
                class="mr-3 sidenav-header-icon"
                :class="activeIcon"
              />
            </div>
            <!-- Not using nav-list because it doesnt support router-link properly
            TODO: Refactor evan-nav-list to use router-links too -->
            <div class="evan-nav-list">
              <div class="nav-entries">
                <template v-for="navItem in navItems">
                  <router-link
                    :id="navItem.id"
                    :key="navItem.id"
                    :to="navItem.to"
                    :active-class="'active'"
                  >
                    <i
                      class="mr-3"
                      :class="navItem.icon"
                    />
                    {{ navItem.label | translate }}
                  </router-link>
                </template>
              </div>
            </div>
          </div>
        </evan-dapp-wrapper-level-2>
        <transition
          name="fade"
          mode="out-in"
        >
          <div class="container content">
            <router-view />
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
@import '~@evan.network/ui/src/style/utils';

.sidenav-header {
  text-align: center;
  .sidenav-header-icon {
    font-size: 5rem;
    color: cssVar('gray-900');
  }
}
</style>
