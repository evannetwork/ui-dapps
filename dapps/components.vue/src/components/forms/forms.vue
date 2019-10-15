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
  <div class="container py-3">
    <label>
      Only Form ?
      <input type="checkbox"
        v-model="onlyForm"
        @change="showForms = false; $nextTick(() => showForms = true);"/>
    </label>

    <template v-if="showForms">
      <evan-form
        ref="sampleForm"
        :form="sampleForm"
        :i18nScope="'test.test2'"
        :isPublic="isPublic"
        :onlyForm="onlyForm"
        :stacked="stacked"
        :title="'Automatic form generation'"
        @save="handleSubmit">
        <template v-slot:form-control-files>
          <evan-file-input
            label="files"
            v-model="sampleForm.files.value"
            :stacked="stacked"
            @input="$refs.sampleForm.setEditMode(true);">
          </evan-file-input>
        </template>
      </evan-form>
      <evan-form
        ref="sampleForm2"
        :i18nScope="'test.test2'"
        :isPublic="isPublic"
        :onlyForm="onlyForm"
        :title="'Evan form controls'"
        @save="handleSubmit">

        <evan-form-control-checkbox id="isPublicCheckbox"
          v-model="isPublic"
          label="Public ?"
          :stacked="stacked"
        />
        <evan-form-control-checkbox id="isStackedCheckbox"
          v-model="stacked"
          label="Stacked ?"
          :stacked="stacked"
        />

        <evan-form-control-input
          id="evan-form-test-1"
          label="Field1"
          type="text"
          placeholder="Field 1 - Text"
          v-model="field1"
          :stacked="stacked"
          disabled
        />

        <evan-form-control-input
          id="evan-form-test-2"
          label="Field2"
          placeholder="Field 2 - E-mail"
          type="email"
          v-model="field2"
          :stacked="stacked"
        />

        <evan-form-control-input
          id="evan-form-test-3"
          label="Field 3"
          type="number"
          placeholder="Field 3 - Number"
          v-model="field3"
          :stacked="stacked"
        />

        <evan-form-control-select
          id="evan-form-test-4"
          label="Field 4 - Select"
          type="number"
          v-model="field4"
          :options="options"
          :stacked="stacked"
        />

        <div class="form-group"
          :class="{ 'inline': stacked }">
          <label class="col-form-label" for="custom-input">
            Custom Input
          </label>
          <div class="input-wrapper">
            <input type="checkbox"
              id="custom-input"
              class="form-control"
              @change="$refs.sampleForm2.setEditMode(true)"
              v-model="isPublic"
            />
          </div>
        </div>

        <evan-form-control-v-select
          id="evan-form-test-5"
          label="Field 5 - V-Select"
          v-model="field5"
          :options="contacts"
          :disabled="contacts.length === 0"
          :taggable="true"
        />

      </evan-form>
    </template>

    <div class="container white-box p-3">
      <evan-permissions-editor :loadPermissions="loadPermissions" :updatePermissions="updatePermissions" />
    </div>

  </div>
</template>

<script lang="ts">
  import Forms from './forms';
  export default Forms;
</script>
