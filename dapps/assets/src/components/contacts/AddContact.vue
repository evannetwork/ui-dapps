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
      <!-- Enter the appropriate Evan ID to send a contact request or enter an email address to invite a new contact to Evan. -->
      <p>{{ '_assets.contacts.add-contact-desc' | translate }}</p>

      <evan-form-control-input
        :label="$t('_assets.contacts.id-or-email')"
        :placeholder="$t('_assets.contacts.id-or-email-placeholder')"
        :required="true"
      />

      <evan-form-control-input
        :label="$t('_assets.contacts.contact-name')"
        :placeholder="$t('_assets.contacts.contact-name-placeholder')"
        :required="true"
      />

      <p>{{ '_assets.contacts.email-desc' | translate }}</p>

      <evan-form-control-input
        :label="$t('_assets.contacts.sender')"
        :placeholder="$t('_assets.contacts.sender-placeholder')"
        :value="''"
        :required="true"
      />

      <evan-form-control-input
        :label="$t('_assets.contacts.subject')"
        :placeholder="$t('_assets.contacts.subject-placeholder')"
        :value="$t('_assets.contacts.subject-prefill')"
        :required="true"
      />

      <evan-form-control-textarea
        :label="$t('_assets.contacts.message')"
        :placeholder="$t('_assets.contacts.message-placeholder')"
        :value="$t('_assets.contacts.message-prefill')"
        :required="true"
        :rows="5"
      />
  </div>
</template>

<script lang="ts">
import AddContactComponent from './AddContact';
export default AddContactComponent;
</script>

<style lang="scss" scoped>

</style>
