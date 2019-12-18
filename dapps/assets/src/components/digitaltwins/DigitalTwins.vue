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
    <div class="row mt-5">
      <div class="col-8">
        <div class="search">
          <label
            @click="isActiveSearch = true"
            for="searchInput"
          >
            <i class="mdi mdi-magnify"></i>
            <span class="h4" v-if="!isActiveSearch">{{ '_assets.digitaltwins.digitaltwins-title' | translate }}</span>
          </label>
          <input
            id="searchInput"
            v-if="isActiveSearch"
            placeholder="0x123ABC..."
            class="border-0"
            v-model="searchTerm"
          />
        </div>
      </div>
      <div class="col-4 text-right">
        <evan-button :type="'text'">{{'_assets.search.my-own' | translate }}</evan-button>
        <evan-button :type="'text'">{{'_assets.digitaltwins.favorites' | translate }}</evan-button>
        <evan-button :type="'text'">{{'_assets.digitaltwins.all' | translate }}</evan-button>
      </div>
    </div>
    <template v-if="total === 0">
      <p class="bold mt-5 search-hint text-center mt-5">
        {{ '_assets.search.no-results' | translate }}
      </p>
    </template>
    <b-table
      class="evan-table"
      hover
      :items="data"
      :fields="columns"
      :tbody-tr-class="'evan-table-row'"
      sticky-header="80vh"
      @scroll.native="scrollHandler"
    >
      <template v-slot:cell(icon)="data">
        <i class="table-icon" :class="data.item.icon"></i>
      </template>
      <!-- <template v-slot:name="name">{{name.first}} {{name.last}}</template> -->
    </b-table>
    <evan-loading v-if="isLoading" :classes="'mt-3'"></evan-loading>
  </div>
</template>

<script lang="ts">
  import DigitalTwinsComponent from './DigitalTwins';
  export default DigitalTwinsComponent;
</script>

<style lang="scss" scoped>
  @import './DigitalTwins.scss';
</style>
