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
      <!-- Use profile picture componnent for now. Might need refactoring to adjust texts. -->
      <evan-profile-picture
        type="device"
        :accountName="name"
        :isEditable="true"
        :src="image ? image : null"
        @changed="handleImageChange"
      />

      <evan-form-control-input
        v-model="name"
        :label="$t('_assets.digitaltwins.name')"
        :placeholder="$t('_assets.digitaltwins.name-placeholder')"
        :required="true"
      />

      <evan-form-control-input
        v-model="desc"
        :label="$t('_assets.digitaltwins.desc')"
        :placeholder="$t('_assets.digitaltwins.desc-placeholder')"
      />

      <p>{{ '_assets.digitaltwins.template-desc' | translate }}</p>

      <evan-form-control-select
        :options="['Bike']"
        :placeholder="'_assets.digitaltwins.template-select-placeholder' | translate"
        :required="true"
        @change="handleTemplateSelectChange"
      />

      <evan-file-input accept=".json"></evan-file-input>

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
