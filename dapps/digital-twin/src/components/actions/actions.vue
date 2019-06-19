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
  <div
    :style="displayMode === 'buttons' ? 'margin-right: -1em' : ''">
    <!-- show dropdown button  -->
    <button class="btn btn-circle btn-sm btn-tertiary"
      v-if="displayMode === 'dropdownButton'"
      id="digitaltwin-context-menu-open"
      @click="showDropdown($event)">
      <i class="mdi mdi-dots-vertical clickable text-dark"></i>
    </button>

    <i class="mdi mdi-dots-vertical clickable text-dark"
      id="digitaltwin-context-menu-open"
      v-if="displayMode === 'dropdownIcon'"
      @click="showDropdown($event)">
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
          <div class="text-center p-3" v-if="loading">
            <div class="spinner-border spinner-border-sm text-light mr-3"></div>
          </div>
          <template v-else-if="selectedUiDT">
            <template v-if="dtActions">
              <button :class="buttonClasses.tertiar"
                id="dt-favorite-toggle"
                :disabled="selectedUiDT.isFavoriteLoading"
                @click="reactiveRefs.favoriteModal.show(); closeDropdown();">
                <div class="spinner-border spinner-border-sm"
                  v-if="selectedUiDT.isFavoriteLoading">
                </div>
                <i class="mdi mdi-star"
                  :class="{ 'text-warning': selectedUiDT.isFavorite }"
                  v-else>
                </i>
                <component :is="buttonTextComp" :placement="'bottom'">
                  <template v-if="selectedUiDT.isFavorite">
                    {{ `_digitaltwins.detail.remove-favorite` | translate }}
                  </template>
                  <template v-else>
                    {{ `_digitaltwins.detail.add-favorite` | translate }}
                  </template>
                </component>
              </button>
              <button :class="buttonClasses.tertiar"
                id="twin-share"
                v-if="displayMode !== 'buttons'"
                @click="evanNavigate(`digitaltwins.${ dapp.domainName }/digitaltwin.${ dapp.domainName }/${ selectedUiDT.address }/dt-detail/dt-permissions`, dapp.rootEns);">
                <i class="mdi mdi-share-variant" style="width: 16px;"></i>
                <component :is="buttonTextComp" :placement="'bottom'">
                  {{ `_datacontainer.context-menu.share` | translate }}
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
                v-if="selectedUiDT.isOwner"
                :disabled="selectedUiDT.isSaving"
                @click="reactiveRefs.dbcpModal.show(); closeDropdown();">
                <div class="spinner-border spinner-border-sm"
                  v-if="selectedUiDT.isSaving">
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
                v-if="selectedUiDT.isOwner"
                @click="reactiveRefs.dtContainerLink.$refs.containerLinkModal.show(); closeDropdown();">
                <i class="mdi mdi-application-import"></i>
                <component :is="buttonTextComp" :placement="'bottom'">
                  {{ `_digitaltwins.containers.link` | translate }}
                </component>
              </button>
              <button
                id="dt-container-create"
                v-if="selectedUiDT.isOwner"
                :class="buttonClasses.primary"
                @click="reactiveRefs.dcCreate.showModal(); closeDropdown();">
                <i class="mdi mdi-plus"></i>
                <component :is="buttonTextComp" :placement="'bottom'">
                  {{ `_digitaltwins.containers.create` | translate }}
                </component>
              </button>
            </template>
          </template>
        </template>
      </evan-dropdown>
    </div>
    <!-------------------------- actions section -------------------------->
    <template v-if="selectedUiDT && !loading">
      <evan-modal
        id="dt-favorite-modal"
        @init="$set(reactiveRefs, 'favoriteModal', $event)">
        <template v-slot:header>
          <h5 class="modal-title">
            {{ 
              (selectedUiDT.isFavorite ?
                '_digitaltwins.detail.remove-favorite' :
                '_digitaltwins.detail.add-favorite'
              ) | translate
            }}
          </h5>
        </template>
        <template v-slot:body>
          {{ 
            (selectedUiDT.isFavorite ?
              '_digitaltwins.detail.remove-favorite-quest' :
              '_digitaltwins.detail.add-favorite-quest'
            ) | translate
          }}
        </template>
        <template v-slot:footer>
          <button type="submit"
            id="container-toggle-favorite"
            class="btn btn-rounded btn-primary"
            @click="toggleFavorite();">
            {{ 
              (selectedUiDT.isFavorite ?
                '_digitaltwins.detail.remove-favorite' :
                '_digitaltwins.detail.add-favorite'
              ) | translate
            }}
            <i class="mdi mdi-arrow-right label"></i>
          </button>
        </template>
      </evan-modal>
      <evan-modal
        id="dt-dbcp-modal"
        @init="$set(reactiveRefs, 'dbcpModal', $event)">
        <template v-slot:header>
          <h5 class="modal-title">
            {{ '_datacontainer.edit-dbcp' | translate }}
          </h5>
        </template>
        <template v-slot:body>
          <dt-dbcp
            :dbcp="selectedUiDT.dbcp"
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
        :digitalTwinAddress="selectedUiDT.address"
        @init="$set(reactiveRefs, 'dcCreate', $event)">
      </dc-create>
      <dt-ens-map
        :digitalTwinAddress="selectedUiDT.address"
        @init="$set(reactiveRefs, 'dtEnsMap', $event)">
      </dt-ens-map>
      <dc-link
        :digitalTwinAddress="selectedUiDT.address"
        @init="$set(reactiveRefs, 'dtContainerLink', $event)">
      </dc-link>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './actions.ts';
  export default Component;
</script>
