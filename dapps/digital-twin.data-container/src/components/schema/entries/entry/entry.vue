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
  <div :id="`dc-entry-${ entryName }`">
    <evan-loading
      v-if="activeMode === 'loading'">
    </evan-loading>

    <template v-else>
      <div class="text-center p-5" v-if="!activeMode">
        <h3 class="mt-4 font-weight-semibold">
          {{ '_datacontainer.no-permissions.title' | translate }}
        </h3>
        <h5 class="font-weight-semibold text-muted">
          {{ '_datacontainer.no-permissions.desc' | translate }}
        </h5>
      </div>
      <div v-else>
        <h5 class="p-4 border-bottom border-sm font-weight-semibold">
          {{ '_datacontainer.entry.entry-type' | translate }}: {{ `_datacontainer.types.${ type }` | translate }}

          <template v-if="itemType">
            ({{ `_datacontainer.types.${ itemType }` | translate }})
          </template>
        </h5>
        <dc-entry-object
          :class="{ 'px-4 pb-4 pt-2': !schemaEdit }"
          ref="entryComp"
          v-if="type === 'object'"
          :activeMode="activeMode"
          :address="address"
          :entry="entry"
          :entryName="entryName"
          :schemaEdit="schemaEdit">
        </dc-entry-object>
        <dc-entry-list
          :class="{ 'px-4 pb-4 pt-2': !schemaEdit || itemType !== 'object' }"
          ref="entryComp"
          v-else-if="type === 'array'"
          @reset="resetValue"
          @save="saveValue"
          :activeMode="activeMode"
          :address="address"
          :entry="entry"
          :entryName="entryName"
          :schemaEdit="schemaEdit">
        </dc-entry-list>
        <dc-entry-field
          class="px-4 pb-4 pt-2"
          ref="entryComp"
          v-else
          :activeMode="activeMode"
          :address="address"
          :entry="entry"
          :entryName="entryName"
          :schemaEdit="schemaEdit">
        </dc-entry-field>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './entry.ts';
  export default Component;
</script>
