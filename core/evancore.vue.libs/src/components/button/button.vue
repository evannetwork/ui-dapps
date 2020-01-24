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
  <component
    :is="href ? 'a' : 'button'"
    class="btn button-wrapper"
    :class="[
      { 'is-loading': isLoading },
      { [ `btn-${ size }` ]: size !== 'normal' },
      { [ `btn-${ type }` ]: !knownTypes[type] },
      { [ knownTypes[type] ]: knownTypes[type] },
    ]"
    :disabled="disabled"
    :href="href"
    :rel="href ? 'noopener noreferrer': ''"
    :type="nativeType"
    @click="$emit('click', $event)"
  >
    <template v-if="!$slots.default">
      <div
        v-if="isLoading"
        class="spinner-border spinner-border-sm"
      />
      <template>
        <template v-if="icon && !label">
          <i :class="[icon, 'centered']" />
        </template>
        <template v-else>
          <i
            v-if="icon && iconPosition === 'left'"
            :class="[icon, 'label', 'left']"
          />
          <span>{{ label }}</span>
          <i
            v-if="icon && iconPosition === 'right'"
            :class="[icon, 'label', 'right']"
          />
        </template>
      </template>
    </template>
    <slot />
  </component>
</template>

<script lang="ts">
import Button from './button';

export default Button;
</script>

<style lang="scss" scoped>
  @import './button.scss';
</style>
