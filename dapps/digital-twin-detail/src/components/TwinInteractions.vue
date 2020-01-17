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
  <div>
    <evan-swipe-panel
      @init="exportModal = $event"
      alignment="right"
      class="light"
      :title="'_twin-detail.data.context-menu.export-template' | translate"
      showBackdrop="true"
      type="default">
      <div class="d-flex h-100 align-items-center justify-content-center">
        <div v-if="exporting">
          <div><evan-loading /></div>
          <div class="mt-3 text-center">
            <h4>
              {{ `_twin-detail.data.context-menu.exporting-twin` | translate }}
            </h4>
          </div>
        </div>
        <evan-success v-else />
      </div>

      <template slot="footer">
        <div class="d-flex">
          <evan-button
            type="secondary"
            :label="'_evan.cancel' | translate"
            @click="exportModal.hide()"
            class="mr-3"
          />
          <span class="mx-auto" />
          <evan-button
            type="primary"
            :disabled="exporting"
            :label="'_twin-detail.data.context-menu.download-template' | translate"
            @click="downloadTwinTemplate()"
          />
        </div>
      </template>
    </evan-swipe-panel>

    <evan-swipe-panel
      @init="duplicatePanel = $event"
      alignment="right"
      class="light"
      :title="'_twin-detail.data.context-menu.duplicate-twin' | translate"
      showBackdrop="true"
      type="default">
      <div
        class="d-flex flex-column h-100 align-items-center justify-content-center"
        v-if="exporting || duplicating">
        <div><evan-loading /></div>
        <div class="mt-3 text-center">
          <h4 v-if="exporting">
            {{ `_twin-detail.data.context-menu.exporting-twin` | translate }}
          </h4>
          <h4 v-else-if="duplicating">
            {{ `_twin-detail.data.context-menu.duplicating-twin` | translate }}
          </h4>
        </div>
      </div>
      <evan-form-dbcp
        class="pt-5"
        ref="dbcpForm"
        :contractAddress="$store.state.twin.contractAddress"
        :description="$store.state.twin.description"
        i18nScope="_twin-detail.data.general"
        onlyForm="true"
        @init="dbcpForm = $event"
        v-else
      />
      <template slot="footer">
        <div class="d-flex">
          <evan-button
            type="secondary"
            :label="'_evan.cancel' | translate"
            @click="duplicatePanel.hide()"
            class="mr-3"
          />
          <span class="mx-auto" />
          <evan-button
            type="primary"
            :disabled="exporting || duplicating"
            :label="'_twin-detail.data.context-menu.duplicate-twin' | translate"
            @click="createTwinDuplicate()"
          />
        </div>
      </template>
    </evan-swipe-panel>
  </div>
</template>

<script lang="ts">
import DigitalTwinInteractionsComponent from './TwinInteractions';
export default DigitalTwinInteractionsComponent;
</script>

