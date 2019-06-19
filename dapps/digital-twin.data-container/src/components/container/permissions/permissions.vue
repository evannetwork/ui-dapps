
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
  <div class="position-relative">
    <evan-loading v-if="loading"></evan-loading>
    <div v-else>
      <div class="white-box border-smooth rounded" v-if="properties.length === 0">
        <div class="content">
          <p class="text-justify m-0"
            v-html="$t(`_datacontainer.no-entries.title`)">
          </p>
          <p v-html="$t(`_datacontainer.no-entries.desc-perm`)"></p>
        </div>
      </div>
      <template v-else>
        <div class="table-scroll-container">
          <table id="ajv-table" class="evan-table no-wrap static-first w-100">
            <thead>
              <tr class="text-muted">
                <th class="d-flex align-items-center"
                  style="height: 69px;">
                  {{ '_datacontainer.share.user.title' | translate }}
                </th>
                <th
                  class="text-center"
                  v-for="(property, index) in properties"
                  v-if="!dataSetName || dataSetName === property">
                  {{ property }}

                  <div class="d-flex justify-content-center">
                    <span class="text-muted small pt-1 pr-1">
                      {{ '_datacontainer.share.read' | translate }}
                    </span>
                    <span class="text-muted small pt-1 pl-1">
                      {{ '_datacontainer.share.write' | translate }}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(accountId, index) in Object.keys(permissionMap)">
                <td>
                  {{ contacts[accountId] ?
                      contacts[accountId].alias :
                      accountId }}
                  <evan-tooltip :placement="'right'">
                    {{ accountId }}
                  </evan-tooltip>
                </td>
                <td
                  v-for="(property, index) in properties"
                  v-if="!dataSetName || dataSetName === property">
                  <div class="d-flex justify-content-center pl-3">
                    <input class="form-check-input mt-0 mr-2 position-relative" type="checkbox"
                      :id="`permission-read-${ accountId }`"
                      :disabled="
                        sharing ||
                        !isOwner ||
                        originPermissionMap[accountId][property].read
                      "
                      v-model="permissionMap[accountId][property].read"
                      @change="checkPermissionChanged(accountId, property, false)">
                    <input class="form-check-input mt-0 ml-2 position-relative" type="checkbox"
                      :id="`permission-write-${ accountId }`"
                      :disabled="
                        sharing ||
                        !isOwner ||
                        originPermissionMap[accountId][property].readWrite
                      "
                      v-model="permissionMap[accountId][property].readWrite"
                      @change="checkPermissionChanged(accountId, property, true)">
                  </div>
                </td>
              </tr>
              <tr v-if="isOwner">
                <td style="height: 70px">
                  <button class="btn btn-primary btn-sm btn-circle"
                    @click="$refs.addUserModal.show();">
                    <i class="mdi mdi-plus" style="width: 16px;"></i>
                  </button>
                </td>
                <td style="height: 70px"
                  v-for="(property, index) in properties"
                  v-if="!dataSetName || dataSetName === property">
                  <!-- empty -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="w-100 text-right mt-3"
          v-if="isOwner">
          <button class="btn btn-primary btn-rounded font-weight-normal mt-3"
            :disabled="!permissionChanged || sharing"
            @click="$refs.shareModal.show()">
            {{ `_datacontainer.share.share` | translate }}
            <div class="spinner-border spinner-border-sm ml-3" v-if="sharing"></div>
            <i class="mdi mdi-arrow-right label ml-3" v-else></i>
          </button>
        </div>

        <evan-modal
          id="container-share-add-user"
          ref="addUserModal"
          v-if="Object.keys(addableContacts).length !== 0">
          <template v-slot:header>
            <h5 class="modal-title">
              {{ `_datacontainer.share.add-user` | translate }}
            </h5>
          </template>
          <template v-slot:body>
            <p class="text-left m-0"
              v-html="$t(`_datacontainer.share.add-user-desc`, modalParams)">
            </p>

            <div class="form-group mt-3">
              <label for="shareUser">
                {{ `_datacontainer.share.user.title` | translate }}
              </label>
              <select class="form-control custom-select"
                id="shareUser" ref="shareUser"
                :placeholder="`_datacontainer.share.user.desc` | translate"
                v-model="addAccountId">
                <option
                  v-for="(contactAddress, index) in addableContacts"
                  :value="contactAddress">
                  {{ contacts[contactAddress].alias || contactAddress }}
                </option>
              </select>
            </div>
          </template>
          <template v-slot:footer>
            <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
              id="container-share"
              @click="addUser()">
              {{ `_datacontainer.share.add-user` | translate }}
              <i class="mdi mdi-arrow-right label"></i>
            </button>
          </template>
        </evan-modal>
        <evan-modal
          id="container-share-modal"
          ref="addUserModal"
          v-else>
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
            <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
              id="container-go-addressbook"
              @click="evanNavigate(`addressbook.vue.${ dapp.domainName }`, `/${ dapp.rootEns }`)">
              {{ `_datacontainer.share.no-contacts.open-contacts` | translate }}
              <i class="mdi mdi-arrow-right label"></i>
            </button>
          </template>
        </evan-modal>

        <evan-modal
          id="share-modal"
          ref="shareModal"
          :maxWidth="'800px'">
          <template v-slot:header>
            <h5 class="modal-title">
              {{ `_datacontainer.share.action` | translate }}
            </h5>
          </template>
          <template v-slot:body>
            <p>
              {{ '_datacontainer.share.bmail-description' | translate }}
            </p>
            <div class="form-group">
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
            <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
              id="plugin-share"
              :disabled="!shareForm.isValid"
              @click="share()">
              {{ `_datacontainer.share.action` | translate }}
              <i class="mdi mdi-arrow-right label ml-3"></i>
            </button>
          </template>
        </evan-modal>
      </template>
  <!--     <div class="white-box border-smooth rounded mt-3"
        v-for="(userConfig, index) in shareConfig">
        <div class="header">
          <div>
            <h3 class="m-0 font-weight-semibold">
              {{ contacts[userConfig.accountId] ?
                contacts[userConfig.accountId].alias :
                userConfig.accountId }}
            </h3>
            <span class="text-muted">
              {{ userConfig.accountId }}
            </span>
          </div>
          <span class="mx-auto"></span>
          <button class="btn"
            @click="collapsed[userConfig.accountId] = !collapsed[userConfig.accountId]">
            <i
              :class="{
                'mdi mdi-chevron-up': collapsed[userConfig.accountId],
                'mdi mdi-chevron-down': !collapsed[userConfig.accountId],
              }">
            </i>
          </button>
        </div>
        <table id="ajv-table" class="evan-flex-table">
          <thead>
            <tr class="text-muted">
              <th>
                {{ '_datacontainer.share.property' | translate }}
              </th>
              <th class="text-center">
                {{ '_datacontainer.share.read' | translate }}
              </th>
              <th class="text-center">
                {{ '_datacontainer.share.write' | translate }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(property, index) in properties">
              <td>{{ property }}</td>
              <td class="text-center">
                <input class="form-check-input mt-0 mr-2 position-relative" type="checkbox"
                  :id="`permission-read-${ userConfig.accountId }`"
                  :disabled="sharing || originPermissionMap[userConfig.accountId][property].read"
                  v-model="permissionMap[userConfig.accountId][property].read"
                  @change="checkPermissionChanged(userConfig.accountId, property, false)">
              </td>
              <td class="text-center">
                <input class="form-check-input mt-0 ml-2 position-relative" type="checkbox"
                  :id="`permission-write-${ userConfig.accountId }`"
                  :disabled="sharing || originPermissionMap[userConfig.accountId][property].readWrite"
                  v-model="permissionMap[userConfig.accountId][property].readWrite"
                  @change="checkPermissionChanged(userConfig.accountId, property, true)">
                </td>
            </tr>
          </tbody>
        </table>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './permissions.ts';
  export default Component;
</script>
