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
    <evan-dapp-wrapper>
      <template v-slot:content>
        identities
<!--         <transition name="fade" mode="out-in">
          <router-view class="child-view"></router-view>
        </transition> -->
        <evan-dapp-wrapper-level-2>
          <template v-slot:content>
            dapp wrapper-sidebar-level-2 jeha!
          </template>
        </evan-dapp-wrapper-level-2>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
  import IdentitiesRootComponent from './root.ts';
  export default IdentitiesRootComponent;
</script>

<style lang="scss" scoped>
  @import './root';
</style>
