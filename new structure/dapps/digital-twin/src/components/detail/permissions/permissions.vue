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
    <div class="white-box border-smooth rounded mt-3"
      v-for="(container, index) in uiDT.containers">
      <div class="header">
        <div style="width: calc(100% - 100px);">
          <h3 class="m-0 font-weight-semibold force-oneline">
            {{ container.description.name }}
          </h3>
          <span class="text-muted force-oneline"
            v-if="container.description.description">
            {{ container.description.description }}
          </span>
        </div>
        <span class="mx-auto"></span>
        <button class="btn"
          @click="$set(collapsed, container.address, !collapsed[container.address])">
          <i
            :class="{
              'mdi mdi-chevron-up': collapsed[container.address],
              'mdi mdi-chevron-down': !collapsed[container.address],
            }">
          </i>
        </button>
      </div>
      <dc-permissions
        class="position-relative m-5"
        v-if="collapsed[container.address]"
        :address="container.address">
      </dc-permissions>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './permissions.ts';
  export default Component;
</script>
