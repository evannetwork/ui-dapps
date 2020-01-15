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
    <evan-loading v-if="loading" />
    <div v-else>
      <div>
        <h3>{{ `${ $route.params.container }.name` | translate }}</h3>
        <span>{{ `${ $route.params.container }.description` | translate }}</span>
        <div class="spinner-border spinner-border-sm" v-if="$route.params.container.dispatcherStates.description"></div>
        <div class="spinner-border spinner-border-sm" v-if="$route.params.container.dispatcherStates.container"></div>
      </div>

      <div class="bg-white p-3 mt-3"
        v-for="(entryKey, index) in $store.state.container.entryKeys">
        <h5 class="my-0 py-0 text-uppercase font-weight-bold">
          {{ $t(`${ $route.params.container }.properties.${ entryKey }.name`, entryKey) }}
          {{ $t(`${ $route.params.container }.properties.${ entryKey }.description`, entryKey) }}
          <div class="spinner-border spinner-border-sm" v-if="$route.params.container.dispatcherStates.entries[entryKey]"></div>
        </h5>

        <textarea
          :value="JSON.stringify($store.state.container.entries[entryKey], null, 2)"
          class="mt-3"
          rows="10"
          style="width: 500px"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import TestContainerComponent from './TestContainer';
export default TestContainerComponent;
</script>

<style lang="scss" scoped>

</style>
