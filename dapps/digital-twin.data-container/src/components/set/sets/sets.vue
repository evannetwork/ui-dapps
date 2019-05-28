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
      <div class="content"
        v-html="$t('_datacontainer.no-permissions.desc')">
      </div>
    </div>
    <template v-else>
      <div class="white-box border-smooth rounded">
        <div class="header">
          <h3 class="font-weight-semibold m-0">
            <template>
              {{ `_digitaltwins.breadcrumbs.dc-sets` | translate }}
            </template>
          </h3>
          <span class="mx-auto"></span>
          <div>
            <dc-actions
              v-if="containerAddress.startsWith('0x')"
              :containerAddress="containerAddress"
              :digitalTwinAddress="uiContainer.digitalTwinAddress"
              :dcActions="false"
              :setActions="true">
            </dc-actions>

            <dc-plugin-actions
              v-else
              :pluginName="containerAddress"
              :pluginActions="false"
              :setActions="true"
              :displayMode="'buttons'">
            </dc-plugin-actions>
          </div>
        </div>
        <div class="content row pb-0" v-if="properties.length !== 0">
          <div class="col-md-4 mb-4"
            v-for="(property, index) in properties"
            style="min-width: 350px;">
            <a class="d-flex bg-level-1 border-smooth rounded evan-highlight flex-truncate"
              :id="`evan-dc-entry-${ property }`"
              :href="`${ dapp.fullUrl }/${ containerAddress }/data-set/${ property }`">
              <div class="row align-items-center m-0 w-100">
                <div class="col-2">
                  <img class="img-fluid p-3"
                    v-if="imgSquare"
                    :src="imgSquare">
                  <i
                    class="mdi mdi-cube-outline"
                    style="font-size:50px;">
                  </i>
                </div>
                <div class="col-10">
                  <div class="d-flex p-3 flex-truncate align-items-center">
                    <div>
                      <h4 class="font-weight-semibold mb-0">
                        {{ property }}
                      </h4>
                      <!-- <span class="text-justify d-block font-weight-semibold text-muted"
                        v-if="!creating">
                        {{ description }}
                      </span>
                      <span v-else>
                        {{ '_digitaltwins.containers.in-creation' | translate }}
                      </span> -->
                    </div>
                    <!-- <template v-if="container.loading">
                      <span class="mx-auto"></span>
                      <div class="spinner-border spinner-border-sm ml-3"></div>
                    </template> -->
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div class="content text-center" v-else>
          <h3 class="mt-4 font-weight-semibold">
            {{ '_datacontainer.no-entries.title' | translate }}
          </h3>
          <h5 class="font-weight-semibold text-muted">
            {{ '_datacontainer.no-entries.desc' | translate }}
          </h5>

          <button
            class="btn btn-rounded btn-outline-secondary mt-3"
            id="th-add-entry"
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
