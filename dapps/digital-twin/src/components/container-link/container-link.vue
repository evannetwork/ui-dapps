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
  <div class="container-wide">
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
        <dt-ens-actions
          :address="reactiveRefs.ensField && reactiveRefs.ensField.lookupForm.address.value"
          :purchaseEnsAddress="true"
          :askForCreate="true"
          @init="
            $set(reactiveRefs, 'ensActions', $event);
            $route.params.digitalTwinAddress && checkAddress();
          "
          @submit="useAddress">
        </dt-ens-actions>

        <template v-if="reactiveRefs.ensActions && !reactiveRefs.ensActions.purchasing">
          <div class="content">
            <form
              class="col-sm-9 mx-auto"
              v-on:submit.prevent="checkAddress()">
              <dt-ens-field
                @init="$set(reactiveRefs, 'ensField', $event)"
                :address="digitalTwinAddress"
                :autocomplete="true">
              </dt-ens-field>
              <div class="d-flex mt-3 align-items-center">
                <i class="mdi mdi-link-variant text-secondary mr-3" style="font-size: 60px;"></i>
                <p class="m-0 text-justify">
                  {{ `_digitaltwins.containerlink.description1` | translate }}
                </p>
              </div>
            </form>
          </div>
          <template v-if="reactiveRefs.ensField">
            <div class="footer"
              v-if="reactiveRefs.ensActions">
              <button type="submit"
                id="dt-container-lookup"
                class="btn btn-rounded btn-primary"
                @click="reactiveRefs.ensActions.checkAddress(reactiveRefs.ensField.lookupForm.address.value)"
                :disabled="!reactiveRefs.ensField.lookupForm.isValid || reactiveRefs.ensActions.loading">
                {{ '_digitaltwins.lookup.title' | translate }}
                <div class="spinner-border spinner-border-sm text-light ml-3"
                  v-if="reactiveRefs.ensActions.loading">
                </div>
                <i class="mdi mdi-arrow-right label ml-3" v-else></i>
              </button>
            </div>
          </template>
        </template>
      </template>

      <evan-modal ref="createDTAddress"
        :customModal="true">
        <template v-slot:content>
          <dt-detail ref="dtdetailForm"
            v-if="uiDT"
            :uidigitaltwin="uiDT"
            :standalone="false">
          </dt-detail>
        </template>
      </evan-modal>

      <template v-if="validDTAddress">
        <div class="text-center"
          id="dt-container-linking"
          v-if="linking">
          <h4 class="mt-5 mb-3">{{ '_digitaltwins.containerlink.linking' | translate }}</h4>
          <evan-loading></evan-loading>
        </div>
        <template v-else>
          <div class="content">
            <evan-modal
              id="dt-container-link-invalid"
              ref="invalidContainerModal">
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
                id="dt-container-dt-change"
                v-if="validDTAddress && !linking"
                @click="validDTAddress = ''">
                <i class="mdi mdi-file-document-edit-outline"></i>
              </button>
            </div>

            <p class="text-justify">
              {{ `_digitaltwins.containerlink.description2` | translate }}
            </p>
            <form
              id="dt-container-link-form"
              v-on:submit.prevent="linkContainer">
              <div class="form-group">
                <label for="name">
                  {{ `_digitaltwins.containerlink.name.title` | translate }}
                </label>
                <input class="form-control" required
                  id="name" ref="name"
                  :placeholder="`_digitaltwins.containerlink.name.desc` | translate"
                  v-model="containerLinkForm.name.value"
                  :class="{ 'is-invalid' : containerLinkForm.name.error }"
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
                  :class="{ 'is-invalid' : containerLinkForm.address.error }"
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
              id="dt-container-link"
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
</template>

<script lang="ts">
  import Component from './container-link.ts';
  export default Component;
</script>
