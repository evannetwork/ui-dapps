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
    <b-overlay
      :show="show"
      blur="0"
      variant="dark"
      opacity="0.5"
      z-index="1000"
      no-center
      fixed
      no-wrap
      @click="show = false"
    >
      <template #overlay>
        <div
          class="callout"
        >
          Test
        </div>
      </template>
    </b-overlay>
    <button @click="show = !show" />
  </div>
</template>

<script lang="ts">
import Component from './UserCallout';

export default Component;
</script>

<style lang="scss" scoped>
.callout {
  position: absolute;
  bottom: 0;
  left: 0;
  border: 1px solid red;
  width: 250px;
  height: 300px;
}
</style>
