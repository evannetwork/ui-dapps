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
    <evan-breadcrumbs :i18nScope="'_digitaltwins.breadcrumbs'"></evan-breadcrumbs>
    <div class="p-1 p-md-4">
      <template class="bg-level-1 border mb-3"
        v-if="Object.keys(templates).length !== 0">
        <div class="d-md-flex flex-wrap justify-content-left">
          <a class="
              col-md-4 col-lg-3 col-xl-2
              p-0 m-md-3 mb-3 
              text-center
              bg-level-1 border evan-highlight"
            style="min-width: 250px"
            v-for="(templateKey, index) in Object.keys(templates)"
            :href="`${ dapp.fullUrl }/datacontainer.digitaltwin.${ dapp.domainName }/template/${ templateKey }`">
            <img class="img-fluid p-3"
              style="max-width: 200px; min-height: 200px;"
              :src="templates[templateKey].description.imgSquare">

            <div class="text-left border-top highlight">
              <small class="text-center p-1 d-block text-muted"
                v-if="templates[templateKey].creating">
                {{ '_digitaltwins.containers.in-creation' | translate }}
              </small>
              <div class="d-flex p-3">
                <div>
                  <h5 class="font-weight-bold">{{ templates[templateKey].description.name }}</h5>
                  <span class="overflow-multiline">{{ templates[templateKey].description.description }}</span>
                </div>
                <template v-if="templates[templateKey].loading">
                  <span class="mx-auto"></span>
                  <div class="spinner-border spinner-border-sm ml-3"></div>
                </template>
              </div>
            </div>
          </a>
        </div>
      </template>
      <div class="bg-level-1 border mb-3"
        v-else>
        <div class="d-flex p-5 border-bottom border-sm align-items-center">
          <h3 class="m-0 font-weight-semibold">
            {{ `_digitaltwins.templates.empty` | translate }}
          </h3>
        </div>
        <div class="px-5 py-3">
          <p class="text-justify">
            {{ `_digitaltwins.templates.empty-desc` | translate }}
          </p>

          <div class="text-center">
            <a
              class="btn btn-rounded btn-primary font-weight-normal m-3"
              :href="`${ dapp.fullUrl }/datacontainer.digitaltwin.${ dapp.domainName }/create-template`">
              {{ '_digitaltwins.templates.create' | translate }}
              <i class="mdi mdi-arrow-right label ml-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './templates.ts';
  export default Component;
</script>
