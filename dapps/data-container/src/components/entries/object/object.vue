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
    <div class="d-flex p-3 align-items-center border-bottom">
      <h4 class="m-0" v-if="mode !== 'schema'">
        {{ '_datacontainer.types.object' | translate }}: {{ entryName }}
      </h4>
      <h4 class="m-0" v-else>
        {{ '_datacontainer.edit-schema' | translate }}
      </h4>

      <span class="mx-auto"></span>

      <div class="spinner-border spinner-border-sm text-light mr-3"
        v-if="$store.state.saving">
      </div>
      
      <template v-else>
        <button type="button" class="btn btn-outline-secondary btn-circle"
          v-if="mode !== 'schema'"
          @click="mode = 'schema'">
          <i class="fas fa-cogs"></i>
        </button>
        <button type="button" class="btn btn-primary btn-circle"
          v-else
          @click="mode = 'view'">
          <i class="fas fa-save"></i>
        </button>
      </template>
    </div>
    <div class="px-3 pb-3">
      <dt-ajv
        :enableValue="true"
        :mode="mode"
        :properties="entry.dataSchema.properties"
        :value="entry.value">
      </dt-ajv>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './object.ts';
  export default Component;
</script>
