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
  <div>
    <h1>{{ '_twin-detail.data.data-title' | translate }}</h1>
    <div class="sidenav">
      <!-- Not using nav-list because it doesnt support router-link properly
      TODO: Refactor evan-nav-list to use router-links too -->
      <div class="evan-nav-list">
        <div class="nav-entries">
          <template v-for="navItem in navItems">
            <router-link
              :id="navItem.id"
              :key="navItem.id"
              :to="navItem.to"
              :active-class="'active'"
            >
              <i class="mr-3" :class="navItem.icon"></i>
              {{ navItem.label | translate }}
            </router-link>
          </template>
        </div>
      </div>
    </div>
    <router-view></router-view>

  </div>
</template>

<script lang="ts">
import DetailDataComponent from './DetailData';
export default DetailDataComponent;
</script>

<style lang="scss" scoped>
@import "DetailData.scss";
</style>
