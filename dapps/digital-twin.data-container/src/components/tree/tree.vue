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
    class="border-bottom border-sm"
    :style="!onlySets && isOpen ?
      'border-left: 4px solid var(--evan-primary)' :
      'border-left: 4px solid transparent'"
    >
    <div class="d-flex align-items-center pl-3 pr-3 py-3"
      style="height: 60px;"
      v-if="!onlySets">
      <button class="btn btn-icon btn-sm mr-3"
        @click="isOpen = !isOpen"
        v-if="!creating">
        <i
          :class="{
            'mdi mdi-chevron-up': isOpen,
            'mdi mdi-chevron-down': !isOpen,
          }">
        </i>
      </button>
      <a
        class="d-flex align-items-center dark-link"
        :class="{ 'active': `${ windowLocation }#${ $route.path }`.indexOf(dcUrl) !== -1 }"
        :href="creating ? null : dcUrl"
        @click="isOpen = true; hideSidebar2();">
        <i
          class="mdi mdi-note-multiple-outline text-muted mr-2"
          style="font-size: 17px">
        </i>
        <span class="m-0 font-weight-semibold">
          <template v-if="description">
            {{ description.name }}
          </template>
          <template v-else-if="plugin && plugin.description">
            {{ plugin.description.name }}
          </template>
        </span>
      </a>
      <span class="mx-auto"></span>
      <div class="position-relative d-flex align-items-center">
        <div class="spinner-border spinner-border-sm text-primary ml-3"
          v-if="loading || initializing">
        </div>
        <dc-actions
          ref="dcActions"
          v-if="containerAddress"
          :containerAddress="containerAddress"
          :digitalTwinAddress="digitalTwinAddress"
          :displayMode="'dropdownIcon'"
          :dcActions="true"
          :setActions="true">
        </dc-actions>
      </div>
    </div>

    <div class="text-center p-3"
        v-if="onlySets && (loading || initializing)">
      <div class="spinner-border spinner-border-sm text-primary"></div>
    </div>
    <div class="pb-3"
      v-if="!initializing && (onlySets || isOpen)">
      <p class="text-center p-3 mb-0" v-if="error"
        v-html="$t('_datacontainer.no-permissions.desc')">
      </p>
      <template v-if="containerAddress && plugin && plugin.template">
        <div class="px-4 py-1"
          v-if="Object.keys(plugin.template.properties).length === 0">
          <template v-if="!containerAddress.startsWith('0x')">
            <dc-actions
              ref="emptyActions"
              v-if="containerAddress.startsWith('0x')"
              :containerAddress="containerAddress"
              :digitalTwinAddress="digitalTwinAddress"
              :displayMode="'dropdownHidden'"
              :dcActions="true"
              :setActions="true"
              @init="$set(reactiveRefs, 'emptyActions', $event)">
            </dc-actions>
            <dc-plugin-actions
              v-else
              ref="emptyActions"
              :pluginName="containerAddress"
              :pluginActions="true"
              :setActions="true"
              :displayMode="'dropdownHidden'"
              @init="$set(reactiveRefs, 'emptyActions', $event)">
            </dc-plugin-actions>
            <template v-else>
              <button class="btn btn-link dark-link d-flex align-items-center"
                v-if="reactiveRefs.emptyActions.writeOperations"
                @click="
                  reactiveRefs.emptyActions.$refs.dcNewEntry.showModal();
                  reactiveRefs.emptyActions.closeDropdown();
                ">
                <button class="btn btn-icon btn-sm border-primary mr-3">
                  <i class="mdi mdi-plus text-primary"></i>
                </button>
                {{ '_digitaltwins.breadcrumbs.dc-sets-add' | translate }}
              </button>
            </template>
          </template>
          <span v-else>
            {{ '_datacontainer.no-entries.short' | translate }}
          </span>
        </div>
        <template v-else>
          <div class="d-flex align-items-center pl-8 pr-3 py-2"
            style="height: 40px;"
            v-for="(entry, index) in Object.keys(plugin.template.properties)"
            v-if="entry !== 'type'">
            <a
              class="d-flex align-items-center dark-link"
              :class="{ 'active': `${ windowLocation }#${ decodeURIComponent($route.path) }`.indexOf(`${ dcUrl }/data-set/${ entry }/`) !== -1 }"
              :href="`${ dcUrl }/data-set/${ entry }`"
              @click="hideSidebar2();">
              <span class="position-relative">
                <i
                  class="mdi mdi-cube-outline text-muted mr-2"
                  style="font-size: 17px">
                </i>
                <span class="m-0">{{ entry }}</span>
                <span class="notification-dot"
                  v-if="plugin.template.properties[entry].changed ||
                    plugin.template.properties[entry].isNew">
                </span>
              </span>
            </a>
            <span class="mx-auto"></span>
            <div class="position-relative d-flex align-items-center">
              <div class="spinner-border spinner-border-sm text-primary"
                v-if="reactiveRefs.setActions[index] && reactiveRefs.setActions[index].saving">
              </div>
              <dc-set-actions
                :containerAddress="containerAddress"
                :entryName="entry"
                :displayMode="'dropdownIcon'"
                :setActions="true"
                :schemaActions="true"
                :listActions="true"
                @init="$set(reactiveRefs.setActions, index, $event)">
              </dc-set-actions>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './tree.ts';
  export default Component;
</script>
