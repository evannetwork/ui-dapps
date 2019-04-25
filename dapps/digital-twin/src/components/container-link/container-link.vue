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
      <div class="white-box border rounded">
        <div class="header p-0">
          <button class="btn large"
            @click="$router.history.go(-1)">
            <i class="mdi mdi-chevron-left"></i>
          </button>
          <h3 class="m-0 font-weight-semibold">
            {{ `_digitaltwins.breadcrumbs.containerlink` | translate }}
          </h3>
        </div>

        <template v-if="!validDTAddress">
          <div class="px-5 py-3">
            <dt-lookup-form ref="dtLookupForm"
              :address="digitalTwinAddress"
              :disableGlobal="true"
              @submit="useAddress">
              <template v-slot:description>
                <div class="d-flex mt-3 align-items-center">
                  <i class="mdi mdi-link-variant text-secondary mr-3" style="font-size: 60px;"></i>
                  <p class="m-0 text-justify">
                    {{ `_digitaltwins.containerlink.description1` | translate }}
                  </p>
                </div>
              </template>
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
            <div class="content">
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

              <div class="d-flex align-items-center mb-3"
                v-if="!($route.params.digitalTwinAddress && validDTAddress)">
                <p class="m-0">
                  {{ `_digitaltwins.containerlink.digitaltwin` | translate }}: <b>{{ validDTAddress }}</b>
                </p>
                <button class="btn py-0"
                  v-if="validDTAddress && !linking"
                  @click="validDTAddress = ''">
                  <i class="mdi mdi-file-document-edit-outline"></i>
                  <!-- <span>
                    {{ '_digitaltwins.containerlink.change-twin' | translate }}
                  </span> -->
                </button>
              </div>

              <p class="text-justify">
                {{ `_digitaltwins.containerlink.description2` | translate }}
              </p>
              <form v-on:submit.prevent="linkContainer">
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
              </form>
            </div>
            <div class="footer text-right">
              <button type="submit"
                class="btn btn-rounded btn-primary"
                :disabled="!containerLinkForm.isValid || checking"
                @click="linkContainer()">
                {{ `_digitaltwins.containerlink.use` | translate }}
                <i class="mdi mdi-arrow-right label ml-2"
                  v-if="!checking"></i>
                <div class="spinner-border spinner-border-sm text-light ml-2"
                  v-else>
                </div>
              </button>
            </div>
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
