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
    <p v-if="searchTerm" class="bold mt-5 search-hint">
      {{ '_assets.search.searched-for' | translate }} {{ searchTerm }}
    </p>
    <router-view
      v-if="total > 0"
      :data="data"
      :isLoading="isLoading"
      :fetchMore="fetchMore"
    ></router-view>
    <template v-if="total === 0">
      <p class="bold mt-5 search-hint text-center mt-5">
        {{ '_assets.search.no-results' | translate }}
      </p>
    </template>
  </div>
</template>

<script lang="ts">
  import DataContainer from './DataContainer';
  export default DataContainer;
</script>

<style lang="scss" scoped>
  @import './DataContainer.scss';
</style>
