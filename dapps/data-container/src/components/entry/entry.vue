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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

<template>
  <div class="bg-level-2 border-bottom border-right border-left position-relative">
    <div v-if="modes.length === 0">
      <div class="d-flex p-3 border-bottom align-items-center">
        <h4 class="m-0">
          {{ `_datacontainer.ajv.not-permitted.title` | translate }}
        </h4>
      </div>

      <h5 class="p-3">
        {{ `_datacontainer.ajv.not-permitted.desc` | translate }}
      </h5>
    </div>

    <div class="p-3" v-if="modes.length !== 0">
      <div class="d-flex w-100 justify-content-end"
        v-if="modes.length !== 1">
        <div class="d-flex align-items-center p-2 text-center border border-sm clickable all-transition"
          style="margin-left: -1px;"
          v-for="(mode, i) in modes"
          :class="activeMode === mode ? 'bg-secondary bg-text-secondary' : 'bg-level-1'"
          @click="activeMode = mode">
          <i :class="modeIconMapping[mode]"></i>
        </div>
      </div>
      <di-entry-list
        v-if="entry.dataSchema.type === 'list'"
        :entry="entry"
        :mode="activeMode">
      </di-entry-list>
      <di-entry-object
        v-if="entry.dataSchema.type === 'object'"
        :entry="entry"
        :mode="activeMode"></di-entry-object>
      <di-field
        v-if="entry.dataSchema.type !== 'object' && entry.dataSchema.type !== 'list'" 
        :mode="activeMode"
        :schema="entry.dataSchema"
        :value="entry.value">
      </di-field>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './ajv.ts';
  export default Component;
</script>



