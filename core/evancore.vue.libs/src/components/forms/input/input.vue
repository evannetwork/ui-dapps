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
  <evan-form-control v-bind="$props">
    <div
      v-if="prohibited"
      class="prohibited"
    >
      <span>{{ '_evan.no-permission' | translate }}</span>
      <i class="mdi mdi-eye-off-outline" />
    </div>
    <input
      v-else
      :id="id"
      class="form-control"
      v-bind="$props"
      :class="{ 'is-invalid' : error }"
      :value="value"
      @blur="$emit('blur')"
      @focus="$parent.$emit('setFocus')"
      @input="$emit('input', $event.target.value)"
    >
  </evan-form-control>
</template>

<script lang="ts">
import FormDataInput from './input';

export default FormDataInput;
</script>

<style lang="scss" scoped>
  @import './input.scss';
</style>
