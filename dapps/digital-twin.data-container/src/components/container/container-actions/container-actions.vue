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
    v-if="!loading"
    :style="displayMode === 'buttons' ? 'margin-right: -1em' : ''">
    <!-- show dropdown button  -->
    <button class="btn btn-circle btn-sm btn-tertiary"
      v-if="displayMode === 'dropdownButton'"
      id="datacontainer-context-menu-open"
      @click="$refs.dtContextMenu.show();">
      <i class="mdi mdi-dots-vertical clickable"></i>
    </button>

    <i class="mdi mdi-dots-vertical clickable"
      id="datacontainer-context-menu-open"
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
          <template v-if="dcActions">
            <button
              :class="buttonClasses.tertiar"
              v-if="isOwner"
              id="container-dbcp-edit"
              @click="$refs.dbcpModal.show(); closeDropdown();">
              <i class="mdi mdi-pencil" style="width: 16px;"></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_datacontainer.edit-dbcp` | translate }}
              </component>
            </button>
            <a :class="buttonClasses.tertiar"
              id="container-container-link"
              :href="`/${ dapp.rootEns }/digitaltwins.${ dapp.domainName }/digitaltwin.${ dapp.domainName }/containerlink/${ containerAddress }`"
              @click="closeDropdown();">
              <i class="mdi mdi-link-variant" style="width: 16px;"></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_datacontainer.context-menu.link` | translate }}
              </component>
            </a>
            <a :class="buttonClasses.tertiar"
              id="container-clone"
              :href="`create/${ containerAddress }`"
              @click="closeDropdown();">
              <i class="mdi mdi-content-copy" style="width: 16px;"></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_datacontainer.context-menu.clone` | translate }}
              </component>
            </a>
            <a :class="buttonClasses.tertiar"
              id="container-plugin-create"
              :href="`/${ dapp.rootEns }/digitaltwins.${ dapp.domainName }/datacontainer.digitaltwin.${ dapp.domainName }/plugin-create/${ containerAddress }`"
              @click="closeDropdown();">
              <i class="mdi mdi-content-duplicate" style="width: 16px;"></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_datacontainer.context-menu.plugin-save` | translate }}
              </component>
            </a>
          </template>
          <template v-if="setActions">
            <a
              id="dc-set-add"
              :class="buttonClasses.primary"
              @click="closeDropdown();">
              <i class="mdi mdi-plus"></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_digitaltwins.containers.create` | translate }}
              </component>
            </a>
          </template>
        </template>
      </evan-dropdown>
    </div>
    <!-------------------------- actions section -------------------------->
    <evan-modal
      id="container-dbcp-modal"
      ref="dbcpModal"
      @canceled="cancelDbcpModal">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_datacontainer.edit-dbcp' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <form v-on:submit.prevent="saveContainer(true)">
          <div class="form-group">
            <label for="name">
              {{ `_datacontainer.createForm.name.title` | translate }}
            </label>
            <input class="form-control" required
              id="name" ref="name"
              :placeholder="`_datacontainer.createForm.name.desc` | translate"
              v-model="dbcpForm.name.value"
              :class="{ 'is-invalid' : dbcpForm.name.error }"
              @blur="dbcpForm.name.setDirty()">
            <div class="invalid-feedback">
              {{ `_datacontainer.createForm.name.error` | translate }}
            </div>
          </div>
          <div class="form-group">
            <label for="description">
              {{ `_datacontainer.createForm.description.title` | translate }}
            </label>
            <textarea class="form-control" rows="7"
              id="description" ref="description"
              :placeholder="`_datacontainer.createForm.description.desc` | translate"
              v-model="dbcpForm.description.value"
              :class="{ 'is-invalid' : dbcpForm.description.error }"
              @blur="dbcpForm.description.setDirty()">
            </textarea>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <button type="submit"
          id="container-dbcp-save"
          @click="saveContainer(true)"
          class="btn btn-rounded btn-primary"
          :disabled="!dbcpForm.isValid">
          {{ `_datacontainer.createForm.save` | translate }}
          <i class="mdi mdi-arrow-right label"></i>
        </button>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './container-actions.ts';
  export default Component;
</script>
