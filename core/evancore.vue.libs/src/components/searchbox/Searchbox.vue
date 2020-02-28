/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received button copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/
*/

<template>
  <div>
    <label
      :for="id"
      @click="isActiveSearch = true"
    >
      <i
        class="mdi mdi-magnify mr-1"
        style="font-size: 22px"
      />
      <slot
        v-if="!isActiveSearch"
        :class="labelClass"
      />
    </label>
    <input
      v-show="isActiveSearch"
      :id="id"
      ref="searchInput"
      v-model="searchTerm"
      autocomplete="off"
      @keyup="onKeyUp"
      @blur="onBlur"
      @keydown.enter="$event.target.blur()"
    >
  </div>
</template>

<script lang="ts">
import Component from './Searchbox';

export default Component;
</script>

<style lang="scss" scoped>
@import '~@evan.network/ui/src/style/utils';

span, i {
  font-size: cssVar('h4-font-size');
  color: cssVar('gray-600');
  font-weight: bold;
  cursor: pointer;
}

input {
  padding: 2px 8px;
  outline: none;
  background: transparent;
  border: none;
  color: cssVar('gray-600');
  font-size: cssVar('h4-font-size');
  font-weight: bold;

  &:focus {
    border-bottom: 1px solid cssVar('gray-600');
  }
}
</style>
