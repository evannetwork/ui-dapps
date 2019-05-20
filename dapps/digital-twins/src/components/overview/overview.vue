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
            {{ '_digitaltwins.digitaltwins.title' | translate }}
          </h3>
          <p class="text-muted font-weight-semibold m-0">
            {{ '_digitaltwins.digitaltwins.desc' | translate }}
          </p>
        </div>
        <span class="mx-auto"></span>
        <div>
          <a
            id="dt-open"
            class="btn btn-circle btn-sm btn-tertiary mr-3"
            :href="`${ dapp.fullUrl }/open`">
            <i class="mdi mdi-magnify"></i>

            <evan-tooltip :placement="'bottom'">
              {{ '_digitaltwins.digitaltwins.open' | translate }}
            </evan-tooltip>
          </a>
          <a
            id="dt-create"
            class="btn btn-rounded btn-primary"
            :href="`${ dapp.fullUrl }/digitaltwin.${ dapp.domainName }/dt-create`">
            <span>{{ '_digitaltwins.digitaltwins.create' | translate }}</span>
            <i class="mdi mdi-arrow-right label ml-3"></i>
          </a>
        </div>
      </div>

      <div class="white-box border rounded mt-3"
        v-if="twins.length !== 0">
        <div class="header border-0">
          <div>
            <h3 class="font-weight-semibold m-0">
              {{ `_digitaltwins.digitaltwins.title` | translate }}
            </h3>
          </div>
          <span class="mx-auto"></span>
          <div></div>
        </div>
        <div class="row content pt-1 pb-0"
          :id="`evan-dt-twins`">
          <div class="col-md-6 col-lg-3 mb-4"
            v-for="(ensAddress, index) in twins">
            <a class="d-flex bg-level-1 border rounded evan-highlight flex-truncate"
              :id="`evan-dt-${ ensAddress.replace('.', '') }`"
              :href="descriptions[ensAddress].creating ?
                null :
                `${ dapp.fullUrl }/digitaltwin.${ dapp.domainName }/${ ensAddress }/containers`
              ">
              <div class="row align-items-center m-0 w-100">
                <div class="col-2">
                  <img class="img-fluid p-3"
                    v-if="descriptions[ensAddress].imgSquare"
                    :src="descriptions[ensAddress].imgSquare">
                  <i
                    class="mdi mdi-fingerprint"
                    style="font-size:60px;">
                  </i>
                </div>
                <div class="col-10">
                  <div class="d-flex p-3 flex-truncate align-items-center">
                    <div>
                      <h4 class="font-weight-semibold mb-0">
                        {{ descriptions[ensAddress].name }}
                      </h4>
                      <span class="text-justify d-block font-weight-semibold text-muted">
                        <template v-if="descriptions[ensAddress].creating">
                          {{ '_digitaltwins.digitaltwins.in-creation' | translate }}
                        </template>
                        <template v-else>
                          {{ descriptions[ensAddress].description }}
                        </template>
                      </span>
                    </div>
                    <template v-if="descriptions[ensAddress].loading">
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
      <div class="white-box border rounded mt-3 "
        v-else>
        <div class="header">
          <h4 class="m-0">
            {{ `_digitaltwins.digitaltwins.empty` | translate }}
          </h4>
        </div>
        <div class="content">
          <p class="m-0"
            v-html="$t('_digitaltwins.digitaltwins.empty-desc')">
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './overview.ts';
  export default Component;
</script>
