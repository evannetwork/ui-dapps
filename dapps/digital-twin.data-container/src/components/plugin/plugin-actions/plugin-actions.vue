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
          <template v-if="pluginActions">
            <button :class="buttonClasses.tertiar"
              id="plugin-dbcp-edit"
              @click="$refs.dbcpModal.show(); closeDropdown();">
              <div class="spinner-border spinner-border-sm"
                v-if="saving">
              </div>
              <i class="mdi mdi-pencil" style="width: 16px;" v-else></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_datacontainer.plugin.edit-dbcp` | translate }}
              </component>
            </button>
            <button :class="buttonClasses.tertiar"
              id="plugin-share"
              @click="$refs.shareModal.show(); closeDropdown();">
              <div class="spinner-border spinner-border-sm" v-if="sharing"></div>
              <i class="mdi mdi-share-variant" style="width: 16px;" v-else></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_datacontainer.context-menu.share` | translate }}
              </component>
            </button>
<!--             <a :class="buttonClasses.tertiar"
              id="plugin-container-create"
              :href="`${ dapp.baseUrl }/${ dapp.rootEns }/digitaltwins.${ dapp.domainName }/datacontainer.digitaltwin.${ dapp.domainName }/dc-create/${ pluginName }`"
              @click="closeDropdown()">
              <i class="mdi mdi-content-copy" style="width: 16px;"></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_datacontainer.context-menu.create-container` | translate }}
              </component>
            </a> -->
            <a :class="buttonClasses.tertiar"
              id="plugin-clone"
              :href="`${ dapp.baseUrl }/${ dapp.rootEns }/digitaltwins.${ dapp.domainName }/datacontainer.digitaltwin.${ dapp.domainName }/plugin-create/${ pluginName }`"
              @click="closeDropdown()">
              <i class="mdi mdi-content-duplicate" style="width: 16px;"></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_datacontainer.context-menu.clone` | translate }}
              </component>
            </a>
          </template>
          <template v-if="setActions">
            <!-- :href="(`${ dapp.baseUrl }${ $route.fullPath }`).replace('dc-sets', 'dc-sets-add')" -->
            <a
              id="dc-container-add"
              :class="buttonClasses.primary"
              @click="$refs.dcNewEntry.showModal(); closeDropdown();">
              <i class="mdi mdi-plus"></i>
              <component :is="buttonTextComp" :placement="'bottom'">
                {{ `_digitaltwins.breadcrumbs.dc-sets-add` | translate }}
              </component>
            </a>
          </template>
        </template>
      </evan-dropdown>
    </div>
    <!-------------------------- actions section -------------------------->
    <evan-modal
      id="plugin-dbcp-modal"
      ref="dbcpModal">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_datacontainer.edit-dbcp' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <dt-dbcp
          ref="dbcpComp"
          :dbcp="description"
          :disabled="saving"
          @init="$set(reactiveRefs, 'dbcpForm', $event._form)"
          @submit="saveDbcp()">
        </dt-dbcp>
      </template>
      <template v-slot:footer>
        <button type="submit"
          id="plugin-dbcp-save"
          class="btn btn-rounded btn-primary"
          v-if="reactiveRefs.dbcpForm"
          :disabled="saving || !reactiveRefs.dbcpForm.isValid"
          @click="saveDbcp()">
          {{ `_datacontainer.save-dbcp` | translate }}
          <div class="spinner-border spinner-border-sm ml-3"
            v-if="saving">
          </div>
          <i class="mdi mdi-arrow-right label" v-else></i>
        </button>
      </template>
    </evan-modal>
    <evan-modal id="plugin-share-modal" ref="shareModal"
      v-if="contacts.length !== 0">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_datacontainer.share.title` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <p class="text-left m-0"
          v-html="$t(`_datacontainer.share.desc`, modalParams)">
        </p>

        <div class="form-group mt-3">
          <label for="name">
            {{ `_datacontainer.share.subject.title` | translate }}
          </label>
          <input class="form-control" required
            id="subject" ref="subject"
            :placeholder="`_datacontainer.share.subject.desc` | translate"
            v-model="shareForm.subject.value"
            :class="{ 'is-invalid' : shareForm.subject.error }"
            @blur="shareForm.subject.setDirty()">
          <div class="invalid-feedback">
            {{ `_datacontainer.share.subject.error` | translate }}
          </div>
        </div>

        <div class="form-group mt-3">
          <label for="shareUser">
            {{ `_datacontainer.share.user.title` | translate }}
          </label>
          <select class="form-control custom-select"
            id="shareUser" ref="shareUser"
            :placeholder="`_datacontainer.share.user.desc` | translate"
            v-model="shareAccount">
            <option
              v-for="(contact, index) in contacts"
              :value="contact.address">
              {{ contact.alias }} ({{ contact.address || contact.email }})
            </option>
          </select>
        </div>
      </template>
      <template v-slot:footer>
        <button
          id="plugin-share"
          type="button" class="btn btn-primary btn-rounded font-weight-normal"
          :disabled="!shareForm.isValid"
          @click="shareDt()">
          {{ `_datacontainer.share.action` | translate }}
          <i class="mdi mdi-arrow-right label"></i>
        </button>
      </template>
    </evan-modal>
    <evan-modal id="plugin-share-modal" ref="shareModal" v-else>
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_datacontainer.share.no-contacts.title` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <p class="text-left m-0"
          v-html="$t(`_datacontainer.share.no-contacts.desc`, modalParams)">
        </p>
      </template>
      <template v-slot:footer>
        <button
          id="plugin-go-addressbook"
          type="button" class="btn btn-primary btn-rounded font-weight-normal"
          @click="evanNavigate(`addressbook.${ dapp.domainName }`, `/${ dapp.rootEns }.${ dapp.domainName }`)">
          {{ `_datacontainer.share.no-contacts.open-contacts` | translate }}
          <i class="mdi mdi-arrow-right label"></i>
        </button>
      </template>
    </evan-modal>
    <dc-new-entry
      ref="dcNewEntry"
      :template="template"
      @submit="addNewEntry($event)">
    </dc-new-entry>
  </div>
</template>

<script lang="ts">
  import Component from './plugin-actions.ts';
  export default Component;
</script>
