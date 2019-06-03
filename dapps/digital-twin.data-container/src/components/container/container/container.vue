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
    <div class="container-wide"
      v-else-if="error">
      <div class="white-box border-smooth rounded">
        <div class="header">
          <h3 class="m-0 font-weight-semibold">
            {{ '_datacontainer.no-permissions.title' | translate }}
          </h3>
        </div>
        <div class="content"
          v-html="$t('_datacontainer.no-permissions.desc')">
        </div>
      </div>
    </div>
    <template v-else>
      <evan-nav-tabs class="flex-shrink-0"
        :tabs="tabs">
      </evan-nav-tabs>
      <div class="container-wide overflow-y-auto">
        <div class="d-flex mb-5 align-items-center">
          <div class="flex-truncate" style="max-width: 50%;">
            <h3 class="font-weight-bold mb-0">
              {{ description.name }}
            </h3>
            <p class="text-muted font-weight-semibold mb-0">
              {{ description.description }}
            </p>
          </div>
          <span class="mx-auto"></span>
          <dc-actions
            :containerAddress="containerAddress"
            :digitalTwinAddress="digitalTwinAddress"
            :dcActions="true"
            :setActions="false">
          </dc-actions>
        </div>

        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './container.ts';
  export default Component;
</script>
