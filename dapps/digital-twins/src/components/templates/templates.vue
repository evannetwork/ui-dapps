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
      <div class="d-flex mb-3">
        <div>
          <h3 class="font-weight-bold mb-0">
            {{ '_digitaltwins.left-categories.my-templates.title' | translate }}
          </h3>
          <p class="text-muted font-weight-semibold m-t-0">
            {{ '_digitaltwins.left-categories.my-templates.desc' | translate }}
          </p>
        </div>
        <span class="mx-auto"></span>
        <div>
          <a
            id="dt-template-create"
            class="btn btn-rounded btn-primary font-weight-normal"
            :href="`${ dapp.fullUrl }/datacontainer.digitaltwin.${ dapp.domainName }/create-template`">
            {{ '_digitaltwins.templates.create' | translate }}
            <i class="mdi mdi-arrow-right label ml-2"></i>
          </a>
        </div>
      </div>

      <div class="white-box rounded border"
        v-if="Object.keys(templates).length !== 0">
        <div class="header">
          <div>
            <h3 class="font-weight-semibold m-0">
              {{ `_digitaltwins.left-categories.my-templates.title` | translate }}
            </h3>
          </div>
          <span class="mx-auto"></span>
          <div></div>
        </div>
        <div class="row content">
          <div class="col-md-6 col-lg-4 mb-4"
            v-for="(templateKey, index) in Object.keys(templates)">
            <a class="d-flex bg-level-1 border rounded evan-highlight flex-truncate"
              :id="`evan-dt-template-${ templateKey.replace('.', '') }`"
              :href="`${ dapp.fullUrl }/datacontainer.digitaltwin.${ dapp.domainName }/template/${ templateKey }`">
              <div class="row align-items-center m-0 w-100">
                <div class="col-2">
                  <img class="img-fluid p-3"
                    v-if="templates[templateKey].imgSquare"
                    :src="templates[templateKey].imgSquare">
                  <i
                    class="mdi mdi-circle-edit-outline"
                    style="font-size:60px;">
                  </i>
                </div>
                <div class="col-10">
                  <small class="text-center p-1 d-block text-muted"
                    v-if="templates[templateKey].creating">
                    {{ '_digitaltwins.containers.in-creation' | translate }}
                  </small>
                  <div class="d-flex p-3 flex-truncate">
                    <div>
                      <h4 class="font-weight-semibold mb-0">
                        {{ templates[templateKey].description.name }}
                      </h4>
                      <span class="text-justify d-block font-weight-semibold text-muted">
                        {{ templates[templateKey].description.description }}
                      </span>
                    </div>
                    <template v-if="templates[templateKey].loading">
                      <span class="mx-auto"></span>
                      <div class="spinner-border spinner-border-sm ml-3"></div>
                    </template>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div class="white-box rounded border"
        v-else>
        <div class="header">
          <h4 class="m-0">
            {{ `_digitaltwins.templates.empty` | translate }}
          </h4>
        </div>
        <div class="content">
          <p class="m-0"
            v-html="$t( `_digitaltwins.templates.empty-desc`)">
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './templates.ts';
  export default Component;
</script>
