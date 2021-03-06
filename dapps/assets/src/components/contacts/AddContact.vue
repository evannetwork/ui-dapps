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
  <form
    id="contactForm"
    ref="contactForm"
    @submit.prevent="addContact"
  >
    <evan-swipe-panel
      ref="addContactPanel"
      alignment="right"
      type="default"
      class="light"
      :show-backdrop="true"
      :hide-close-button="true"
      :title="$t('_assets.contacts.add-contact-title')"
      @hide="initState"
    >
      <evan-loading v-if="loading" />
      <template v-else>
        <p>{{ '_assets.contacts.add-contact-desc' | translate }}</p>
        <evan-form-control-input
          v-model="idOrEmail"
          :label="'_assets.contacts.id-or-email' | translate"
          :placeholder="$t('_assets.contacts.id-or-email-placeholder')"
          :required="true"
          :error="idOrEmailErrorMessage"
          @input="handleIdOrEmailChange"
        />
        <evan-form-control-input
          v-model="alias"
          :label="$t('_assets.contacts.note')"
          :placeholder="$t('_assets.contacts.note-placeholder')"
          :error="alias.length > 100 ? '_assets.contacts.alias-max-length' : false"
          :required="true"
        />

        <p>{{ '_assets.contacts.email-desc' | translate }}</p>

        <evan-form-control-input
          v-model="fromAlias"
          disabled
          :label="$t('_assets.contacts.sender')"
          :placeholder="$t('_assets.contacts.sender-placeholder')"
          :required="true"
        />

        <evan-form-control-input
          v-model="msgTitle"
          :label="$t('_assets.contacts.subject')"
          :placeholder="$t('_assets.contacts.subject-placeholder')"
          :required="true"
        />

        <evan-form-control-textarea
          v-model="msgBody"
          :label="$t('_assets.contacts.message')"
          :placeholder="$t('_assets.contacts.message-placeholder')"
          :required="true"
          :rows="5"
        />

        <div
          v-if="isAddress(idOrEmail)"
          class="mt-5"
        >
          <span>{{ $t('_assets.contacts.automatic-share') }}</span>
          <evan-permissions
            :permissions="sharingObj"
            :update-permissions="handlePermissionUpdate"
            i18n-scope="_profile.sharing.profileContract"
            :sort-filter="shareFilters"
          />
        </div>
        <div
          v-else-if="emailInvite"
          class="d-flex align-items-center mt-7"
        >
          <i
            class="mdi mdi-information-outline mr-2"
            style="font-size: 40px"
          />
          <span>{{ $t('_assets.contacts.email-hint') }}</span>
        </div>
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
            :disabled="!checkFormValid()"
            :label="'_assets.contacts.add-contact-btn' | translate"
          />
        </div>
      </template>
    </evan-swipe-panel>
  </form>
</template>

<script lang="ts">
import AddContactComponent from './AddContact';

export default AddContactComponent;
</script>
