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
    <select
      class="form-control custom-select"
      :id="id"
      :value="value"
      :disabled="disabled"
      :required="required"
      @blur="$emit('blur')"
      @focus="$parent.$emit('setFocus')"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event)"
      v-bind="$attrs"
    >
      <option v-if="placeholder" value="" selected disabled hidden>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :value="option.value || option"
        :key="option.value || option"
      >{{ (option.label || option) | translate }}</option>
    </select>
  </evan-form-control>
</template>

<script lang="ts">
import FormDataSelect from './select';
export default FormDataSelect;
</script>
