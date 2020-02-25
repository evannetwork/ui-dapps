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
  <form @submit.prevent="onSubmit">
    <evan-swipe-panel
      ref="editContactPanel"
      alignment="right"
      type="default"
      class="light"
      :show-backdrop="true"
      :title="$t('_assets.contacts.edit-contact-title')"
    >
      <evan-loading v-if="!contact" />

      <template v-else>
        <evan-form-control-input
          :value="contact.address"
          :disabled="true"
          :required="true"
          :label="'_assets.contacts.name' | translate"
        />

        <evan-form-control-input
          v-model="note"
          class="btn-block"
          :label="'_assets.contacts.note' | translate"
          :placeholder="$t('_assets.contacts.note-placeholder')"
          @input="onNoteChange"
        />

        <p>{{ '_assets.contacts.remove-contact-desc' | translate }}</p>

        <evan-button
          type="danger"
          class="btn-block"
          @click="$refs.deleteModal.show"
        >
          {{ '_assets.contacts.remove-contact-button' | translate }}
        </evan-button>
      </template>

      <template v-slot:footer>
        <div class="d-flex">
          <evan-button
            type="secondary"
            :label="'_assets.contacts.cancel' | translate"
            @click="closePanel"
          />
          <evan-button
            type="primary"
            native-type="submit"
            class="ml-3 flex-grow-1"
            :disabled="!canSubmit"
            :label="'_assets.contacts.edit-contact-btn' | translate"
          />
        </div>
      </template>
    </evan-swipe-panel>

    <evan-modal ref="deleteModal">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_assets.contacts.delete-modal-title' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <p>{{ '_assets.contacts.confirm-delete-description' | translate }}</p>
      </template>
      <template v-slot:footer>
        <evan-button
          type="danger"
          @click="removeContact(contact)"
        >
          {{ '_assets.contacts.confirm-delete' | translate }}
        </evan-button>
      </template>
    </evan-modal>
  </form>
</template>

<script lang="ts">
import EditContactComponent from './EditContact';

export default EditContactComponent;
</script>
