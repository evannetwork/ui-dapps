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
*/

<template>
  <div
    class="evan-form"
    :class="{
      'edit-mode': editMode && !onlyForm,
      'form-data-wrapper': !onlyForm,
      'transparent': !editMode && !onlyForm,
    }"
  >
    <div
      v-if="!onlyForm"
      class="d-flex justify-content-between align-items-center pb-1"
    >
      <h5 class="my-0 py-0 font-weight-bold">
        <i
          class="mdi mr-2"
          :class="[ {'mdi-lock': !isPublic}, {'mdi-web': isPublic} ]"
        />
        {{ title }}
      </h5>
      <evan-button
        v-if="shareable && !editMode"
        type="secondary"
        size="sm"
        @click="share()"
      >
        {{ '_evan.share' | translate }}
      </evan-button>
    </div>
    <div
      class="px-0"
      :class="{
        'container': stacked,
        'pt-4': !onlyForm,
      }"
    >
      <form
        class="d-flex flex-wrap flex-row justify-content-between"
        @submit="save"
      >
        <slot :setEditMode="setEditMode" />
        <slot
          v-if="form"
          name="form"
        >
          <template v-for="(controlName) in form.controls">
            <slot :name="`form-control-${ controlName }`">
              <component
                :is="getControlComponentName(controlName)"
                :id="form[controlName].uiSpecs && form[controlName].uiSpecs.attr ? form[controlName].uiSpecs.attr.id : null"
                v-model="form[controlName].value"
                :disabled="!editable || isLoading"
                :error="(onlyForm || editMode && !onlyForm) ? getTranslation(form[controlName], 'error') : false"
                :hint="getTranslation(form[controlName], 'hint')"
                :label="getTranslation(form[controlName], 'label')"
                :placeholder="getTranslation(form[controlName], 'placeholder')"
                :stacked="stacked"
                v-bind="form[controlName].uiSpecs && form[controlName].uiSpecs.attr ? form[controlName].uiSpecs.attr : { }"
                @blur="form[controlName].setDirty()"
                @input="form[controlName].uiSpecs && form[controlName].uiSpecs.input ? form[controlName].uiSpecs.input($event) : null"
              />
            </slot>
          </template>
        </slot>
        <slot name="after" />
      </form>
    </div>
    <template v-if="(editMode || isLoading) && !onlyForm">
      <div class="d-flex justify-content-end">
        <div>
          <a
            v-if="!isLoading"
            class="text-muted mb-3 d-block text-right"
            href="https://evannetwork.github.io/docs/other/glossary.html#e"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="mdi mdi-information-outline mr-2" />
            {{ '_evan.transaction_costs_hint' | translate }}
          </a>
          <div class="d-flex justify-content-end">
            <evan-button
              v-if="!isLoading && enableCancel"
              class="mr-3"
              type="secondary"
              :label="'_evan.cancel' | translate"
              @click="cancel"
            />
            <evan-button
              type="primary"
              :disabled="isLoading || disabled || (form && !form.isValid)"
              :is-loading="isLoading"
              :label="'_evan.save' | translate"
              @click="save"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import FormDataWrapper from './form';

export default FormDataWrapper;
</script>
