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
    <evan-loading v-if="loading"></evan-loading>
    <div class="text-left container-wide"
      v-else>
      <template v-if="!uiDT.isCreating">
        <div class="d-flex mb-5 align-items-center">
          <div>
            <h3 class="font-weight-bold mb-0">
              {{ '_digitaltwins.createForm.create' | translate }}
            </h3>
            <p class="text-muted font-weight-semibold m-0">
              {{ '_digitaltwins.createForm.desc' | translate }}
            </p>
          </div>
        </div>
        <evan-modal
          id="twin-create-question"
          ref="createModal">
          <template v-slot:header>
            <h5 class="modal-title">
              {{ `_digitaltwins.createForm.question.title` | translate }}
            </h5>
          </template>
          <template v-slot:body>
            <p class="text-left m-0"
              v-html="$t(`_digitaltwins.createForm.question.desc`, modalParams)">
            </p>
          </template>
          <template v-slot:footer>
            <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
              id="container-create"
              @click="triggerCreateDispatcher()">
              {{ `_digitaltwins.createForm.question.action` | translate }}
              <i class="mdi mdi-arrow-right label ml-3"></i>
            </button>
          </template>
        </evan-modal>
        <div class="white-box border rounded">
          <div class="header">
            <h3 class="m-0 font-weight-semibold">
              {{ `_digitaltwins.detailForm.title` | translate }}
            </h3>
            <span class="mx-auto"></span> 
            <div v-if="(!reactiveRefs.ensActions || !reactiveRefs.ensActions.purchasing)">
              <div class="form-check my-3">
                <input class="form-check-input"
                  id="use-address"
                  type="checkbox"
                  v-model="createForm.useAddress.value">
                <label class="form-check-label" for="use-address">
                  {{ '_digitaltwins.lookup.address.use-address' | translate }}
                </label>
              </div>
            </div>
          </div>
          <dt-ens-actions
            :address="createForm.address.value"
            :purchaseEnsAddress="true"
            :disableOpen="true"
            :askForCreate="false"
            @init="$set(reactiveRefs, 'ensActions', $event)"
            @create="createDigitalTwin(true)">
          </dt-ens-actions>
          <template v-if="(!reactiveRefs.ensActions || !reactiveRefs.ensActions.purchasing)">
            <dt-dbcp
              :form="createForm"
              :dbcp="uiDT.dbcp"
              @submit="createDigitalTwin()">
              <template v-slot:after-inputs>
                <dt-ens-field
                  class="mt-3"
                  v-if="createForm.useAddress.value"
                  @init="$set(reactiveRefs, 'ensField', $event)"
                  :autocomplete="true"
                  :form="createForm">
                  <template slot:label>
                    {{ '_digitaltwins.lookup.address.title' | translate }}
                  </template>
                </dt-ens-field>
              </template>
            </dt-dbcp>
            <div class="footer">
              <button type="submit"
                class="btn btn-rounded btn-primary"
                id="dt-create"
                @click="createDigitalTwin()"
                :disabled="!createForm.isValid">
                {{ `_digitaltwins.createForm.create` | translate }}
                <i class="mdi mdi-content-save label"></i>
              </button>
            </div>
          </template>
        </div>
      </template>
      <div class="white-box border rounded text-center" id="dt-creating"
        v-else>
        <h4 class="mt-5 mb-3">{{ '_digitaltwins.in-creation' | translate }}</h4>
        <b> {{ createForm.name.value }} </b>
        <evan-loading></evan-loading>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './create.ts';
  export default Component;
</script>
