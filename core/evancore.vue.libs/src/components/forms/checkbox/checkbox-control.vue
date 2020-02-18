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
  <evan-form-control
    v-bind="$props"
    class="checkbox"
  >
    <div
      v-if="prohibited"
      class="prohibited"
    >
      <i class="mdi mdi-eye-off-outline" />
    </div>
    <template v-else>
      <input
        :id="id"
        class="form-control"
        v-bind="$props"
        type="checkbox"
        :class="{ 'is-invalid' : error}"
        :checked="value"
        @blur="$emit('blur')"
        @focus="$parent.$emit('setFocus')"
        @click="onClick()"
      >
      <label
        :for="id"
      />
    </template>
  </evan-form-control>
</template>

<script lang="ts">
import CheckboxControl from './checkbox-control';

export default CheckboxControl;
</script>

<style lang="scss" scoped>
  @import './checkbox.scss'
</style>
