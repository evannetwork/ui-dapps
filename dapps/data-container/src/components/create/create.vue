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
    <evan-breadcrumbs :i18nScope="'_datacontainer.breadcrumbs'"></evan-breadcrumbs>
    <div class="p-3 text-left">
      <div class="bg-level-1 border">
        <div class="d-flex p-3 border-bottom align-items-center">
          <h4 class="m-0">
            {{ `_datacontainer.createForm.title` | translate }}
          </h4>
        </div>
        <div class="evan-steps p-3"
          v-if="!creating">
          <div class="evan-step-header">
            <button class="btn"
              v-for="(step, index) of steps"
              :disabled="step.disabled(this)"
              @click="activeStep = index">
              <span class="stepper-circle"
                :class="{
                  'bg-primary': activeStep === index,
                  'bg-secondary': activeStep !== index,
                }">
                {{ index + 1}}
              </span>
              <span>{{ step.title | translate }}</span>
            </button>
          </div>
          <div class="pt-3">
            <div class="step" v-if="activeStep === 0">
              <form class="p-4"
                v-on:submit.prevent="activeStep = 1"
                v-if="!creating">
                <div class="form-group" v-if="templates.length > 1">
                  <label for="template">
                    {{ `_datacontainer.createForm.template.title` | translate }}
                  </label>
                  <select class="form-control"
                    id="template" ref="template"
                    :placeholder="`_datacontainer.createForm.template.desc` | translate"
                    v-model="createForm.template.value"
                    v-bind:class="{ 'is-invalid' : createForm.template.error }"
                    @blur="createForm.template.setDirty()">
                    <option
                      v-for="(template, index) in templates"
                      :value="index">
                      {{ template.title | translate }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="name">
                    {{ `_datacontainer.createForm.name.title` | translate }}
                  </label>
                  <input class="form-control" required
                    id="name" ref="name"
                    :placeholder="`_datacontainer.createForm.name.desc` | translate"
                    v-model="createForm.name.value"
                    v-bind:class="{ 'is-invalid' : createForm.name.error }"
                    @blur="createForm.name.setDirty()">
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
                    v-model="createForm.description.value"
                    v-bind:class="{ 'is-invalid' : createForm.description.error }"
                    @blur="createForm.description.setDirty()">
                  </textarea>
                </div>

                <div class="text-center mt-3 w-100">
                  <button type="submit"
                    class="btn btn-rounded btn-primary"
                    :disabled="!createForm.isValid || checking">
                    <div class="spinner-border spinner-border-sm text-light mr-3"
                      v-if="checking">
                    </div>
                    {{ `_datacontainer.createForm.continue` | translate }}
                  </button>
                </div>
              </form>
            </div>
            <div class="step" v-if="activeStep === 1">
              <dt-template-handler
                :address="'create'"
                :template.sync="templates[createForm.template.value]">
              </dt-template-handler>

              <evan-modal ref="createModal">
                <template v-slot:header>
                  <h5 class="modal-title">
                    {{ `_datacontainer.create-question.title` | translate }}
                  </h5>
                </template>
                <template v-slot:body>
                  <p class="text-left m-0"
                    v-html="$t(`_datacontainer.create-question.desc`, modalParams)">
                  </p>
                </template>
                <template v-slot:footer>
                  <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
                    @click="create()">
                    {{ `_datacontainer.create-question.action` | translate }}
                  </button>
                </template>
              </evan-modal>

              <div class="text-center mt-3 w-100">
                <button
                  class="btn btn-rounded btn-primary"
                  :disabled="!createForm.isValid || checking"
                  @click="$refs.createModal.show()">
                  <div class="spinner-border spinner-border-sm text-light mr-3"
                    v-if="checking">
                  </div>
                  {{ `_datacontainer.createForm.finish` | translate }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center" v-if="creating">
          <h4 class="mt-5 mb-3">{{ '_datacontainer.in-creation' | translate }}</h4>
          <evan-loading></evan-loading>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './create.ts';
  export default Component;
</script>
