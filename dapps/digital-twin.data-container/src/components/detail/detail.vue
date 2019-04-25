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
  <div>
    <evan-breadcrumbs 
      :i18nScope="'_datacontainer.breadcrumbs'">
    </evan-breadcrumbs>
    <div class="container-wide">
      <evan-modal ref="shareModal">
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
              v-bind:class="{ 'is-invalid' : shareForm.subject.error }"
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
              v-model="share.accountId">
              <option
                v-for="(contact, index) in contacts"
                :value="contact.address">
                {{ contact.alias }} ({{ contact.address || contact.email }})
              </option>
            </select>
          </div>

          <div class="table-responsive-md border-0 p-0 mt-3">
            <table class="w-100">
              <thead>
                <tr>
                  <th>{{ '_datacontainer.share.entry' | translate }}</th>
                  <th>{{ '_datacontainer.share.read' | translate }}</th>
                  <th>{{ '_datacontainer.share.read-write' | translate }}</th>
                  <th style="width: 50px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(property, index) in Object.keys(template.properties)">
                  <td class="py-2 pr-3">{{ property }}</td>
                  <td class="py-2 pl-2 pr-2">
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" class="custom-control-input"
                        :id="`read${ index }`" :name="`permission${ index }`"
                        :value="'read'"
                        v-model="share.permissions[property]">
                      <label class="custom-control-label" :for="`read${ index }`"></label>
                    </div>
                  </td>
                  <td class="py-2 pl-2 pr-2">
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" class="custom-control-input"
                        :id="`write${ index }`" :name="`permission${ index }`"
                        :value="'write'"
                        v-model="share.permissions[property]">
                      <label class="custom-control-label" :for="`write${ index }`"></label>
                    </div>
                  </td>
                  <td class="py-2 pr-3 text-center d-flex align-items-center" style="width: 50px;">
                    <button class="btn p-0" @click="$set(share.permissions, property, 'none')">
                      <i class="mdi mdi-close"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template v-slot:footer>
          <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
            :disabled="!shareForm.isValid || Object.keys(share.permissions)
              .filter(entry => share.permissions[entry] && share.permissions[entry] !== 'none')
              .length === 0"
            @click="shareDt()">
            {{ `_datacontainer.share.action` | translate }}
            <i class="mdi mdi-arrow-right label"></i>
          </button>
        </template>
      </evan-modal>

      <evan-loading v-if="loading"></evan-loading>
      <template v-else>
        <div class="d-flex mb-5 align-items-center">
          <div class="flex-truncate" style="max-width: 50%;">
            <h3 class="font-weight-bold mb-0">
              {{ dbcpForm.name.value }}
            </h3>
            <p class="text-muted font-weight-semibold mb-0">
              {{ dbcpForm.description.value }}
            </p>
          </div>
          <span class="mx-auto"></span>
          <div class="d-flex">
            <button class="btn"
              v-if="!$store.state.saving"
              @click="$refs.containerContextMenu.show();">
              <div class="spinner-border spinner-border-sm"
                v-if="$store.state.saving">
              </div>
              <i class="mdi mdi-chevron-down" v-else></i>
            </button>
            <div class="position-relative">
              <evan-dropdown ref="containerContextMenu"
                :alignment="'right'"
                :width="'300px'">
                <template v-slot:content>
                  <a class="dropdown-item pt-2 pb-2 pl-3 pr-3 clickable"
                    @click="
                      $refs.dbcpModal.show()
                      $refs.containerContextMenu.hide($event);
                    ">
                    <i class="mdi mdi-pencil mr-3" style="width: 16px;"></i>
                    {{ `_datacontainer.edit-dbcp` | translate }}
                  </a>
                  <a class="dropdown-item pt-2 pb-2 pl-3 pr-3 clickable"
                    @click="
                      $refs.shareModal.show()
                      $refs.containerContextMenu.hide($event);
                    ">
                    <i class="mdi mdi-share-variant mr-3" style="width: 16px;"></i>
                    {{ `_datacontainer.context-menu.share` | translate }}
                  </a>
                  <a class="dropdown-item pt-2 pb-2 pl-3 pr-3 clickable"
                    @click="
                      evanNavigate(`digitaltwins.${ dapp.domainName }/digitaltwin.${ dapp.domainName }/containerlink/${ $route.params.containerAddress }`, `/${ dapp.rootEns }`)
                      $refs.containerContextMenu.hide($event);
                    ">
                    <i class="mdi mdi-link-variant mr-3" style="width: 16px;"></i>
                    {{ `_datacontainer.context-menu.link` | translate }}
                  </a>
                  <a class="dropdown-item pt-2 pb-2 pl-3 pr-3 clickable"
                    @click="
                      evanNavigate(`create/${ $route.params.containerAddress }`)
                      $refs.containerContextMenu.hide($event);
                    ">
                    <i class="mdi mdi-content-copy mr-3" style="width: 16px;"></i>
                    {{ `_datacontainer.context-menu.clone` | translate }}
                  </a>
                  <a class="dropdown-item pt-2 pb-2 pl-3 pr-3 clickable"
                    @click="
                      evanNavigate(`digitaltwins.${ dapp.domainName }/datacontainer.digitaltwin.${ dapp.domainName }/create-template/${ $route.params.containerAddress }`, `/${ dapp.rootEns }`)
                      $refs.containerContextMenu.hide($event);
                    ">
                    <i class="mdi mdi-content-duplicate mr-3" style="width: 16px;"></i>
                    {{ `_datacontainer.context-menu.template-save` | translate }}
                  </a>
                </template>
              </evan-dropdown>
            </div>
            <button type="button" class="btn btn-primary btn-rounded"
              @click="saveContainer()"
              :disabled="!enableSave || $store.state.saving || !dbcpForm.isValid">
              {{ '_datacontainer.createForm.save' | translate }}
              <i class="mdi mdi-content-save label"></i>
            </button>
          </div>
        </div>
        <evan-modal ref="dbcpModal">
          <template v-slot:header>
            <h5 class="modal-title">
              {{ '_datacontainer.edit-dbcp' | translate }}
            </h5>
          </template>
          <template v-slot:body>
            <form v-on:submit.prevent="saveContainer">
              <div class="form-group">
                <label for="name">
                  {{ `_datacontainer.createForm.name.title` | translate }}
                </label>
                <input class="form-control" required
                  id="name" ref="name"
                  :placeholder="`_datacontainer.createForm.name.desc` | translate"
                  v-model="dbcpForm.name.value"
                  v-bind:class="{ 'is-invalid' : dbcpForm.name.error }"
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
                  v-bind:class="{ 'is-invalid' : dbcpForm.description.error }"
                  @blur="dbcpForm.description.setDirty()">
                </textarea>
              </div>
            </form>
          </template>
          <template v-slot:footer>
            <evan-loading v-if="$store.state.saving"></evan-loading>
            <button type="submit"
              v-else
              @click="saveContainer()"
              class="btn btn-rounded btn-primary"
              :disabled="!dbcpForm.isValid">
              {{ `_datacontainer.createForm.save` | translate }}
              <i class="mdi mdi-arrow-right label"></i>
            </button>
          </template>
        </evan-modal>

        <dt-template-handler
          :address="$route.params.containerAddress"
          :template.sync="template">
        </dt-template-handler>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './detail.ts';
  export default Component;
</script>
