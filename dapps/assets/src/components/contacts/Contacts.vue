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
    <div class="content pt-5">
      <div class="d-flex flex-row justify-content-between align-items-center">
        <div>
          <h1 class="heading">
            {{ '_assets.contacts.contacts-title' | translate }}
          </h1>
        </div>
        <div>
          <evan-button
            class="filter-btn ml-3"
            type="text-filter"
            icon="mdi mdi-star-outline"
            icon-position="left"
            :class="{ active: filterBy.includes('isFavorite') }"
            :label="$t('_assets.contacts.favorites')"
            @click="filterByFavorites()"
          />
          <evan-button
            class="filter-btn ml-3"
            type="text-filter"
            icon="mdi mdi-account-outline"
            icon-position="left"
            :class="{ active: filter === 'users' }"
            :label="$t('_assets.contacts.users')"
            @click="filterByType('users')"
          />
          <evan-button
            class="filter-btn ml-3"
            type="text-filter"
            icon="mdi mdi-domain"
            icon-position="left"
            :class="{ active: filter === 'company' }"
            :label="$t('_assets.contacts.companies')"
            @click="filterByType('company')"
          />
          <evan-button
            class="filter-btn ml-3"
            type="text-filter"
            icon="mdi mdi-radio-tower"
            icon-position="left"
            :class="{ active: filter === 'device' }"
            :label="$t('_assets.contacts.iot-devices')"
            @click="filterByType('device')"
          />
          <evan-button
            class="filter-btn ml-3"
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
          :hover="true"
          :items="contacts"
          :fields="columns"
          :filter="filter"
          :filter-included-fields="filterBy"
          :sticky-header="'80vh'"
          :show-empty="true"
          :show-scrollbar="true"
          @row-clicked="handleRowClicked"
        >
          <template v-slot:cell(alias)="contacts">
            {{
              contacts.item.alias ? contacts.item.alias : contacts.item.address
            }}
          </template>
          <template v-slot:cell(icon)="contacts">
            <i
              class="table-icon"
              :class="contacts.item.icon"
            />
          </template>
          <template v-slot:cell(createdAt)="contacts">
            {{ contacts.item.createdAt | moment('DD.MM.YYYY') }}
          </template>
          <template v-slot:cell(updatedAt)="contacts">
            {{ contacts.item.updatedAt | moment('DD.MM.YYYY') }}
          </template>
          <template v-slot:cell(isFavorite)="contacts">
            <evan-loading
              v-if="
                isFavoriteLoading.loading &&
                  isFavoriteLoading.id === contacts.item.address
              "
              classes=""
            />
            <evan-button
              v-else-if="contacts.item.isFavorite === 'true'"
              type="icon-secondary"
              icon="mdi mdi-star"
              :disabled="isFavoriteLoading.loading"
              @click="removeFavorite(contacts)"
            />
            <evan-button
              v-else
              class="visible-on-row-hover"
              type="icon-secondary"
              icon="mdi mdi-star-outline"
              :disabled="isFavoriteLoading.loading"
              @click="addFavorite(contacts)"
            />
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
    </div>

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

.content {
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
}

.add-contact-btn {
  position: fixed;
  bottom: 40px;
  right: 60px;
}

/deep/.filter-btn {
  span {
    font-size: 12px;
  }
}

/deep/ .evan-swipe-panel.light {
  background-color: cssVar('body-bg');

  &,
  h1,
  h2,
  h3,
  h4,
  h5,
  span,
  p,
  li,
  b,
  label,
  small {
    color: cssVar('text-color');
  }
}
</style>
