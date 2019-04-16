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
    <div class="p-1 p-md-4 text-left">
      <div class="bg-level-1 border">
        <div class="d-flex p-5 border-bottom border-sm align-items-center">
          <h3 class="m-0 font-weight-semibold">
            {{ `_digitaltwins.lookup.title` | translate }}
          </h3>
        </div>

        <div class="px-5 py-3">
          <p class="mb-4 text-justify">{{ `_digitaltwins.lookup.description` | translate }}</p>
          <dt-lookup-form
            @submit="openTwin">
          </dt-lookup-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './lookup.ts';
  export default Component;
</script>
