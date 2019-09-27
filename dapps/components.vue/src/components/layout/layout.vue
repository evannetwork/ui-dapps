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
    <!-- settings section -->
    <div class="white-box border">
      <h2 class="header">Layout Components</h2>

      <div class="content">
        <h3>Open Swipe Panel</h3>
        <div class="row">
          <div class="col-6 text-left">
            <evan-button @click="$refs.swipePanelLeft.show()" icon="mdi mdi-arrow-right" />
            On the left side
          </div>
          <div class="col-6 text-right">
            On the right side
            <evan-button @click="$refs.swipePanelRight.show()" icon="mdi mdi-arrow-left" />
          </div>

          <evan-swipe-panel ref="swipePanelLeft" alignment="left" type="default" class="text-center">
            <p>click to close</p>
            <evan-button @click="$refs.swipePanelLeft.hide()" icon="mdi mdi-arrow-left" />
          </evan-swipe-panel>

          <evan-swipe-panel ref="swipePanelRight" alignment="right" type="default" class="light text-center">
            <p>click to close</p>
            <evan-button @click="$refs.swipePanelRight.hide()" icon="mdi mdi-arrow-right" />
          </evan-swipe-panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from "./layout";
  export default Component;
</script>
