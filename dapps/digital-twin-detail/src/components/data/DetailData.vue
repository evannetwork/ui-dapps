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
  <div class="d-flex">
    <div class="sidenav">
      <!-- Not using nav-list because it doesnt support router-link properly
      TODO: Refactor evan-nav-list to use router-links too-->
      <div class="evan-nav-list">
        <div class="nav-entries">
          <template v-for="navItem in navItems">
            <router-link
              :id="navItem.id"
              :key="navItem.id"
              :to="navItem.to"
              active-class="active"
            >
              {{ navItem.label | translate }}
            </router-link>
          </template>
        </div>
      </div>
    </div>

    <div class="content">
      <router-view :key="$route.params.container"></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import DetailDataComponent from './DetailData';
export default DetailDataComponent;
</script>

<style lang="scss" scoped>
@import '~@evan.network/ui/src/style/utils';

.sidenav {
  width: 205px;
  background: white;
  border: 2px solid cssVar('bg-level-2');
  margin-left: 3px;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.content {
  margin-left: auto;
  margin-right: auto;
  padding-top: 56px;
}
</style>
