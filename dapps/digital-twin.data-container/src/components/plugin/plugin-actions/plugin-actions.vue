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
    <button class="btn btn-icon"
      v-if="displayMode === 'dropdownButton'"
      id="plugin-context-menu-open"
      @click="showDropdown($event)">
      <i class="mdi mdi-dots-vertical clickable text-dark"></i>
    </button>

    <i class="mdi mdi-dots-vertical clickable text-dark"
      id="plugin-context-menu-open"
      v-if="displayMode === 'dropdownIcon'"
      @click="showDropdown($event)">
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
          <div class="text-center p-3" v-if="loading">
            <div class="spinner-border spinner-border-sm text-light mr-3"></div>
          </div>
          <template v-else-if="plugin">
            <template v-if="pluginActions">
              <button :class="buttonClasses.tertiar"
                id="plugin-dbcp-edit"
                @click="reactiveRefs.dbcpModal.show(); closeDropdown();">
                <div class="spinner-border spinner-border-sm" v-if="saving"></div>
                <i class="mdi mdi-pencil" style="width: 16px;" v-else></i>
                <component :is="buttonTextComp" :placement="'bottom'">
                  {{ `_datacontainer.plugin.edit-dbcp` | translate }}
                </component>
              </button>
              <button :class="buttonClasses.tertiar"
                id="plugin-share"
                :disabled="sharing"
                @click="reactiveRefs.shareModal.show(); closeDropdown();">
                <div class="spinner-border spinner-border-sm" v-if="sharing"></div>
                <i class="mdi mdi-share-variant" style="width: 16px;" v-else></i>
                <component :is="buttonTextComp" :placement="'bottom'">
                  {{ `_datacontainer.context-menu.share` | translate }}
                </component>
              </button>
              <button :class="buttonClasses.tertiar"
                id="plugin-export"
                @click="exportPlugin(); closeDropdown()">
                <i class="mdi mdi-download" style="width: 16px;"></i>
                <component :is="buttonTextComp" :placement="'bottom'">
                  {{ `_datacontainer.context-menu.export` | translate }}
                </component>
              </button>
              <button :class="buttonClasses.tertiar"
                id="plugin-clone"
                @click="reactiveRefs.clonePlugin.showModal(); closeDropdown()">
                <i class="mdi mdi-content-duplicate" style="width: 16px;"></i>
                <component :is="buttonTextComp" :placement="'bottom'">
                  {{ `_datacontainer.context-menu.clone` | translate }}
                </component>
              </button>
              <button :class="buttonClasses.tertiar"
                id="plugin-delete-open"
                :disabled="deleting"
                @click="reactiveRefs.deleteModal.show(); closeDropdown()">
                <div class="spinner-border spinner-border-sm" v-if="deleting"></div>
                <i class="mdi mdi-delete" style="width: 16px;" v-else></i>
                <component :is="buttonTextComp" :placement="'bottom'">
                  {{ `_datacontainer.plugin.delete` | translate }}
                </component>
              </button>
            </template>
            <template v-if="setActions">
              <a
                id="dc-container-add"
                :class="buttonClasses.primary"
                @click="reactiveRefs.dcNewEntry.showModal(); closeDropdown();">
                <i class="mdi mdi-plus"></i>
                <component :is="buttonTextComp" :placement="'bottom'">
                  {{ `_digitaltwins.breadcrumbs.dc-sets-add` | translate }}
                </component>
              </a>
            </template>
          </template>
        </template>
      </evan-dropdown>
    </div>
    <!-------------------------- actions section -------------------------->
    <template v-if="plugin && !loading">
      <evan-modal
        id="plugin-dbcp-modal"
        @init="$set(reactiveRefs, 'dbcpModal', $event)">
        <template v-slot:header>
          <h5 class="modal-title">
            {{ '_datacontainer.edit-dbcp' | translate }}
          </h5>
        </template>
        <template v-slot:body>
          <dt-dbcp
            :dbcp="description"
            :disabled="saving"
            @init="$set(reactiveRefs, 'dbcpForm', $event._form)"
            @submit="saveDbcp()">
          </dt-dbcp>
        </template>
        <template v-slot:footer>
          <button type="submit"
            id="plugin-dbcp-save"
            class="btn  btn-primary"
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
      <evan-modal
        id="plugin-share-modal"
        @init="$set(reactiveRefs, 'shareModal', $event)"
        v-if="contacts.length !== 0">
        <template v-slot:header>
          <h5 class="modal-title">
            {{ `_datacontainer.share.action` | translate }}
          </h5>
        </template>
        <template v-slot:body>
          <p class="text-left m-0"
            v-html="$t(`_datacontainer.share.desc`, modalParams)">
          </p>

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

          <p class="text-left mt-3"
            v-html="$t(`_datacontainer.plugin.bmail-desc`, modalParams)">
          </p>

          <div class="form-group mt-3">
            <label for="name">
              {{ `_datacontainer.share.title.title` | translate }}
            </label>
            <input class="form-control" required
              id="title" ref="title"
              :placeholder="`_datacontainer.share.title.desc` | translate"
              v-model="shareForm.title.value"
              :class="{ 'is-invalid' : shareForm.title.error }"
              @blur="shareForm.title.setDirty()">
            <div class="invalid-feedback">
              {{ `_datacontainer.share.title.error` | translate }}
            </div>
          </div>

          <div class="form-group">
            <label for="name">
              {{ `_datacontainer.share.body.title` | translate }}
            </label>
            <textarea class="form-control" required
              rows="10"
              id="body" ref="body"
              :placeholder="`_datacontainer.share.body.desc` | translate"
              v-model="shareForm.body.value"
              :class="{ 'is-invalid' : shareForm.body.error }"
              @blur="shareForm.body.setDirty()">
            </textarea>
            <div class="invalid-feedback">
              {{ `_datacontainer.share.body.error` | translate }}
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <button
            id="plugin-share"
            type="button" class="btn btn-primary font-weight-normal"
            :disabled="!shareForm.isValid"
            @click="shareDt()">
            {{ `_datacontainer.share.action` | translate }}
            <i class="mdi mdi-arrow-right label"></i>
          </button>
        </template>
      </evan-modal>
      <evan-modal
        id="plugin-share-modal" 
        v-else
        @init="$set(reactiveRefs, 'shareModal', $event)">
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
            type="button" class="btn btn-primary font-weight-normal"
            @click="evanNavigate(`addressbook.${ dapp.domainName }`, `/${ dapp.rootEns }.${ dapp.domainName }`)">
            {{ `_datacontainer.share.no-contacts.open-contacts` | translate }}
            <i class="mdi mdi-arrow-right label"></i>
          </button>
        </template>
      </evan-modal>
      <evan-modal
        id="plugin-delete-modal"
        @init="$set(reactiveRefs, 'deleteModal', $event)">
        <template v-slot:header>
          <h5 class="modal-title">
            {{ '_datacontainer.plugin.delete' | translate }}
          </h5>
        </template>
        <template v-slot:body>
          {{ '_datacontainer.plugin.delete-quest' | translate }}
        </template>
        <template v-slot:footer>
          <button type="submit"
            id="plugin-delete"
            class="btn  btn-primary"
            @click="deletePlugin()">
            {{ '_datacontainer.plugin.delete' | translate }}
            <i class="mdi mdi-arrow-right label"></i>
          </button>
        </template>
      </evan-modal>
      <dc-new-entry
        :template="plugin.template"
        @submit="addNewEntry($event)"
        @init="$set(reactiveRefs, 'dcNewEntry', $event)">
      </dc-new-entry>
      <dc-create
        :mode="'plugin'"
        :cloneAddress="pluginName"
        @init="$set(reactiveRefs, 'clonePlugin', $event)">
      </dc-create>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './plugin-actions.ts';
  export default Component;
</script>
