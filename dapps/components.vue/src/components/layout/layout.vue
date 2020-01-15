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

          <evan-swipe-panel
            ref="swipePanelLeft"
            alignment="left"
            type="default"
            class="text-center"
            mountId="dapp-wrapper-sidebar-left"
          >
            <p>click to close</p>
            <evan-button @click="$refs.swipePanelLeft.hide()" icon="mdi mdi-arrow-left" />
          </evan-swipe-panel>

          <evan-swipe-panel
            ref="swipePanelRight"
            alignment="right"
            type="default"
            class="text-center light"
            mountId="dapp-wrapper-sidebar-right"
          >
            <p>click to close</p>
            <evan-button @click="$refs.swipePanelRight.hide()" icon="mdi mdi-arrow-right" />
          </evan-swipe-panel>
        </div>

        <h3 class="mt-5">Modals</h3>
        <div class="row">
          <evan-button @click="$refs.customModal.show()" label="custom header, body and footer" />
          <evan-button @click="$refs.fullPageModal.show()" label="full page modal" />
          <evan-button @click="$refs.customFullPageModal.show()" label="custom content full page modal" />
        </div>

      </div>
    </div>

    <evan-modal
      ref="customModal"
      :maxWidth="'600px'"
    >
      <template v-slot:header>
        <h5 class="modal-title">Slot header</h5>
      </template>
      <template v-slot:body>Slot Body</template>
      <template v-slot:footer>Slot Footer</template>
    </evan-modal>

    <evan-modal
      ref="fullPageModal"
      :fullPage="true"
    >
      <template v-slot:header>
        <h5 class="modal-title">Slot header</h5>
      </template>
      <template v-slot:body>Slot Body</template>
      <template v-slot:footer>Slot Footer</template>
    </evan-modal>

    <evan-modal
      ref="customFullPageModal"
      :fullPage="true"
      :customModal="true"
    >
      <template v-slot:content>
        <h5>content header</h5>
        <p>
          Lorem ipsum dolor sot amet consecutor...
        </p>
      </template>
    </evan-modal>

  </div>
</template>

<script lang="ts">
  import Component from "./layout";
  export default Component;
</script>
