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
      <div class="d-flex flex-row justify-content-between">
        <div>
          <h1 class="h4">{{ '_assets.contacts.contacts-title' | translate }}</h1>
        </div>
        <div>
          <evan-button
            @click="filterByFavorites()"
            class="filter-btn ml-3"
            type="text-secondary"
            icon="mdi mdi-star-outline"
            iconPosition="left"
            :class="{ 'active': filterBy.includes('favorite') }"
            :label="$t('_assets.contacts.favorites')"
          ></evan-button>
          <evan-button
            @click="filterByType('users')"
            class="filter-btn ml-3"
            type="text-secondary"
            icon="mdi mdi-account-outline"
            iconPosition="left"
            :class="{ 'active': filter === 'users' }"
            :label="$t('_assets.contacts.users')"
          ></evan-button>
          <evan-button
            @click="filterByType('company')"
            class="filter-btn ml-3"
            type="text-secondary"
            icon="mdi mdi-domain"
            iconPosition="left"
            :class="{ 'active': filter === 'company' }"
            :label="$t('_assets.contacts.companies')"
          ></evan-button>
          <evan-button
            @click="filterByType('iot-device')"
            class="filter-btn ml-3"
            type="text-secondary"
            icon="mdi mdi-radio-tower"
            iconPosition="left"
            :class="{ 'active': filter === 'iot-device' }"
            :label="$t('_assets.contacts.iot-devices')"
          ></evan-button>
          <evan-button
            @click="resetFilter"
            class="filter-btn ml-3"
            type="text-secondary"
            icon="mdi mdi-account-multiple-outline"
            iconPosition="left"
            :class="{ 'active': filter === null }"
            :label="$t('_assets.contacts.all')"
          ></evan-button>
        </div>
      </div>

      <div class="d-flex flex-row mt-3">
        <b-table
          class="evan-table"
          hover
          :items="data"
          :fields="columns"
          :filter="filter"
          :filterIncludedFields="filterBy"
          :tbody-tr-class="'evan-table-body-row'"
          :thead-tr-class="'evan-table-head-row'"
          :thead-class="'evan-table-head'"
          @row-clicked="handleRowClicked"
          sticky-header="80vh"
          show-empty
        >
          <template
            v-slot:cell(alias)="data"
          >{{ data.item.alias ? data.item.alias: data.item.address }}</template>
          <template v-slot:cell(icon)="data">
            <i class="table-icon" :class="data.item.icon"></i>
          </template>
          <template v-slot:cell(favorite)="data">
            <i class="table-icon" :class="{'mdi mdi-star': data.item.favorite}"></i>
          </template>
  
          <!-- Empty slots -->
          <template v-slot:empty>
            <h4>{{ '_assets.contacts.contacts-empty' | translate }}</h4>
          </template>
          <template v-slot:emptyfiltered>
            <h4>{{ '_assets.contacts.filtered-empty' | translate }}</h4>
          </template>
        </b-table>
      </div>
      <evan-loading v-if="isLoading" :classes="'mt-3'"></evan-loading>
    </div>

    <evan-button
      :type="'icon-primary'"
      size="lg"
      class="add-contact-btn"
      icon="mdi mdi-plus"
      @click="$refs.addContact.showPanel()"
    ></evan-button>

    <add-contact ref="addContact" @contact-added="handleContactAdded" />
  </div>
</template>

<script lang="ts">
import ContactsComponent from './Contacts';
export default ContactsComponent;
</script>

<style lang="scss" scoped>
@import '~@evan.network/ui/src/style/utils';

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

/deep/ .filter-btn.btn {
  color: cssVar('gray-600');
  i.left.mdi {
    margin-right: 0;
  }
  &.active {
    border-bottom: 2px solid cssVar('primary');
  }
}

/deep/ .evan-swipe-panel.light {
  .light & {
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
}
</style>
