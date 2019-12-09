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
      <div class="col-6">
        <h1 class="h4">{{ '_assets.digitaltwins.digitaltwins-title' | translate }}</h1>
      </div>
      <div class="col-6 text-right">
        <evan-button :type="'text'">{{'_assets.digitaltwins.my-own' | translate }}</evan-button>
        <evan-button :type="'text'">{{'_assets.digitaltwins.favorites' | translate }}</evan-button>
        <evan-button :type="'text'">{{'_assets.digitaltwins.all' | translate }}</evan-button>
      </div>
    </div>
    <b-table
      class="evan-table"
      hover
      :items="data"
      :fields="columns"
      :tbody-tr-class="'evan-table-body-row'"
      :thead-tr-class="'evan-table-head-row'"
      :thead-class="'evan-table-head'"
      sticky-header="80vh"
      @scroll.native="scrollHandler"
    >
      <template v-slot:cell(icon)="data">
        <i class="table-icon" :class="data.item.icon"></i>
      </template>
      <template v-slot:cell(favorite)="data">
        <i class="table-icon" :class="{'mdi mdi-star': data.item.favorite}"></i>
      </template>
    </b-table>
    <evan-loading v-if="isLoading" :classes="'mt-3'"></evan-loading>
  </div>
</template>

<script lang="ts">
import DigitalTwinsComponent from './DigitalTwins';
export default DigitalTwinsComponent;
</script>

<style lang="scss">
@import'~@evan.network/ui/src/style/utils';

// Global table styles
// TODO: Refactor into evan-table component for unified style
.evan-table {
  margin: 0;

  table.table.b-table {
    border-spacing: 0 4px;
    border-collapse: separate;

    & > thead.evan-table-head > tr.evan-table-head-row > th {
      background-color: cssVar('bg-level-3');
      border: none;
      color: cssVar('gray-600');
    }

    & > tbody > tr.evan-table-body-row {
      height: 64px;
      background-color: white;

      & > td {
        vertical-align: middle;
        border: none;
      }
    }

    i.table-icon {
      font-size: 1.75em;
      margin-left: 0.25em;
    }
  }
}
</style>
