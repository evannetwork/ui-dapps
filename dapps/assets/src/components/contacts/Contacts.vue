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
  <div>
    <div
      class="d-flex flex-row justify-content-between align-items-center"
      style="max-height: 33px"
    >
      <evan-searchbox
        id="contactSearchbox"
        :debounce-time="250"
        @keyup="filterBySearchTerm($event.target.value)"
      >
        <span>{{ '_assets.contacts.contacts-title' | translate }}</span>
      </evan-searchbox>

      <div>
        <evan-button
          class="ml-3"
          type="text-filter"
          icon="mdi mdi-star-outline"
          icon-position="left"
          :class="{ active: filterBy.includes('isFavorite') }"
          :label="$t('_assets.contacts.favorites')"
          @click="filterByFavorites()"
        />
        <evan-button
          class="ml-3"
          type="text-filter"
          icon="mdi mdi-account-outline"
          icon-position="left"
          :class="{ active: filter === 'user' }"
          :label="$t('_assets.contacts.users')"
          @click="filterByType('user')"
        />
        <evan-button
          class="ml-3"
          type="text-filter"
          icon="mdi mdi-office-building"
          icon-position="left"
          :class="{ active: filter === 'company' }"
          :label="$t('_assets.contacts.companies')"
          @click="filterByType('company')"
        />
        <evan-button
          class="ml-3"
          type="text-filter"
          icon="mdi mdi-account-multiple-outline"
          icon-position="left"
          :class="{ active: filter === null }"
          :label="$t('_assets.contacts.all')"
          @click="resetFilter"
        />
      </div>
    </div>

    <div class="d-flex flex-row mt-3">
      <evan-table
        class="clickable-rows"
        primary-key="address"
        :items="contacts"
        :fields="columns"
        :filter="filter"
        :filter-included-fields="filterBy"
        :show-empty="!isLoading"
        :show-scrollbar="true"
        :sticky-header="'calc(100vh - 85px)'"
        :tbody-transition-props="{ name: 'list', mode: 'out-in' }"
        @row-clicked="handleRowClicked"
      >
        <template v-slot:cell(alias)="contacts">
          {{
            contacts.item.alias || contacts.item.address
          }}
        </template>
        <template v-slot:cell(icon)="contacts">
          <i
            class="table-icon"
            :class="contacts.item.icon"
          />
        </template>
        <template v-slot:cell(createdAt)="contacts">
          <template v-if="contacts.item.createdAt && !contacts.item.isPending">
            {{ contacts.item.createdAt | moment('L') }}
          </template>
          <template v-else-if="contacts.item.isPending">
            {{ '_assets.contacts.pending' | translate }}
          </template>
        </template>
        <template v-slot:cell(actions)="contact">
          <evan-loading
            v-if="
              isFavoriteLoading.loading &&
                isFavoriteLoading.id === contact.item.address
            "
            classes=""
          />
          <evan-button
            v-else-if="contact.item.isFavorite === 'true'"
            type="icon-secondary"
            icon="mdi mdi-star"
            :disabled="isFavoriteLoading.loading"
            @click="removeFavorite(contact)"
          />
          <evan-button
            v-else
            class="visible-on-row-hover"
            type="icon-secondary"
            icon="mdi mdi-star-outline"
            :disabled="isFavoriteLoading.loading"
            @click="addFavorite(contact)"
          />
          <evan-button
            type="icon-secondary"
            class="visible-on-row-hover ml-1"
            icon="mdi mdi-pencil-outline"
            :disabled="isFavoriteLoading.loading"
            @click="editContact(contact)"
          />
        </template>
        <template v-slot:table-caption>
          <div class="table-spacer" />
        </template>

        <!-- Empty slots -->
        <template v-slot:empty>
          <span>{{ '_assets.contacts.contacts-empty' | translate }}</span>
        </template>
        <template v-slot:emptyfiltered>
          <span>{{ '_assets.contacts.filtered-empty' | translate }}</span>
        </template>
      </evan-table>
    </div>

    <evan-loading v-if="isLoading" />

    <evan-button
      :type="'icon-primary'"
      size="lg"
      class="add-contact-btn"
      icon="mdi mdi-plus"
      @click="$refs.addContact.showPanel()"
    />

    <add-contact
      ref="addContact"
      @contact-added="handleContactAdded"
    />

    <edit-contact
      ref="editContact"
      :contact="selectedContact"
      @delete-contact="onDeleteContact"
      @update-contact="onUpdateContact"
    />
  </div>
</template>

<script lang="ts">
import ContactsComponent from './Contacts';

export default ContactsComponent;
</script>

<style lang="scss" scoped>
@import '~@evan.network/ui/src/style/utils';

h1.heading {
  font-size: cssVar('h4-font-size');
  margin: 0;
  color: cssVar('gray-600');
  font-weight: bold;
}

.add-contact-btn {
  position: fixed !important;
  bottom: 80px;
  right: 60px;
}

/deep/ .evan-swipe-panel.light {
  background-color: cssVar('body-bg');

  * {
    color: cssVar('text-color');
  }
}
</style>
