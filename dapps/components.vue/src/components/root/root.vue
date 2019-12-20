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
              <evan-nav-list
                :entries="navEntries">
                <template v-slot:header>
                  <h6 class="text-uppercase font-weight-semibold m-4">
                    {{ '_comp.components' | translate }}
                  </h6>
                </template>
              </evan-nav-list>
            </div>
          </template>
        </evan-dapp-wrapper-level-2>
        <transition name="fade" mode="out-in">
          <div class="container py-3">
            <h1 class="text-uppercase">{{ $route.name }}</h1>

            <router-view></router-view>
          </div>
        </transition>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
  import Component from './root';
  export default Component;
</script>
