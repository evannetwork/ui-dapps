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
  <div class="wrapper">
    <span
      class="evan-address"
      :class="this.class"
      @mouseenter="hover = true;"
      @mouseleave="hover = false;"
    >
      {{ did }}
    </span>
    <div class="interactions">
      <button
        class="btn btn-sm btn-icon"
        :title="'_evan.address.copy' | translate"
        @click="copyAddress(did);"
      >
        <i class="mdi mdi-content-copy" />
        <evan-tooltip>{{ '_evan.address.copy' | translate }}</evan-tooltip>
      </button>
      <a
        class="btn btn-sm btn-icon"
        target="_blank"
        :href="`https://${getRuntime().environment === 'testcore' ? 'test' : ''}explorer.evan.network/address/${ address }/transactions`"
      >
        <i class="mdi mdi-map-marker-path" />
        <evan-tooltip>{{ '_evan.address.open-in-explorer' | translate }}</evan-tooltip>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Component from './address';

export default Component;
</script>

<style lang="scss" scoped>
  @import './address.scss';
</style>
