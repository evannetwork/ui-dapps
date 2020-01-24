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
  <div class="content-card">
    <div
      class="d-flex justify-content-between align-items-center pb-1"
    >
      <h5 class="my-0 py-0 text-uppercase font-weight-bold">
        <i
          class="mdi mr-2 mdi-lock"
        />
        {{ $t(`${ $route.params.container }.properties.${ name }.name`, name) }}
      </h5>
      <evan-button
        type="secondary"
        size="sm"
        :label="'_evan.share' | translate"
        @click="share()"
      />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import DataSetComponent from './DataSet';

export default DataSetComponent;
</script>

<style lang="scss" scoped>

</style>
