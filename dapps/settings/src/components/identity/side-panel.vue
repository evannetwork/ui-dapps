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
      <div v-else-if="form">
        <p
          v-if="isNew"
          class="my-3"
        >
          {{ $t('_settings.identity.side-panel.select-contact') }}
        </p>
        <evan-form
          ref="form"
          :editable="canEdit"
          :form="form"
          :i18n-scope="'_settings.identity.side-panel.form'"
          :only-form="true"
        />

        <p
          v-if="isNew && contact.address"
          class="my-3"
        >
          {{ $t('_settings.identity.side-panel.define-perm-for', {alias: contact.displayName}) }}
        </p>

        <div class="d-flex">
          <div class="d-flex align-items-end">
            {{ $t('_settings.identity.side-panel.perm.name') }}
          </div>
          <div class="mx-auto" />
          <div class="d-flex">
            <div class="mr-3">
              <small class="font-italic">{{ $t('_settings.identity.side-panel.perm.read') }}</small>
              <evan-checkbox
                class="mb-0"
                :value="permissions.read"
                :disabled="originalContact.hasIdentityAccess === 'read' || originalContact.hasIdentityAccess === 'readWrite'"
                @input="updatePermissions($event, permissions.readWrite)"
              />
            </div>
            <div>
              <small class="font-italic">{{ $t('_settings.identity.side-panel.perm.readWrite') }}</small>
              <evan-checkbox
                class="mb-0"
                :value="permissions.readWrite"
                :disabled="originalContact.hasIdentityAccess === 'readWrite'"
                @input="updatePermissions(permissions.read, $event)"
              />
            </div>
          </div>
        </div>

        <template v-if="canEdit">
          <p class="mt-5">
            <i class="mdi mdi-alert-circle-outline mr-2" />
            <span v-if="isNew">
              {{ $t('_settings.identity.side-panel.transaction-cost.add') }}
            </span>
            <span v-else>
              {{ $t('_settings.identity.side-panel.transaction-cost.edit') }}
            </span>
          </p>

          <template v-if="!isNew">
            <evan-button
              type="danger-outline"
              class="btn-block"
              @click="$refs.deleteModal.show()"
            >
              {{ $t('_settings.identity.side-panel.remove-button') }}
            </evan-button>

            <evan-modal ref="deleteModal">
              <template v-slot:header>
                <h5 class="modal-title">
                  {{ $t('_settings.identity.side-panel.delete-modal.title') }}
                </h5>
              </template>
              <template v-slot:body>
                <p>{{ $t('_settings.identity.side-panel.delete-modal.description') }}</p>
              </template>
              <template v-slot:footer>
                <evan-button
                  type="danger"
                  @click="removeAccess(contact)"
                >
                  {{ $t('_settings.identity.side-panel.delete-modal.confirm') }}
                </evan-button>
              </template>
            </evan-modal>
          </template>
        </template>
      </div>

      <template v-slot:footer>
        <div
          v-if="!loading && form"
          class="d-flex"
        >
          <evan-button
            type="secondary"
            :label="$t('_settings.identity.side-panel.cancel')"
            @click="hide"
          />
          <evan-button
            type="primary"
            native-type="submit"
            class="ml-3 flex-grow-1"
            :disabled="!form.isValid || !hasChanged()"
            :label="$t('_settings.identity.side-panel.submit')"
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
