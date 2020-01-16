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
        <div class="search">
          <label @click="isActiveSearch = true" for="searchInput">
            <i class="mdi mdi-magnify mr-2"></i>
            <span v-if="!isActiveSearch">{{ '_assets.digitaltwins.digitaltwins-title' | translate }}</span>
          </label>
          <input
            id="searchInput"
            ref="searchInput"
            v-show="isActiveSearch"
            v-model="searchTerm"
            @blur="handleSearchBlur"
            @keydown.enter="$event.target.blur()"
            autocomplete="off"
          />
        </div>
        <div>
          <evan-button
            @click="selectedFilter = 'my'"
            class="filter-btn ml-3"
            type="text-filter"
            icon="mdi mdi-account-outline"
            iconPosition="left"
            :class="{ 'active': selectedFilter === 'my' }"
            :label="$t('_assets.digitaltwins.my-own')"
          />
          <evan-button
            @click="selectedFilter = 'favorites'"
            class="filter-btn ml-3"
            type="text-filter"
            icon="mdi mdi-star-outline"
            iconPosition="left"
            :class="{ 'active': selectedFilter === 'favorites' }"
            :label="$t('_assets.digitaltwins.favorites')"
          />
          <evan-button
            @click="selectedFilter = 'all'"
            class="filter-btn ml-3"
            type="text-filter"
            icon="mdi mdi-cube-outline"
            iconPosition="left"
            :class="{ 'active': selectedFilter === 'all' }"
            :label="$t('_assets.digitaltwins.all')"
          />
        </div>
      </div>

      <div class="d-flex flex-row mt-3">
        <evan-table
          :hover="true"
          :items="data"
          :fields="columns"
          :show-scrollbar="true"
          :sticky-header="'80vh'"
          :sortBy="sortBy"
          :sort-direction="reverse ? 'desc' : 'asc'"
          no-local-sorting="true"
          @sort-changed="sortHandler"
          @scroll.native="scrollHandler"
          @row-clicked="handleRowClicked"
        >
          <template v-slot:cell(icon)="data">
            <i class="table-icon mdi mdi-cube-outline" />
          </template>
          <template v-slot:cell(updated)="data">{{ data.item.updated | moment('DD.MM.YYYY hh:mm') }}</template>
          <template v-slot:cell(created)="data">{{ data.item.created | moment('DD.MM.YYYY hh:mm') }}</template>
          <template v-slot:cell(isFavorite)="twin">
            <evan-loading v-if="isFavoriteLoading(twin)" classes />
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
        </evan-table>
      </div>
    </div>

    <evan-loading v-if="isLoading" classes />

    <evan-button
      :type="'icon-primary'"
      size="lg"
      class="add-twin-btn"
      icon="mdi mdi-plus"
      @click="$refs.addDigitaTwin.showPanel()"
    />

    <add-digital-twin ref="addDigitaTwin" :createdCallBack="delayedSearch" />
  </div>
</template>

<script lang="ts">
import DigitalTwinsComponent from './DigitalTwins';
export default DigitalTwinsComponent;
</script>

<style lang="scss" scoped>
@import './DigitalTwins.scss';
</style>
