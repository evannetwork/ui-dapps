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
        <evan-loading v-if="loading" />
        <template v-else-if="hasError">
          <div class="p-5 text-center">
            <h3 class="mb-5">
              {{ '_twin-detail.generic-error' | translate }}
            </h3>
            <evan-failed />
          </div>
        </template>
        <template v-else>
          <digital-twin-interactions ref="twinInteractions" />
          <evan-dapp-wrapper-level-2 ref="level2Wrapper">
            <div class="sidenav">
              <div class="sidenav-header">
                <div class="icon-row">
                  <evan-button
                    type="icon-secondary"
                    icon="mdi mdi-close"
                    @click="close"
                  />
                  <div class="flex-grow-1" />
                  <!-- Favorite Handling -->
                  <evan-loading
                    v-if="$store.state.twin.dispatcherStates.favorite"
                    classes="icon-replacer"
                  />
                  <evan-button
                    v-else-if="!$store.state.twin.favorite"
                    type="icon-secondary"
                    icon="mdi mdi-star-outline"
                    @click="$store.state.twin.addAsFavorite()"
                  />
                  <evan-button
                    v-else
                    type="icon-secondary"
                    icon="mdi mdi-star"
                    @click="$store.state.twin.removeFromFavorites()"
                  />

                  <b-dropdown
                    variant="link"
                    toggle-class="text-decoration-none"
                    no-caret
                  >
                    <template v-slot:button-content>
                      <evan-button
                        :type="'icon-secondary'"
                        icon="mdi mdi-dots-vertical"
                      />
                    </template>
                    <b-dropdown-item
                      @click="$refs.twinInteractions.duplicateTwin()"
                    >
                      {{ '_twin-detail.data.context-menu.duplicate-twin' | translate }}
                    </b-dropdown-item>
                    <b-dropdown-item
                      @click="$refs.twinInteractions.exportTemplate()"
                    >
                      {{ '_twin-detail.data.context-menu.export-template' | translate }}
                    </b-dropdown-item>
                    <b-dropdown-item
                      v-if="$store.state.twin.isOwner"
                      @click="$refs.deleteModal.show()"
                    >
                      {{ '_twin-detail.data.context-menu.delete-twin' | translate }}
                    </b-dropdown-item>
                  </b-dropdown>
                </div>

                <evan-modal ref="deleteModal">
                  <template v-slot:header>
                    <h5 class="modal-title">
                      {{ '_twin-detail.delete.delete-modal-title' | translate }}
                    </h5>
                  </template>
                  <template v-slot:body>
                    <p>{{ '_twin-detail.delete.confirm-delete-description' | translate }}</p>
                  </template>
                  <template v-slot:footer>
                    <evan-button
                      type="danger"
                      @click="deleteTwin"
                    >
                      {{ '_twin-detail.delete.confirm-delete' | translate }}
                    </evan-button>
                  </template>
                </evan-modal>

                <evan-profile-picture
                  class="mt-3 twin-avatar"
                  type="device"
                  :is-editable="$store.state.twin.isOwner"
                  :src="$store.state.twin.description.imgSquare"
                />
                <h4 class="twin-name text-center mt-2">
                  {{ $store.state.twin.description.name }}
                </h4>
                <h5 class="twin-owner text-center">
                  {{ $store.state.twin.ownerName }}
                </h5>
                <small
                  class="twin-desc mt-3"
                >{{ getShortDescription($store.state.twin.description.description) }}</small>
              </div>

              <evan-nav-list
                :entries="navItems"
                :show-logout="false"
                :show-profile="false"
              />
            </div>
          </evan-dapp-wrapper-level-2>
          <transition
            name="fade"
            mode="out-in"
          >
            <router-view />
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
  @import './DigitalTwinDetail.scss';
</style>
