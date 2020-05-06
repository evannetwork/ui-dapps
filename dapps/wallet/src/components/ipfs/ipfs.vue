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
    <div
      v-else
      class="evan-content-container"
    >
      <div class="mb-3">
        <div class="mb-1 d-flex flex-row justify-content-between">
          <div>
            <h1>{{ $t('_wallet.ipfs.storage-fees.title') }}</h1>
            <p>{{ $t('_wallet.ipfs.storage-fees.description') }}</p>
          </div>
        </div>
      </div>

      <evan-base-list
        class="mt-5"
        :data="renderedOverview()"
      >
        <template
          v-slot:item="{ item }"
          style="height: 80px;"
        >
          <div class="d-flex align-items-center h-100 px-3">
            <i
              :class="`mdi mdi-${item.icon} mr-3`"
              style="font-size: 2rem;"
            />
            <div>
              <p class="mb-0 font-weight-semibold">
                {{ $t(item.title) }}
              </p>
            </div>
            <span class="mx-auto" />
            <span>
              {{ item.value }}
            </span>
          </div>
        </template>
      </evan-base-list>
    </div>
    <ipfs-side-panel />
  </div>
</template>

<script lang="ts">
import Component from './ipfs';

export default Component;
</script>
