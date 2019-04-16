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
    <div class="p-1 p-md-4 text-left">
      <div class="bg-level-1 border">
        <div class="d-flex p-5 border-bottom border-sm align-items-center">
          <h3 class="m-0 font-weight-semibold">
            {{ `_digitaltwins.breadcrumbs.containerlink` | translate }}
          </h3>
        </div>

        <template v-if="!validDTAddress">
          <p class="px-5 pt-3 text-justify">{{ `_digitaltwins.containerlink.description1` | translate }}</p>
          <div class="px-5 py-3">
            <dt-lookup-form ref="dtLookupForm"
              :address="digitalTwinAddress"
              :disableGlobal="true"
              @submit="useAddress">
            </dt-lookup-form>
          </div>
        </template>

        <evan-modal ref="createDTAddress"
          :customModal="true">
          <template v-slot:content>
            <dt-general ref="dtGeneralForm"
              v-if="uiDT"
              :uidigitaltwin="uiDT"
              :standalone="false">
            </dt-general>
          </template>
        </evan-modal>

        <template v-if="validDTAddress">
          <div class="text-center" v-if="linking">
            <h4 class="mt-5 mb-3">{{ '_digitaltwins.containerlink.linking' | translate }}</h4>
            <evan-loading></evan-loading>
          </div>
          <template v-else>
            <evan-modal ref="invalidContainerModal">
              <template v-slot:header>
                <p class="modal-title">
                  {{ `_digitaltwins.containerlink.invalid-container.title` | translate }}
                </p>
              </template>
              <template v-slot:body>
                <p class="text-left m-0"
                  v-html="$t(`_digitaltwins.containerlink.invalid-container.desc`, modalParams)">
                </p>
              </template>
            </evan-modal>

            <div class="d-flex px-5 pt-3 align-items-center">
              <p class="m-0">
                {{ `_digitaltwins.containerlink.digitaltwin` | translate }}: <b>{{ validDTAddress }}</b>
              </p>
              <button class="btn"
                v-if="validDTAddress && !linking"
                @click="validDTAddress = ''">
                <i class="mdi mdi-file-document-edit-outline"></i>
                <!-- <span>
                  {{ '_digitaltwins.containerlink.change-twin' | translate }}
                </span> -->
              </button>
            </div>

            <p class="px-5 text-justify">
              {{ `_digitaltwins.containerlink.description2` | translate }}
            </p>
            <form class="px-5 pb-3" v-on:submit.prevent="linkContainer">
              <div class="form-group">
                <label for="name">
                  {{ `_digitaltwins.containerlink.name.title` | translate }}
                </label>
                <input class="form-control" required
                  id="name" ref="name"
                  :placeholder="`_digitaltwins.containerlink.name.desc` | translate"
                  v-model="containerLinkForm.name.value"
                  v-bind:class="{ 'is-invalid' : containerLinkForm.name.error }"
                  @blur="containerLinkForm.name.setDirty()">
                <div class="invalid-feedback">
                  {{ `_digitaltwins.containerlink.name.error` | translate }}
                </div>
              </div>
              <div class="form-group">
                <label for="address">
                  {{ `_digitaltwins.containerlink.address.title` | translate }}
                </label>
                <input class="form-control" required
                  id="address" ref="address"
                  :placeholder="`_digitaltwins.containerlink.address.desc` | translate"
                  v-model="containerLinkForm.address.value"
                  v-bind:class="{ 'is-invalid' : containerLinkForm.address.error }"
                  @blur="containerLinkForm.address.setDirty()">
                <div class="invalid-feedback">
                  {{ `_digitaltwins.containerlink.address.error` | translate }}
                </div>
              </div>

              <div class="text-center mt-3 w-100">
                <button type="submit"
                  class="btn btn-rounded btn-primary"
                  :disabled="!containerLinkForm.isValid || checking">
                  <div class="spinner-border spinner-border-sm text-light mr-3"
                    v-if="checking">
                  </div>
                  {{ `_digitaltwins.containerlink.use` | translate }}
                </button>
              </div>
            </form>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './container-link.ts';
  export default Component;
</script>
