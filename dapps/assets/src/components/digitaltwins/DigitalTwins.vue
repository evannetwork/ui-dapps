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
        id="searchInput"
        ref="searchbox"
        :debounce-time="250"
        @keyup="onSearchChange($event.target.value)"
      >
        <span v-if="searchTerm">{{ searchTerm }}</span>
        <span v-else>{{ '_assets.digitaltwins.digitaltwins-title' | translate }}</span>
      </evan-searchbox>

      <div>
        <evan-button
          class="ml-3"
          type="text-filter"
          icon="mdi mdi-account-outline"
          icon-position="left"
          :class="{ active: selectedFilter === 'my' }"
          :label="$t('_assets.digitaltwins.my-own')"
          @click="selectedFilter = 'my'"
        />
        <evan-button
          class="ml-3"
          type="text-filter"
          icon="mdi mdi-star-outline"
          icon-position="left"
          :class="{ active: selectedFilter === 'favorites' }"
          :label="$t('_assets.digitaltwins.favorites')"
          @click="selectedFilter = 'favorites'"
        />
        <evan-button
          class="ml-3"
          type="text-filter"
          icon="mdi mdi-cube-outline"
          icon-position="left"
          :class="{ active: selectedFilter === 'all' }"
          :label="$t('_assets.digitaltwins.all')"
          @click="selectedFilter = 'all'"
        />
      </div>
    </div>

    <div class="d-flex flex-row mt-3">
      <evan-table
        class="clickable-rows"
        :items="selectedFilter === 'favorites' ? loadedFavorites : data"
        :fields="columns"
        :show-empty="!isLoading"
        :sticky-header="'calc(100vh - 85px)'"
        :sort-by="sortBy"
        :sort-direction="reverse ? 'desc' : 'asc'"
        :tbody-transition-props="{ name: 'list', mode: 'out-in' }"
        no-local-sorting="true"
        @sort-changed="sortHandler"
        @scroll="scrollHandler"
        @row-clicked="handleRowClicked"
      >
        <template v-slot:cell(icon)>
          <i class="table-icon mdi mdi-cube-outline" />
        </template>
        <template v-slot:cell(updated)="data">
          {{ data.item.updated | moment('L') }}
        </template>
        <template v-slot:cell(created)="data">
          {{ data.item.created | moment('L') }}
        </template>
        <template v-slot:cell(isFavorite)="twin">
          <evan-loading
            v-if="isFavoriteLoading(twin)"
            classes="icon-replacer"
          />
          <evan-button
            v-else-if="isFavorite(twin)"
            type="icon-secondary"
            icon="mdi mdi-star"
            :disabled="isAnyLoading"
            @click="removeFavorite(twin)"
          />
          <evan-button
            v-else
            class="visible-on-row-hover"
            type="icon-secondary"
            icon="mdi mdi-star-outline"
            :disabled="isAnyLoading"
            @click="addFavorite(twin)"
          />
        </template>

        <template v-slot:table-caption>
          <div class="table-spacer" />
        </template>

        <!-- Empty slots -->
        <template v-slot:empty>
          <span v-if="!hasError">
            {{ '_assets.digitaltwins.digitaltwins-empty' | translate }}
          </span>
          <div
            v-else
            class="p-5 text-center"
          >
            <h3 class="mb-5">
              {{ '_assets.search.error' | translate }}
            </h3>
            <evan-failed />
          </div>
        </template>
      </evan-table>
    </div>

    <evan-loading v-if="isLoading" />

    <evan-button
      :type="'icon-primary'"
      size="lg"
      class="add-twin-btn"
      icon="mdi mdi-plus"
      @click="$refs.addDigitaTwin.showPanel()"
    />

    <add-digital-twin
      ref="addDigitaTwin"
      :created-call-back="delayedSearch"
    />
  </div>
</template>

<script lang="ts">
import DigitalTwinsComponent from './DigitalTwins';

export default DigitalTwinsComponent;
</script>

<style lang="scss" scoped>
@import './DigitalTwins.scss';
</style>
