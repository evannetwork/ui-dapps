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
  <div class="content pt-5">
    <div
      v-if="!$store.state.twin.isOwner"
      class="text-center d-flex flex-column justify-content-center align-items-center vh-100"
    >
      <h1>
        <i class="mdi mdi-eye-off-outline" />
      </h1>
      <span>{{ '_evan.no-permission' | translate }}</span>
    </div>
    <template v-else>
      <div
        class="d-flex flex-row justify-content-between align-items-center"
        style="max-height: 33px"
      >
        <div class="search">
          <label
            id="twin-enable-search"
            for="searchInput"
            @click="isActiveSearch = true"
          >
            <i
              class="mdi mdi-magnify mr-1"
              style="font-size: 22px"
            />
            <span v-if="!isActiveSearch">{{
              '_twin-detail.sharings.sharings-title' | translate
            }}</span>
          </label>
          <input
            v-show="isActiveSearch"
            id="searchInput"
            ref="searchInput"
            v-model="searchTerm"
            autocomplete="off"
            @blur="handleSearchBlur"
            @keydown.enter="$event.target.blur()"
          >
        </div>
        <div>
          <evan-button
            v-for="filter in filters"
            :key="filter.type"
            class="ml-3"
            type="text-filter"
            :icon="`mdi mdi-${filter.icon}`"
            icon-position="left"
            :class="{ active: selectedFilter === filter.type }"
            :label="$t(`_twin-detail.sharings.filters.${filter.type}`)"
            @click="selectedFilter = filter.type"
          />
        </div>
      </div>

      <div class="d-flex flex-row mt-3">
        <evan-table
          class="clickable-rows"
          :items="getTableData()"
          :fields="columns"
          :show-empty="!loading"
          :sticky-header="'calc(100vh - 85px)'"
          :sort-by="sortBy"
          :sort-direction="reverse ? 'desc' : 'asc'"
          no-local-sorting="true"
          @sort-changed="sortHandler"
          @row-clicked="openShareSidePanel($event.address)"
        >
          <template v-slot:cell(icon)="data">
            <i :class="`table-icon mdi mdi-${data.item.icon}`" />
          </template>

          <template v-slot:cell(name)="data">
            {{ data.item.name }}
          </template>

          <template v-slot:cell(containers)="data">
            {{ data.item.containerNames.join(', ') }}
          </template>
          <template v-slot:empty>
            <span
              v-if="selectedFilter === 'all' && !searchTerm"
              class="text-center d-block"
            >
              {{ '_twin-detail.sharings.no-sharings' | translate }}
            </span>
            <span
              v-else
              class="text-center d-block"
            >
              {{
                $t('_twin-detail.sharings.no-sharings-filter', {
                  searchTerm: searchTerm || '*',
                  filter: $t(`_twin-detail.sharings.filters.${selectedFilter}`)
                })
              }}
            </span>
          </template>
        </evan-table>
      </div>

      <evan-loading v-if="loading" />

      <evan-button
        id="share-twin-btn"
        :type="'icon-primary'"
        size="lg"
        class="share-twin-btn"
        icon="mdi mdi-plus"
        @click="openShareSidePanel()"
      />
      <share-container
        ref="shareContainer"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Component from './SharingOverview';

export default Component;
</script>

<style lang="scss" scoped>
@import './SharingOverview.scss';
</style>
