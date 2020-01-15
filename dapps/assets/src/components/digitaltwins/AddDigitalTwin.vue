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
  <form id="digitalTwinForm" ref="digitalTwinForm" @submit.prevent="addDigitalTwin">
    <evan-swipe-panel
      ref="addDigitalTwinPanel"
      alignment="right"
      type="default"
      class="light"
      :showBackdrop="true"
      :hideCloseButton="true"
      :title="$t('_assets.digitaltwins.add-digitaltwin-title')"
    >
      <label class="col-form-label" for="new-twin-picture">
        {{ '_assets.digitaltwins.add-image' | translate }}
        <small class="text-muted">({{ '_assets.optional' | translate }})</small>
      </label>
      <div class="my-3 d-flex justify-content-center">
        <evan-profile-picture
          id="new-twin-picture"
          type="device"
          :accountName="name"
          :isEditable="true"
          :src="image ? image : null"
          @changed="handleImageChange"
        />
      </div>
      <evan-form-control-input
        v-model="name"
        :label="$t('_assets.digitaltwins.name')"
        :placeholder="$t('_assets.digitaltwins.name-placeholder')"
        :required="true"
      />

      <evan-form-control-textarea
        v-model="description"
        :label="$t('_assets.digitaltwins.desc')"
        :placeholder="$t('_assets.digitaltwins.desc-placeholder')"
      />

      <p>
        {{ '_assets.digitaltwins.template-desc' | translate }}
        <a
          href="https://api-blockchain-core.readthedocs.io/en/latest/contracts/digital-twin-usage-examples.html#handling-templates-and-plugins"
          target="_blank"
          rel="noopener noreferrer"
          title="Twin API documentation"
        >
          {{ '_assets.more' | translate }}
        </a>
      </p>

      <evan-form-control-select
        id="templateSelect"
        :label="'_assets.digitaltwins.template-select-label' | translate"
        :options="presetTemplates"
        :placeholder="'_assets.digitaltwins.template-select-placeholder' | translate"
        :required="true"
        :value="selectedTemplate"
        @change="handleTemplateSelectChange"
        ref="templateSelector"
      />

      <evan-file-input
        accept=".json"
        @input="handleFileUpload"
        :placeholder="'_assets.digitaltwins.drag-desc' | translate"
      ></evan-file-input>

      <div v-if="templateErrors.length > 0">
        <h4 class="text-warning">Errors occured in template</h4>
        <div v-for="pluginErrors in templateErrors" :key="pluginErrors.name">
          <h5 v-if="pluginErrors.errors">{{ pluginErrors.name }}</h5>
          <ul v-if="pluginErrors.errors">
            <li v-for="error in pluginErrors.errors" :key="error.property">
              <span>{{ error.message }}</span>
            </li>
          </ul>
        </div>
      </div>

      <template v-slot:footer>
        <div class="d-flex">
          <evan-button
            type="secondary"
            @click="closePanel"
            :label="'_assets.digitaltwins.cancel' | translate"
          />
          <evan-button
            type="primary"
            native-type="submit"
            class="ml-3 flex-grow-1"
            :disabled="!(name && template)"
            :label="'_assets.digitaltwins.create-digitaltwin-btn' | translate"
          />
        </div>
      </template>
    </evan-swipe-panel>
  </form>
</template>

<script lang="ts">
import AddDigitalTwinComponent from './AddDigitalTwin';
export default AddDigitalTwinComponent;
</script>

<style lang="scss" scoped>
  @import './AddDigitalTwins.scss';
</style>
