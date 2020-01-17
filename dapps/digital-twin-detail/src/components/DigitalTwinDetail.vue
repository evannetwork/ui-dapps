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
                  <b-dropdown variant="link" toggle-class="text-decoration-none" no-caret
                    :disabled="exporting">
                    <template v-slot:button-content>
                      <evan-button
                        :isLoading="exporting"
                        :type="'icon-secondary'"
                        icon="mdi mdi-dots-vertical"
                      />
                    </template>
                    <b-dropdown-item
                      @click="duplicateTwin()">
                      {{ '_twin-detail.data.context-menu.duplicate-twin' | translate }}
                    </b-dropdown-item>
                    <b-dropdown-item
                      @click="exportTwinTemplate()">
                      {{ '_twin-detail.data.context-menu.export-template' | translate }}
                    </b-dropdown-item>
                  </b-dropdown>

                  <evan-swipe-panel
                    @init="exportModal = $event"
                    alignment="right"
                    class="light"
                    :title="'_twin-detail.data.context-menu.export-template' | translate"
                    showBackdrop="true"
                    type="default">
                    <div class="d-flex h-100 align-items-center justify-content-center">
                      <div v-if="exporting">
                        <evan-loading />
                        <div class="mt-3 text-center">
                          <h4>
                            {{ `_twin-detail.data.context-menu.exporting-twin` | translate }}
                          </h4>
                        </div>
                      </div>
                      <evan-success v-else />
                    </div>

                    <template slot="footer">
                      <div class="d-flex">
                        <evan-button
                          type="secondary"
                          :label="$t('_evan.cancel')"
                          @click="duplicatePanel.cancel()"
                          class="mr-3"
                        />
                        <span class="mx-auto" />
                        <evan-button
                          type="primary"
                          :disabled="exporting"
                          :label="$t('_twin-detail.data.context-menu.download-template')"
                          @click="downloadTwinTemplate()"
                        />
                      </div>
                    </template>
                  </evan-swipe-panel>

                  <evan-swipe-panel
                    @init="duplicatePanel = $event"
                    alignment="right"
                    class="light"
                    :title="'_twin-detail.data.context-menu.duplicate-twin' | translate"
                    showBackdrop="true"
                    type="default">
                    <div
                      class="d-flex h-100 align-items-center justify-content-center"
                      v-if="exporting || duplicating">
                      <evan-loading />
                      <div class="mt-3 text-center">
                        <h4 v-if="exporting">
                          {{ `_twin-detail.data.context-menu.exporting-twin` | translate }}
                        </h4>
                        <h4 v-else-if="duplicating">
                          {{ `_twin-detail.data.context-menu.duplicating-twin` | translate }}
                        </h4>
                      </div>
                    </div>
                    <evan-form-dbcp
                      class="pt-5"
                      ref="dbcpForm"
                      :contractAddress="$store.state.twin.contractAddress"
                      :description="$store.state.twin.description"
                      i18nScope="_twin-detail.data.general"
                      onlyForm="true"
                      @init="dbcpForm = $event"
                      v-else
                    />
                    <template slot="footer">
                      <div class="d-flex">
                        <evan-button
                          type="secondary"
                          :label="$t('_evan.cancel')"
                          @click="duplicatePanel.cancel()"
                          class="mr-3"
                        />
                        <span class="mx-auto" />
                        <evan-button
                          type="primary"
                          :disabled="exporting || duplicating"
                          :label="$t('_twin-detail.data.context-menu.duplicate-twin')"
                          @click="createTwinDuplicate()"
                        />
                      </div>
                    </template>
                  </evan-swipe-panel>
                </div>

                <evan-profile-picture
                  class="twin-avatar"
                  type="device"
                  :src="$store.state.twin.description.imgSquare"
                />
                <h4 class="twin-name text-center mt-2">
                  {{ $store.state.twin.description.name }}
                </h4>
                <h5 class="twin-owner text-center">
                  {{ $store.state.twin.ownerName }}
                </h5>
                <small
                  class="twin-desc text-center mt-3">
                  {{ $store.state.twin.description.description }}                  
                </small>
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