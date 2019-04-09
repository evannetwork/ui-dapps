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
    <evan-breadcrumbs :i18nScope="'_datacontainer.breadcrumbs'">
      <template v-slot:content>
        <button type="button" class="btn btn-primary btn-circle"
          @click="saveDt()"
          :disabled="!enableSave || $store.state.saving">
          <div class="spinner-border spinner-border-sm"
            v-if="$store.state.saving">
          </div>
          <i class="fas fa-save" v-else></i>
        </button>
      </template>
    </evan-breadcrumbs>

    <evan-loading v-if="loading"></evan-loading>
    <div class="p-3" v-else>
      <div class="bg-level-1 border">
        <div class="w-100 d-flex pt-3 px-3 border-bottom">
          <h4 class="m-0" v-if="!editSchema">
            {{ '_datacontainer.edit-dbcp' | translate }}
          </h4>
          <h4 class="m-0" v-if="editSchema">
            {{ '_datacontainer.edit-schema' | translate }}
          </h4>
          <span class="mx-auto"></span>
          <div class="custom-control custom-switch pb-3">
            <input type="checkbox" class="custom-control-input" id="editSwitch"
              v-model="editSchema">
            <label class="custom-control-label" for="editSwitch">
              {{ '_datacontainer.edit-schema' | translate }}
            </label>
          </div>
        </div>

        <div class="p-3">
          <form v-on:submit.prevent="saveDt"
            v-if="!editSchema">
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
          <template v-if="editSchema">
            <dt-template-handler
              :address="dapp.contractAddress"
              :template.sync="template">
            </dt-template-handler>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './detail.ts';
  export default Component;
</script>
