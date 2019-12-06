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
    <div class="row">
      <h1>{{ '_assets.digitaltwin.digitaltwin-title' | translate }}</h1>
      <evan-button :type="'text'">{{'_assets.digitaltwin.my-own' | translate }}</evan-button>
      <evan-button :type="'text'">{{'_assets.digitaltwin.favorites' | translate }}</evan-button>
      <evan-button :type="'text'">{{'_assets.digitaltwin.all' | translate }}</evan-button>
    </div>
    <b-table
      class="evan-table"
      hover
      :items="data"
      :fields="columns"
      sticky-header="75vh"
      @scroll.native="scrollHandler"
    >
      <!-- <template v-slot:name="name">{{name.first}} {{name.last}}</template> -->
    </b-table>
    <evan-loading v-if="isLoading"></evan-loading>
  </div>
</template>

<script lang="ts">
import DigitalTwinsComponent from './DigitalTwins';
export default DigitalTwinsComponent;
</script>
