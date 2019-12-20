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
    <div class="mt-2 mb-8"
      v-if="!entryName || $store.state.profileDApp.permissions.read.indexOf(entryName) === -1">
      <div class="d-flex justify-content-between align-items-center pb-1" v-if="!onlyForm">
        <h5 class="my-0 py-0 text-uppercase font-weight-bold">
          <i class="mdi mdi-lock mr-2" />
          {{ `_profile.not-permitted.${ entryName }` | translate }}
        </h5>
      </div>
      <p class="mt-3">
        {{ '_profile.not-permitted.desc' | translate }}
      </p>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
  import Component from './permission-wrapper';
  export default Component;
</script>
