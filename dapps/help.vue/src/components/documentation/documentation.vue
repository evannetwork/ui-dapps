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
  <div
    id="documentation"
    class="h-100"
  >
    <evan-dapp-wrapper class="h-100">
      <template v-slot:content>
        <evan-dapp-wrapper-level-2>
          <div style="width: 300px;">
            <evan-nav-list :entries="navEntries" />
          </div>
        </evan-dapp-wrapper-level-2>

        <transition
          name="fade"
          mode="out-in"
        >
          <router-view />
        </transition>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
import DocumentationComponent from './documentation';

export default DocumentationComponent;
</script>
