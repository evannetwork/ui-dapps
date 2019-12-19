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
          <h1 class="header">{{ '_assets.digitaltwins.digitaltwins-title' | translate }}</h1>
        </div>
        <div>
          <evan-button
            @click="filterByOwn()"
            class="filter-btn ml-3"
            type="text-filter"
            icon="mdi mdi-account-outline"
            iconPosition="left"
            :class="{ 'active': selectedFilter === 'own' }"
            :label="$t('_assets.digitaltwins.my-own')"
          />
          <evan-button
            @click="filterByFavorites()"
            class="filter-btn ml-3"
            type="text-filter"
            icon="mdi mdi-star-outline"
            iconPosition="left"
            :class="{ 'active': selectedFilter === 'favorites' }"
            :label="$t('_assets.digitaltwins.favorites')"
          />
          <evan-button
            @click="filterByAll()"
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
          @scroll.native="scrollHandler"
        >
          <template v-slot:cell(icon)="data">
            <i class="table-icon" :class="data.item.icon"></i>
          </template>
          <template v-slot:cell(favorite)="data">
            <i class="table-icon" :class="{'mdi mdi-star': data.item.favorite}"></i>
          </template>
        </evan-table>
      </div>
    </div>

    <evan-loading v-if="isLoading" :classes="'mt-3'" />

    <evan-button
      :type="'icon-primary'"
      size="lg"
      class="add-twin-btn"
      icon="mdi mdi-plus"
      @click="$refs.addDigitaTwin.showPanel()"
    />

    <add-digital-twin ref="addDigitaTwin" />
  </div>
</template>

<script lang="ts">
import DigitalTwinsComponent from './DigitalTwins';
export default DigitalTwinsComponent;
</script>

<style lang="scss" scoped>
@import '~@evan.network/ui/src/style/utils';

h1.header {
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

.add-twin-btn {
  position: fixed;
  bottom: 40px;
  right: 60px;
}
</style>
