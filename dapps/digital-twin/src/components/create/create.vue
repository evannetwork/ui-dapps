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
  <div v-if="!loading">
    <evan-modal
      id="twin-create"
      ref="createModal"
      :maxWidth="'800px'">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_digitaltwins.breadcrumbs.dt-create` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <template v-if="!uiDT.isCreating">
          <evan-modal
            id="twin-create-question"
            ref="createModalQuestion">
            <template v-slot:header>
              <h5 class="modal-title">
                {{ `_digitaltwins.createForm.question.title` | translate }}
              </h5>
            </template>
            <template v-slot:body>
              <p class="text-left m-0"
                v-html="$t(`_digitaltwins.createForm.question.desc`, modalParams)">
              </p>

              <div class="form-check p-3">
                <input class="form-check-input" type="checkbox"
                  id="dontShowCreateQuest"
                  v-model="dontShowCreateQuest">
                <label class="form-check-label" for="dontShowCreateQuest">
                  {{ '_digitaltwins.createForm.question.dont-show' | translate }}
                </label>
              </div>
            </template>
            <template v-slot:footer>
              <button type="button" class="btn btn-primary  font-weight-normal"
                id="container-create"
                @click="triggerCreateDispatcher()">
                {{ `_digitaltwins.createForm.question.action` | translate }}
                <i class="mdi mdi-arrow-right label ml-3"></i>
              </button>
            </template>
          </evan-modal>
          <dt-ens-actions
            :address="createForm.address.value"
            :purchaseEnsAddress="true"
            :disableOpen="true"
            :askForCreate="false"
            @init="$set(reactiveRefs, 'ensActions', $event)"
            @create="createDigitalTwin(true)">
          </dt-ens-actions>
         <dt-dbcp
            v-if="!reactiveRefs.ensActions || !reactiveRefs.ensActions.purchasing"
            :form="createForm"
            :dbcp="uiDT.dbcp"
            @submit="createDigitalTwin()">
            <template v-slot:after-inputs>
              <div class="form-check my-3">
                <input class="form-check-input"
                  id="use-address"
                  type="checkbox"
                  v-model="createForm.useAddress.value">
                <label class="form-check-label" for="use-address">
                  {{ '_digitaltwins.lookup.address.use-address' | translate }}
                </label>
              </div>
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
        </template>
        <div class="text-center" id="dt-creating"
          v-else>
          <h4 class="mt-5 mb-3">{{ '_digitaltwins.in-creation' | translate }}</h4>
          <b> {{ createForm.name.value }} </b>
          <evan-loading></evan-loading>
        </div>
      </template>
      <template v-slot:footer>
        <button type="submit"
          class="btn  btn-primary"
          id="dt-create"
          v-if="!uiDT.isCreating && (!reactiveRefs.ensActions || !reactiveRefs.ensActions.purchasing)"
          @click="createDigitalTwin()"
          :disabled="!createForm.isValid">
          {{ `_digitaltwins.createForm.create` | translate }}
          <i class="mdi mdi-arrow-right label"></i>
        </button>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './create.ts';
  export default Component;
</script>
