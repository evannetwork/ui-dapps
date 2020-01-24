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
  <b-table
    v-bind="$attrs"
    class="evan-table-wrapper"
    :class="{ 'show-scrollbar': showScrollbar }"
    :tbody-tr-class="'evan-table-body-row'"
    :thead-tr-class="'evan-table-head-row'"
    :thead-class="'evan-table-head'"
    v-on="$listeners"
  >
    <!-- Pass on all named slots -->
    <slot
      v-for="slot in Object.keys($slots)"
      :slot="slot"
      :name="slot"
    />

    <!-- Pass on all scoped slots -->
    <template
      v-for="slot in Object.keys($scopedSlots)"
      :slot="slot"
      slot-scope="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
      />
    </template>
  </b-table>
</template>

<script lang="ts">
import Component from './table';

export default Component;
</script>

<style lang="scss" scoped>
@import './table.scss';
</style>
