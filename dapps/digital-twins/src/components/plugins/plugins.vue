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
    <div class="container-wide" v-if="!loading">
      <div class="d-flex align-items-center mb-5">
        <div>
          <h3 class="font-weight-bold mb-0">
            {{ '_digitaltwins.plugins.title' | translate }}
          </h3>
          <p class="text-muted font-weight-semibold m-0">
            {{ '_digitaltwins.plugins.desc' | translate }}
          </p>
        </div>
        <span class="mx-auto"></span>
        <div>
          <dc-create
            :mode="'plugin'"
            @init="$set(reactiveRefs, 'dtCreate', $event)">
          </dc-create>
          <button
            id="dt-plugin-create"
            class="btn btn-rounded btn-primary font-weight-normal"
            @click="reactiveRefs.dtCreate.showModal()">
            {{ '_digitaltwins.plugins.create' | translate }}
            <i class="mdi mdi-arrow-right label ml-2"></i>
          </button>
        </div>
      </div>

      <!-- class="white-box border-smooth rounded mt-3" -->
      <div v-if="Object.keys(plugins).length !== 0">
        <div class="row content pt-1 pb-0"
          :id="`evan-dt-plugins`">
          <div class="col-md-6 col-lg-3 mb-4"
            v-for="(pluginKey, index) in Object.keys(plugins)">
            <a class="d-flex bg-level-1 border-smooth rounded evan-highlight w-100"
              :id="`evan-dt-plugin-${ pluginKey.replace('.', '') }`"
              :href="plugins[pluginKey].creating ? null : `${ dapp.fullUrl }/datacontainer.digitaltwin.${ dapp.domainName }/${ pluginKey }`">
              <div class="row align-items-center m-0 w-100">
                <div class="col-2" style="overflow: visible">
                  <img class="img-fluid p-3"
                    v-if="plugins[pluginKey].imgSquare"
                    :src="plugins[pluginKey].imgSquare">
                  <i
                    class="mdi mdi-circle-edit-outline text-muted"
                    style="font-size:50px;">
                  </i>
                </div>
                <div class="col-10 d-flex align-items-center">
                  <div class="w-100 p-3">
                    <h4 class="font-weight-semibold mb-0 overflow-multiline line-1">
                      {{ plugins[pluginKey].description.name }}
                    </h4>
                    <span class="text-justify d-block font-weight-semibold text-muted overflow-multiline line-3">
                      <template v-if="plugins[pluginKey].creating">
                        {{ '_digitaltwins.plugins.in-creation' | translate }}
                      </template>
                      <template v-else>
                        {{ plugins[pluginKey].description.description }}
                      </template>
                    </span>
                  </div>
                  <span class="mx-auto"></span>
                  <div class="spinner-border spinner-border-sm ml-3"
                    v-if="plugins[pluginKey].loading">
                  </div>
                  <i class="mdi mdi-dots-vertical clickable text-dark"
                    v-else
                    @click="$refs.dcPluginActions[index].showDropdown($event)">
                  </i>
                </div>
              </div>
            </a>
            <dc-plugin-actions
              v-if="!plugins[pluginKey].loading"
              ref="dcPluginActions"
              :pluginName="pluginKey"
              :pluginActions="true"
              :setActions="true"
              :displayMode="'dropdownHidden'">
            </dc-plugin-actions>
          </div>
        </div>
      </div>
      <div class="white-box border-smooth rounded mt-3"
        v-else>
        <div class="content">
          <p class="m-0"
            v-html="$t( `_digitaltwins.plugins.empty-desc`)">
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './plugins.ts';
  export default Component;
</script>
