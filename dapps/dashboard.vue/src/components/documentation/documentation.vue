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
  <div id="documentation" class="h-100">
    <evan-dapp-wrapper class="h-100">
      <template v-slot:content>
        <evan-dapp-wrapper-level-2>
          <template v-slot:content>
            <div class="w300">
              <div class="d-flex flex-wrap pl-4 pr-4 pt-4 pb-3 align-items-center ">
                <a :href="`${ dapp.fullUrl }`">
                  <h5 class="font-weight-semibold text-uppercase text-nowrap">{{ '_dashboard.documentation' | translate }}
                  </h5>
                </a>
              </div>

              <ul class="nav font-medium in w-100 mb-3 mt-auto">
                <li class="w-100 p-4 clickable d-flex"
                  :class="{ active: $route.path.endsWith('github') }"
                    @click="$router.push({ name: 'dashboard-docs-github' })">
                  <h6 class="mb-0">{{ '_dashboard.docs.github' | translate }}</h6>
                  <span class="mx-auto"></span>
                  <i class="mdi mdi-chevron-right"></i>
                </li>
                <li class="w-100 p-4 clickable d-flex"
                  :class="{ active: $route.path.endsWith(`documentation/bccdocs.${ domainName }`) }"
                  @click="evanNavigate(`documentation/bccdocs.${ domainName }`)">
                  <h6 class="mb-0">{{ '_dashboard.docs.bcc' | translate }}</h6>
                  <span class="mx-auto"></span>
                  <i class="mdi mdi-chevron-right"></i>
                </li>
                <li class="w-100 p-4 clickable d-flex"
                  :class="{ active: $route.path.endsWith(`documentation/uidocs.${ domainName }`) }"
                  @click="evanNavigate(`documentation/uidocs.${ domainName }`)">
                  <h6 class="mb-0">{{ '_dashboard.docs.ui' | translate }}</h6>
                  <span class="mx-auto"></span>
                  <i class="mdi mdi-chevron-right"></i>
                </li>
              </ul>
            </div>
          </template>
        </evan-dapp-wrapper-level-2>

        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
  import DocumentationComponent from './documentation.ts';
  export default DocumentationComponent;
</script>
