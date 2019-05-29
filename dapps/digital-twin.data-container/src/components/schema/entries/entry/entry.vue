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
      <dc-entry-object
        ref="entryComp"
        v-else-if="type === 'object'"
        :activeMode="activeMode"
        :address="address"
        :entry="entry"
        :entryName="entryName">
      </dc-entry-object>
      <dc-entry-list
        ref="entryComp"
        v-else-if="type === 'array'"
        @reset="resetValue"
        @save="saveValue"
        :activeMode="activeMode"
        :address="address"
        :entry="entry"
        :entryName="entryName">
      </dc-entry-list>
      <dc-entry-field
        ref="entryComp"
        v-else
        :activeMode="activeMode"
        :address="address"
        :entry="entry"
        :entryName="entryName">
      </dc-entry-field>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './entry.ts';
  export default Component;
</script>
