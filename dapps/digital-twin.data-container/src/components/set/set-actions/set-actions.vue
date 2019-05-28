111§/*
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
  <!-- pull it one em to the right, within the buttons view, the last button will have also a mr-3 -->
  <div
    :style="displayMode === 'buttons' ? 'margin-right: -1em' : ''">
    <div class="spinner-border spinner-border-sm text-light ml-3"
      v-if="loading">
    </div>
    <template v-else-if="schemaActions && !saving && templateEntry.changed && !templateEntry.isNew">
      <!-- show dropdown button  -->
      <button class="btn btn-circle btn-sm btn-tertiary"
        v-if="displayMode === 'dropdownButton'"
        id="plugin-context-menu-open"
        @click="$refs.dtContextMenu.show();">
        <i class="mdi mdi-dots-vertical clickable"></i>
      </button>

      <i class="mdi mdi-dots-vertical clickable"
        id="plugin-context-menu-open"
        v-if="displayMode === 'dropdownIcon'"
        @click="$refs.dtContextMenu.show();">
      </i>

      <!-- show dropdown or only dropdown content -->
      <div class="position-relative">
        <evan-dropdown
          id="datacontainer-context-menu"
          ref="dtContextMenu"
          :alignment="'right'"
          :class="{ 'd-flex align-items-center': displayMode === 'buttons' }"
          :width="'300px'"
          :renderOnlyContent="displayMode === 'buttons'">
          <template v-slot:content>
            <template v-if="setActions"></template>
            <template v-if="schemaActions">
              <a
                id="dc-set-reset"
                v-if="!saving && templateEntry.changed && !templateEntry.isNew"
                :class="buttonClasses.secondary"
                @click="$refs.resetModal.show(); closeDropdown();">
                <i class="mdi mdi-file-undo"></i>
                <component :is="buttonTextComp" :placement="'bottom'">
                  {{ `_datacontainer.sets.reset.title` | translate }}
                </component>
              </a>
            </template>
          </template>
        </evan-dropdown>
      </div>
    <!-------------------------- actions section -------------------------->
    <evan-modal
      id="dc-set-reset-modal"
      ref="resetModal">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_datacontainer.sets.reset.title' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <div v-html="$t('_datacontainer.sets.reset.desc')"></div>
      </template>
      <template v-slot:footer>
        <button type="submit"
          id="dc-set-reset-submit"
          class="btn btn-rounded btn-danger"
          @click="resetEntry()">
          {{ `_datacontainer.sets.reset.title` | translate }}
          <i class="mdi mdi-arrow-right label ml-3"></i>
        </button>
      </template>
    </evan-modal>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './set-actions.ts';
  export default Component;
</script>
