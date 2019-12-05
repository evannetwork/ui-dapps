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
  <div class="profile-sharings">
    <evan-loading v-if="loading" />
    <template v-else>
      <div class="container">

        <evan-button
          size="lg"
          type="icon-primary"
          icon="mdi mdi-plus"
          @click="$refs.shareSidebar.show();"
        />

        <evan-swipe-panel
          class="light"
          alignment="right"
          ref="shareSidebar"
          :title="'_profile.sharing.permissionsTitle' | translate"
          :showBackdrop="windowWidth < 1200"
          :hideCloseButton="windowWidth >= 1200"
          :mountId="windowWidth < 1200 ? null : 'dapp-wrapper-sidebar-right'"
          :isOpen="$store.state.uiState.swipePanel === 'sharing'"
          @hide="selectedSharedContacts = null"
        >
          <evan-permissions-editor
            @init="permissionsEditor = $event"
            :contacts="contacts"
            :selectedContact="selectedSharedContacts"
            :loadPermissions="loadPermissions"
            :updatePermissions="updatePermissions"
            :onSelect="handleOnSelect"
            :sortFilters="$store.state.profileDApp.sharingFilter"
            i18nScope="_profile.sharing"
          />
          <template slot="footer" v-if="!!permissionsEditor">
            <evan-button 
              type="secondary" 
              :label="$t('_evan.cancel')" 
              @click="permissionsEditor.cancel()" 
              :disabled="!selectedSharedContacts" />
            <evan-button
              type="primary"
              :label="$t('_evan.sharing.update')"
              :disabled="!permissionsEditor.permissionsChanged"
              @click="permissionsEditor.writePermissions()"
            />
          </template>
        </evan-swipe-panel>

        <div class="content">
          <h3 class="font-weight-bold">{{ '_profile.sharings.title' | translate }}</h3>
          <p>{{ '_profile.sharings.desc' | translate }}</p>

          <template v-if="sharedContacts && sharedContacts.length > 0">
            <evan-base-list
              class="mt-5"
              :data="sharedContacts"
              :isSelectedCallback="isSelectedCallback"
              :itemClickedCallback ="(item, event) => handleSharedContactClick(item, event)"
            >
              <template v-slot:item="{item}">
                <evan-shared-contact
                  :item="item"
                  :removeCallback="() => handleRemoveSharedContact(item)"
                  :isLoading="!!isLoadingContacts && isLoadingContacts.has(item.accountId)"
                />
              </template>
            </evan-base-list>
          </template>

          <template v-else>
            <div class="hint-no-sharings text-muted text-center">
              {{ '_profile.sharings.no-data' | translate }}
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
  @import "./sharings.scss";
</style>

<script lang="ts">
  import Component from "./sharings";
  export default Component;
</script>
