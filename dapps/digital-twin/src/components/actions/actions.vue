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
  <!-- pull it one em to the right, within the buttons view, the last button will have also a mr-3 -->
  <div
    :style="displayMode === 'buttons' ? 'margin-right: -1em' : ''">
    <!-- show dropdown button  -->
    <button class="btn btn-circle btn-sm btn-tertiary"
      v-if="displayMode === 'dropdownButton'"
      id="digitaltwin-context-menu-open"
      @click="$refs.dtContextMenu.show();">
      <i class="mdi mdi-dots-vertical clickable"></i>
    </button>

    <i class="mdi mdi-dots-vertical clickable"
      id="digitaltwin-context-menu-open"
      v-if="displayMode === 'dropdownIcon'"
      @click="$refs.dtContextMenu.show();">
    </i>

    <!-- show dropdown or only dropdown content -->
    <div class="position-relative">
      <evan-dropdown
        id="digitaltwin-context-menu"
        ref="dtContextMenu"
        :alignment="'right'"
        :class="{ 'd-flex align-items-center': displayMode === 'buttons' }"
        :width="'300px'"
        :renderOnlyContent="displayMode === 'buttons'">
        <template v-slot:content>
          <template v-if="dtActions">
            <button :class="buttonClasses.tertiar"
              id="dt-favorite-toggle"
              :disabled="uiDT.isFavoriteLoading"
              @click="toggleFavorite(); closeDropdown();">
              <div class="spinner-border spinner-border-sm"
                v-if="uiDT.isFavoriteLoading">
              </div>
              <i class="mdi mdi-star"
                :class="{ 'text-warning': uiDT.isFavorite }"
                v-else>
              </i>
              <component :is="buttonTextComp" :placement="'bottom'">
                <template v-if="uiDT.isFavorite">
                  {{ `_digitaltwins.detail.remove-favorite` | translate }}
                </template>
                <template v-else>
                  {{ `_digitaltwins.detail.add-favorite` | translate }}
                </template>
              </component>
            </button>
            <button :class="buttonClasses.tertiar"
              id="dt-map-ens"
              @click="reactiveRefs.dtEnsMap.$refs.mapEnsModal.show(); closeDropdown();">
              <i class="mdi mdi-link-variant"></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_digitaltwins.detail.map-to-ens` | translate }}
              </component>
            </button>
            <button :class="buttonClasses.tertiar"
              id="dt-edit"
              :disabled="uiDT.isSaving"
              @click="$refs.dbcpModal.show(); closeDropdown();">
              <div class="spinner-border spinner-border-sm"
                v-if="uiDT.isSaving">
              </div>
              <i class="mdi mdi-pencil"
                v-else>
              </i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_digitaltwins.detail.edit` | translate }}
              </component>
            </button>
          </template>
          <template v-if="containerActions">
            <button :class="buttonClasses.tertiar"
              id="dt-container-link"
              @click="reactiveRefs.dtContainerLink.$refs.containerLinkModal.show(); closeDropdown();">
              <i class="mdi mdi-application-import"></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_digitaltwins.containers.link` | translate }}
              </component>
            </button>
            <button
              id="dt-container-create"
              :class="buttonClasses.primary"
              @click="reactiveRefs.dtCreate.showModal(); closeDropdown();">
              <i class="mdi mdi-plus"></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_digitaltwins.containers.create` | translate }}
              </component>
            </button>
          </template>
        </template>
      </evan-dropdown>
    </div>
    <!-------------------------- actions section -------------------------->
    <evan-modal
      id="dt-dbcp-modal"
      ref="dbcpModal">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_datacontainer.edit-dbcp' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <dt-dbcp
          ref="dbcpForm"
          :dbcp="uiDT.dbcp"
          @init="$set(reactiveRefs, 'dbcpForm', $event)"
          @submit="saveDbcp($event)">
        </dt-dbcp>
      </template>
      <template v-slot:footer v-if="reactiveRefs.dbcpForm">
        <button type="submit"
          id="container-dbcp-save"
          class="btn btn-rounded btn-primary"
          @click="reactiveRefs.dbcpForm.save()"
          :disabled="!reactiveRefs.dbcpForm._form.isValid">
          {{ `_digitaltwins.detail.save` | translate }}
          <i class="mdi mdi-arrow-right label"></i>
        </button>
      </template>
    </evan-modal>
    <dc-create
      @init="$set(reactiveRefs, 'dtCreate', $event)">
    </dc-create>
    <dt-ens-map
      @init="$set(reactiveRefs, 'dtEnsMap', $event)">
    </dt-ens-map>
    <dc-link
      @init="$set(reactiveRefs, 'dtContainerLink', $event)">
    </dc-link>
  </div>
</template>

<script lang="ts">
  import Component from './actions.ts';
  export default Component;
</script>
