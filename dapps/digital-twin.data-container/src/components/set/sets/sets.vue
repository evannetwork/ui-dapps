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
    <div class="white-box border-smooth rounded"
      v-else-if="error">
      <div class="header">
        <h3 class="m-0 font-weight-semibold">
          {{ '_datacontainer.no-permissions.title' | translate }}
        </h3>
      </div>
      <p class="content"
        v-html="$t('_datacontainer.no-permissions.desc')">
      </p>
    </div>
    <template v-else>
      <dc-set-actions
        :containerAddress="containerAddress"
        :entryName="property"
        :displayMode="'dropdownHidden'"
        :setActions="true"
        :schemaActions="true"
        :listActions="true"
        @init="$set(reactiveRefs.setActions, index, $event)">
      </dc-set-actions>
      <div class="content row pb-0" v-if="properties.length !== 0">
        <div class="col-xl-4 col-md-6 mb-4"
          v-for="(property, index) in properties">
          <a class="d-flex bg-level-1 border-smooth rounded evan-highlight w-100"
            :id="`evan-dc-entry-${ property }`"
            :href="`${ dapp.fullUrl }/${ containerAddress }/data-set/${ property }`">
            <div class="row align-items-center m-0 w-100">
              <div class="col-12 d-flex align-items-center">
                <div class="w-100 p-3 position-relative" style="height: 60px; max-width: calc(100% - 20px)">
                  <h4 class="font-weight-semibold mb-0 position-relative force-oneline">
                    {{ property }}
                  </h4>
                  <span class="notification-dot"
                    v-if="template.properties[property].changed || template.properties[property].isNew">
                  </span>
                </div>
                <span class="mx-auto"></span>
                <div class="spinner-border spinner-border-sm text-secondary"
                  v-if="reactiveRefs.setActions[index] && reactiveRefs.setActions[index].saving">
                </div>
                <i class="mdi mdi-dots-vertical clickable text-dark"
                  v-if="reactiveRefs.setActions[index] &&
                    reactiveRefs.setActions[index].areDropdownDotsVisible()"
                  @click="reactiveRefs.setActions[index].showDropdown($event)">
                </i>
              </div>
            </div>
          </a>
        </div>
      </div>
      <div class="white-box border-smooth rounded" v-else>
        <div class="content">
          <p class="text-justify m-0"
            v-html="$t(`_datacontainer.no-entries.title`)">
          </p>
          <p v-if="!containerAddress.startsWith('0x')"
            v-html="$t(`_datacontainer.no-entries.desc-perm`)">
          </p>
          <p v-else
            v-html="$t(`_datacontainer.no-entries.desc-noperm`)">
          </p>
          <button
            class="btn btn-outline-primary mt-3"
            id="th-add-entry"
            v-if="
              reactiveRefs.setActions && reactiveRefs.setActions.writeOperations &&
              !containerAddress.startsWith('0x')
            "
            @click="$refs.dcNewEntry.showModal();">
            {{ `_datacontainer.entry.add` | translate }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './sets.ts';
  export default Component;
</script>
