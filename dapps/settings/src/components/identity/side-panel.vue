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
    <evan-button
      v-if="canEdit"
      :type="'icon-primary'"
      size="lg"
      class="side-panel-open"
      icon="mdi mdi-plus"
      @click="show()"
    />

    <evan-swipe-panel
      ref="sidePanel"
      alignment="right"
      type="default"
      class="light"
      :show-backdrop="true"
      :title="$t('_settings.identity.side-panel.title')"
    >
      <evan-loading v-if="loading" />
      <div v-else>
        <evan-form
          ref="form"
          :editable="canEdit"
          :form="form"
          :i18n-scope="'_settings.identity.side-panel.form'"
          :only-form="true"
        />

        <evan-permissions
          :permissions="permissions"
          :contract-id="address"
          :update-permissions="updatePermissions"
          :i18n-scope="'_settings.identity.side-panel.perm'"
        />
      </div>

      <template v-slot:footer>
        <div
          v-if="!loading"
          class="d-flex"
        >
          <evan-button
            type="secondary"
            :label="'_settings.identity.side-panel.cancel' | translate"
            @click="hide"
          />
          <evan-button
            type="primary"
            native-type="submit"
            class="ml-3 flex-grow-1"
            :disabled="!form.isValid || !hasChanged()"
            :label="'_settings.identity.side-panel.submit' | translate"
            @click="save"
          />
        </div>
      </template>
    </evan-swipe-panel>
  </div>
</template>

<script lang="ts">
import Component from './side-panel';

export default Component;
</script>

<style lang="scss" scoped>
.side-panel-open {
  position: fixed !important;
  bottom: 80px;
  right: 60px;
}

/deep/ table {
  tbody {
    display: none;
  }

  thead h4 {
    font-size: 14px !important;
  }
}
</style>
