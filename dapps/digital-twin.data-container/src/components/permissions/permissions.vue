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
    <!-------------------------- actions section -------------------------->
    <template v-if="!loading">
      <evan-modal
        id="container-share-modal"
        ref="shareModal"
        v-if="!share.error">
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
                <tr
                  v-for="(property, index) in Object.keys(template.properties)">
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
                    <button class="btn p-0"
                      :id="`clear${ index }`"
                      @click="$set(share.permissions, property, 'none')">
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
            id="container-share"
            :disabled="!shareForm.isValid || Object.keys(share.permissions)
              .filter(entry => share.permissions[entry] && share.permissions[entry] !== 'none')
              .length === 0"
            @click="shareDt()">
            {{ `_datacontainer.share.action` | translate }}
            <i class="mdi mdi-arrow-right label"></i>
          </button>
        </template>
      </evan-modal>
      <evan-modal
        id="container-share-modal"
        ref="shareModal"
        v-else>
        <template v-slot:header>
          <h5 class="modal-title">
            {{ `_datacontainer.share.${ share.error }.title` | translate }}
          </h5>
        </template>
        <template v-slot:body>
          <p class="text-left m-0"
            v-html="$t(`_datacontainer.share.${ share.error }.desc`, modalParams)">
          </p>
        </template>
        <template v-slot:footer
          v-if="share.error === 'no-contacts'">
          <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
            id="container-go-addressbook"
            @click="evanNavigate(`addressbook.vue.${ dapp.domainName }`, `/${ dapp.rootEns }`)">
            {{ `_datacontainer.share.no-contacts.open-contacts` | translate }}
            <i class="mdi mdi-arrow-right label"></i>
          </button>
        </template>
      </evan-modal>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './permissions.ts';
  export default Component;
</script>
