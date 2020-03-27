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
    <div
      class="callout"
      :class="{ active: show }"
    >
      <div style="width:100%; height:64px">
        <evan-profile-preview
          :address="$store.state.runtime.activeIdentity"
        />
      </div>

      <button
        class="toggle-button"
        @click="show = !show"
      >
        V
      </button>


      <button @click="$refs.logout.logout()">
        Logout
      </button>
    </div>

    <evan-logout ref="logout" />

    <b-overlay
      :show="show"
      blur="0"
      variant="dark"
      opacity="0.5"
      z-index="1000"
      no-center
      fixed
      no-wrap
      @click="show = false"
    >
      <template #overlay>
        <div
          class="close-overlay"
          @click="show = false"
        />
      </template>
    </b-overlay>
  </div>
</template>

<script lang="ts">
import Component from './UserCallout';

export default Component;
</script>

<style lang="scss" scoped>
.callout {
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: white;
  z-index: 1001;

  bottom: 0;
  left: 0;
  // border: 1px solid red;
  width: 250px;
  height: 300px;

  transform: translateY(239px);
  transition: transform 0.5s ease-in-out;

  &.active {
    transform: translateY(0);
  }
}

.close-overlay {
  width: 100vw;
  height: 100vh;
}

.toggle-button {
  position: absolute;
  right: 16px;
  top: 16px;
}

/deep/ .profile-picture {
  position: relative !important;
}

/deep/ .d-flex.flex-column.justify-content-center.ml-3.info {
  margin-left: 42px !important;
}
</style>
