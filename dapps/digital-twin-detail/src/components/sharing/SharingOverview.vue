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
            class="ml-3"
            type="text-filter"
            icon="mdi mdi-account-outline"
            icon-position="left"
            :class="{ active: selectedFilter === 'user' }"
            :label="$t('_twin-detail.sharings.filters.user')"
            @click="selectedFilter = 'user'"
          />
          <evan-button
            class="ml-3"
            type="text-filter"
            icon="mdi mdi-domain"
            icon-position="left"
            :class="{ active: selectedFilter === 'company' }"
            :label="$t('_twin-detail.sharings.filters.company')"
            @click="selectedFilter = 'company'"
          />
          <evan-button
            class="ml-3"
            type="text-filter"
            icon="mdi mdi-share-variant"
            icon-position="left"
            :class="{ active: selectedFilter === 'all' }"
            :label="$t('_twin-detail.sharings.filters.all')"
            @click="selectedFilter = 'all'"
          />
        </div>
      </div>

      <div class="d-flex flex-row mt-3">
        permission table!
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from './SharingOverview.ts';

export default Component;
</script>
