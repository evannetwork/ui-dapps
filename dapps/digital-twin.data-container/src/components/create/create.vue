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
    <evan-modal
      id="container-create-modal"
      ref="createModal"
      :maxWidth="'1200px'">
      <template v-slot:header>
        <h5 class="modal-title d-flex align-items-center">
          <template v-if="mode !== 'plugin'">
            <template v-if="digitalTwinAddress">
              {{ `_datacontainer.createForm.add-plugin` | translate }}
            </template>
            <template v-else>
              {{ `_datacontainer.createForm.create-plugin` | translate }}
            </template>
          </template>
          <template v-else>
            {{ `_datacontainer.plugin.create-title` | translate }}
          </template>

          <template v-if="activePlugin">
            - {{ createForm.name.value }}
          </template>

          <button class="btn btn-circle btn-sm btn-tertiary ml-3"
            v-if="!creating && activePlugin"
            id="dc-edit"
            @click="activePlugin = null">
            <i class="mdi mdi-pencil"></i>
            <evan-tooltip
              ref="editDbcphint"
              :placement="'bottom'">
              {{ `_datacontainer.createForm.edit-dbcp-hint` | translate }}
            </evan-tooltip>
          </button>
        </h5>
      </template>
      <template v-slot:body>
        <evan-loading v-if="loading"></evan-loading>
        <template v-else>
          <template v-if="!creating">
            <!---------------------------------- dbcp metadata ---------------------------------->
            <template v-if="!activePlugin">
              <dt-dbcp
                v-if="!creating"
                :form="createForm"
                :disableSpacing="true"
                @submit="activatePlugin(plugins[createForm.plugin.value])">
                <template v-slot:before-inputs
                   v-if="plugins.length !== 0">
                  <div class="form-group">
                    <label for="plugin">
                      {{ `_datacontainer.createForm.plugin.title` | translate }}
                    </label>
                    <select class="form-control custom-select"
                      id="plugin" ref="plugin"
                      :placeholder="`_datacontainer.createForm.plugin.desc` | translate"
                      v-model="createForm.plugin.value"
                      :class="{ 'is-invalid' : createForm.plugin.error }"
                      @blur="createForm.plugin.setDirty()">
                      <option
                        v-for="(plugin, index) in plugins"
                        :value="index">
                        {{ plugin.description.name | translate }}
                      </option>
                    </select>
                  </div>
                </template>
              </dt-dbcp>
            </template>

            <!---------------------------------- fill the schema ---------------------------------->
            <template v-else>
              <div class="header">
                <span class="mx-auto"></span>
                <div>
                  <button type="submit"
                    v-if="steps.length !== 0"
                    class="btn btn-primary btn-circle "
                    id="th-add-entry"
                    @click="$refs.dcNewEntry.showModal();">
                    <i class="mdi mdi-plus"></i>
                    <evan-tooltip :placement="'bottom'">
                      {{ `_datacontainer.entry.add` | translate }}
                    </evan-tooltip>
                  </button>
                </div>
              </div>

              <div class="evan-steps" v-if="steps.length !== 0">
                <div class="evan-step-header mt-3">
                  <!-- step button is disabled when a previous step was reactived and is currently invalid -->
                  <button class="btn"
                    v-for="(step, index) of steps"
                    :id="`evan-container-create-step-${ index }`"
                    :disabled="index > activeStep &&
                      steps[activeStep].entryComp && !steps[activeStep].entryComp.isValid()"
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
                <div v-for="(step, index) of steps">
                  <dc-entry
                    class="content pt-0"
                    v-if="index === activeStep"
                    :address="!templateMode ? 'dc-create' : 'plugin-create'"
                    :entry="activePlugin.template.properties[steps[activeStep].entryName]"
                    :entryName="steps[activeStep].entryName"
                    :permissions="permissions"
                    @init="$set(steps[activeStep], 'entryComp', $event)">
                  </dc-entry>
                </div>
              </div>
              <div class="text-center p-5" v-else>
                <h3 class="mt-4 font-weight-semibold">
                  {{ '_datacontainer.no-entries.title' | translate }}
                </h3>
                <h5 class="font-weight-semibold text-muted">
                  {{ '_datacontainer.no-entries.desc' | translate }}
                </h5>

                <button
                  class="btn btn-rounded btn-outline-secondary mt-3"
                  id="th-add-entry"
                  @click="$refs.dcNewEntry.showModal();">
                  {{ `_datacontainer.entry.add` | translate }}
                </button>
              </div>

              <!---------------------------------- modals ---------------------------------->
              <dc-new-entry
                ref="dcNewEntry"
                :template="activePlugin.template"
                @submit="addNewEntry($event)">
              </dc-new-entry>

              <evan-modal
                id="container-create-question"
                ref="createModalQuestion">
                <template v-slot:header>
                  <h5 class="modal-title" v-if="mode !== 'plugin'">
                    {{ `_datacontainer.create-question.title` | translate }}
                  </h5>
                  <h5 class="modal-title" v-else>
                    {{ `_datacontainer.plugin.create-title` | translate }}
                  </h5>
                </template>
                <template v-slot:body>
                  <p class="text-left m-0"
                    v-html="$t(`_datacontainer.create-question.desc`, modalParams)">
                  </p>
                </template>
                <template v-slot:footer>
                  <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
                    id="container-create"
                    @click="create()">
                    {{ `_datacontainer.create-question.action` | translate }}
                    <i class="mdi mdi-arrow-right label ml-3"></i>
                  </button>
                </template>
              </evan-modal>
            </template>
          </template>
          <div class="text-center" v-else>
            <h4 class="mt-5 mb-3">{{ '_datacontainer.in-creation' | translate }}</h4>
            <evan-loading></evan-loading>
          </div>
        </template>
      </template>
      <template v-slot:footer>
        <template v-if="!activePlugin">
          <button type="submit"
            class="btn btn-rounded btn-primary"
            id="container-create-step-0-finish"
            @click="activatePlugin(plugins[createForm.plugin.value])"
            :disabled="!createForm.isValid || checking">
            {{ `_datacontainer.createForm.continue` | translate }}
            <i class="mdi mdi-arrow-right label ml-3"></i>
            <div class="spinner-border spinner-border-sm text-light mr-3"
              v-if="checking">
            </div>
          </button>
        </template>
        <template
          v-else-if="steps.length === 0 || (steps[activeStep] && steps[activeStep].entryComp)">
          <button
            class="btn btn-rounded btn-primary"
            id="container-save"
            :disabled="steps.length !== 0 && !steps[activeStep].entryComp.isValid()"
            @click="nextStep()">
            <template v-if="steps.length === 0 || activeStep === (steps.length - 1)">
              {{ `_datacontainer.createForm.finish` | translate }}
            </template>
            <template v-else>
              {{ `_datacontainer.createForm.continue` | translate }}
            </template>
            <i class="mdi mdi-arrow-right label ml-3"></i>
            <div class="spinner-border spinner-border-sm text-light mr-3"
              v-if="checking">
            </div>
          </button>
        </template>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './create.ts';
  export default Component;
</script>
