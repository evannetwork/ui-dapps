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
  <div>
    <evan-loading v-if="loading"></evan-loading>
    <div class="white-box border-smooth rounded" v-else>
      <div class="header">
        <h3 class="font-weight-semibold m-0">
          {{ '_digitaltwins.breadcrumbs.dc-sets-add' | translate }}
        </h3>
        <span class="mx-auto"></span>
        <div>
          <dc-set-actions
            :containerAddress="containerAddress"
            :entryName="entryName"
            :displayMode="'buttons'"
            :setActions="true"
            :schemaActions="false"
            :listActions="false">
          </dc-set-actions>
        </div>
      </div>
      <div class="content">
        <dc-new-entry
          v-if="!newEntry"
          ref="dcNewEntry"
          :template="template"
          @submit="newEntry = $event">
        </dc-new-entry>
        <dc-entry
          v-else
          :address="containerAddress"
          :entry="newEntry.entry"
          :entryName="newEntry.trimmed"
          :permissions="{ readWrite: [ newEntry.trimmed ]}"
          @init="$set(reactiveRefs, 'entryComp', $event)">
        </dc-entry>
      </div>
      <div class="footer">
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './new-set.ts';
  export default Component;
</script>
