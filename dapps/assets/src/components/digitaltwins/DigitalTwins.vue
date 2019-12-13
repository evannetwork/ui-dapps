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
          <h1
            class="h4"
            style="margin:0"
          >{{ '_assets.digitaltwins.digitaltwins-title' | translate }}</h1>
        </div>
        <div>
          <evan-button
            @click="filterByOwn()"
            class="filter-btn ml-3"
            type="text-secondary"
            icon="mdi mdi-account-outline"
            iconPosition="left"
            :class="{ 'active': selectedFilter === 'own' }"
            :label="$t('_assets.digitaltwins.favorites')"
          ></evan-button>
          <evan-button
            @click="filterByFavorites()"
            class="filter-btn ml-3"
            type="text-secondary"
            icon="mdi mdi-star-outline"
            iconPosition="left"
            :class="{ 'active': selectedFilter === 'favorites' }"
            :label="$t('_assets.digitaltwins.favorites')"
          ></evan-button>
          <evan-button
            @click="filterByAll()"
            class="filter-btn ml-3"
            type="text-secondary"
            icon="mdi mdi-account-multiple-outline"
            iconPosition="left"
            :class="{ 'active': selectedFilter === 'all' }"
            :label="$t('_assets.digitaltwins.all')"
          ></evan-button>
        </div>
      </div>
    </div>

    <div class="d-flex flex-row mt-3">
      <b-table
        :hover="true"
        :items="data"
        :fields="columns"
        :tbody-tr-class="'evan-table-body-row'"
        :thead-tr-class="'evan-table-head-row'"
        :thead-class="'evan-table-head'"
        :sticky-header="'80vh'"
        @scroll.native="scrollHandler"
      >
        <template v-slot:cell(icon)="data">
          <i class="table-icon" :class="data.item.icon"></i>
        </template>
        <template v-slot:cell(favorite)="data">
          <i class="table-icon" :class="{'mdi mdi-star': data.item.favorite}"></i>
        </template>
      </b-table>
    </div>

    <evan-loading v-if="isLoading" :classes="'mt-3'"></evan-loading>
  </div>
</template>

<script lang="ts">
import DigitalTwinsComponent from './DigitalTwins';
export default DigitalTwinsComponent;
</script>

<style lang="scss" scoped>
@import '~@evan.network/ui/src/style/utils';

/deep/ .filter-btn.btn {
  color: cssVar('gray-600');
  i.left.mdi {
    margin-right: 0;
  }
  &.active {
    border-bottom: 2px solid cssVar('primary');
  }
}
</style>
