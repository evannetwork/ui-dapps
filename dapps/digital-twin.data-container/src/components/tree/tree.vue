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
  <div
    :style="!onlySets && isOpen ?
      'border-left: 4px solid var(--evan-secondary)' :
      'border-left: 4px solid transparent'"
    >
    <div class="d-flex align-items-center pl-6 pr-3 py-3"
      v-if="!onlySets"
      @contextmenu="">
      <a
        class="d-flex align-items-center dark-link"
        :class="{ 'active': `${ windowLocation }#${ $route.path }`.indexOf(dcUrl) !== -1 }"
        :href="creating ? null : dcUrl"
        @click="isOpen = true">
        <i
          class="mdi mdi-note-multiple-outline text-muted mr-2"
          style="font-size: 17px">
        </i>
        <span class="m-0 font-weight-semibold">{{ dbcp.name }}</span>
      </a>
      <span class="mx-auto"></span>
      <div class="position-relative d-flex align-items-center">
        <button class="btn mini border btn-circle border-secondary"
          @click="isOpen = !isOpen"
          v-if="!creating">
          <i class="text-secondary"
            :class="{
              'mdi mdi-chevron-up': isOpen,
              'mdi mdi-chevron-down': !isOpen,
            }">
          </i>
        </button>
        <div class="spinner-border spinner-border-sm text-secondary ml-3"
          v-if="loading">
        </div>
      </div>
    </div>

    <div class="pb-3"
      v-if="onlySets || isOpen">
      <div class="pl-8 pr-3 pb-1">
        <small class="text-muted text-uppercase font-weight-semibold">
          {{ '_datacontainer.entries' | translate }}
        </small>
      </div>
      <div class="d-flex align-items-center pl-8 pr-3 py-2"
        v-for="(entry, index) in Object.keys(dbcp.dataSchema)"
        v-if="entry !== 'type'"
        @contextmenu="">
        <a
          class="d-flex align-items-center dark-link"
          :class="{ 'active': `${ windowLocation }#${ $route.path }`.indexOf(`${ dcUrl }/data-set/${ entry }`) !== -1 }"
          :href="`${ dcUrl }/data-set/${ entry }`">
          <i
            class="mdi mdi-cube-outline text-muted mr-2"
            style="font-size: 17px">
          </i>
          <span class="m-0">{{ entry }}</span>
        </a>
        <span class="mx-auto"></span>
        <div class="position-relative d-flex align-items-center">
          
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './tree.ts';
  export default Component;
</script>
