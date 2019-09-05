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
  <div class="evan theme-evan">
    <evan-dapp-wrapper
      :routes="[ ]"
      :bottomRoutes="[ ]"
      createRuntime="false">
      <template v-slot:content>
        <evan-dapp-wrapper-level-2
          ref="level2Wrapper">
          <template v-slot:content>
            <div style="width: 300px">
              <div class="bg-level-1 border-bottom border-sm evan-triangle left">
                <div class="p-3">
                  <small class="text-muted text-uppercase font-weight-semibold">
                    {{ '_comp.components' | translate }}
                  </small>
                </div>
              </div>

              <div class="d-flex align-items-center px-3 py-2"
                style="height: 60px;"
                v-for="(comp, index) in components">
                <a class="d-flex align-items-center dark-link"
                  :href="`${ dapp.fullUrl }/${ comp.name }`"
                  :class="{ 'active': $route.path.endsWith(comp.name) }">
                  <i class="mdi text-muted mr-2"
                    :class="comp.icon"
                    style="font-size: 17px;">
                  </i>
                  <span class="m-0 font-weight-semibold">
                    {{ `_comp.${ comp.name }` | translate }}
                  </span>
                </a>
              </div>
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
  import Component from './root.ts';
  export default Component;
</script>

