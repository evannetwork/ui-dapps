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
    <evan-dapp-wrapper @loggedin="initialize()">
      <template v-slot:content>
        <evan-loading v-if="loading" />
        <template v-else>
          <evan-dapp-wrapper-level-2 ref="level2Wrapper">
            <div class="sidenav">
              <div class="sidenav-header">
                <div class="icon-row">
                  <evan-button @click="close" type="icon-secondary" icon="mdi mdi-close" />
                  <div class="flex-grow-1"></div>
                  <evan-button :type="'icon-secondary'" icon="mdi mdi-star-outline" />
                  <b-dropdown variant="link" toggle-class="text-decoration-none" no-caret>
                    <template v-slot:button-content>
                      <evan-button
                        :type="'icon-secondary'"
                        icon="mdi mdi-dots-vertical"
                      />
                    </template>
                    <b-dropdown-item href="#">TODO Clone</b-dropdown-item>
                    <b-dropdown-item href="#">TODO Export</b-dropdown-item>
                    <b-dropdown-item href="#">TODO Remove</b-dropdown-item>
                  </b-dropdown>
                </div>

                  <evan-profile-picture
                    class="twin-avatar"
                    type="device"
                    :src="'https://via.placeholder.com/96'"
                  />
                  <h4 class="twin-name text-center mt-2">TODO NAME</h4>
                  <h5 class="twin-owner text-center">TODO OWNER</h5>
                  <small
                    class="twin-desc text-center mt-3"
                  >TODO This is a brief description of the specific Digital Twin. It may also include application tips and recommendations for action..</small>
                </div>

                <!-- Not using nav-list because it doesnt support router-link properly
                TODO: Refactor evan-nav-list to use router-links too-->
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
                </div>
              </div>
            </evan-dapp-wrapper-level-2>
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </template>
        </template>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
import DigitalTwinDetailComponent from './DigitalTwinDetail';
export default DigitalTwinDetailComponent;
</script>

<style lang="scss" scoped>
@import '~@evan.network/ui/src/style/utils';

.sidenav {
  width: 240px;

  .evan-nav-list {
    height: auto;
  }

  .sidenav-header {
    padding: 24px;

    .icon-row {
      display: flex;
      margin: -16px; // counter too big padding for icons

      /deep/ .dropdown.b-dropdown {
        & > button.btn {
          padding: 0;
        }
      }
    }
    .twin-name {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .twin-owner {
      font-size: 10px;
      color: cssVar('gray-600');
    }
    .twin-desc {
      font-size: 10px;
      color: cssVar('gray-900');
    }
  }
}

/deep/ .twin-avatar .profile-picture {
  --size: 96px;
  margin-left: auto;
  margin-right: auto;
}
</style>