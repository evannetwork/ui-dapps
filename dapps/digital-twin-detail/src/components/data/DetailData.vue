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
      <evan-nav-list
        :entries="navItems"
      />
    </div>

    <div class="evan-content-container">
      <router-view :key="$route.params.container" />
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
  width: 250px;
  background: white;
  border: 2px solid cssVar('bg-level-2');
  margin-left: 3px;
  height: calc(100vh - 128px);
  position: sticky;
  top: 0;
  margin: 32px 0 32px 8px;
  overflow-y: auto;

  .evan-nav-list {
    .nav-entries {
      a {
        font-weight: 600;
        font-size: 12px;
      }
    }
  }
}
</style>
