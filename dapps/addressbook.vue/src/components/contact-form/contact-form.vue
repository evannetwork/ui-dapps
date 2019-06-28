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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

<template>
  <div>
    <div class="d-flex align-items-center">
      <div class="form-check mr-3" v-if="!disableAccountId">
        <input class="form-check-input"
          id="emailInvite" type="radio"
          :value="false"
          v-model="form.emailInvite.value">
      </div>
      <div class="form-group w-100"
        v-if="!disableAccountId || !form.emailInvite.value">
        <label for="accountId">
          {{ `${ i18nScope }.accountId.title` | translate }} *
        </label>
        <input class="form-control" required
          id="accountId" ref="accountId"
          :class="{ 'is-invalid' : form.accountId.error }"
          :disabled="form.emailInvite.value"
          :placeholder="`${ i18nScope }.accountId.desc` | translate"
          :readonly="disableAccountId"
          v-model="form.accountId.value"
          @blur="form.accountId.setDirty()">
        <div class="invalid-feedback">
          {{ form.accountId.error | translate }}
        </div>
      </div>
    </div>

    <div class="d-flex align-items-center"
      v-if="!disableAccountId || form.emailInvite.value">
      <div class="form-check mr-3" v-if="!disableAccountId">
        <input class="form-check-input"
          id="emailInvite" type="radio"
          :value="true"
          v-model="form.emailInvite.value">
      </div>
      <div class="form-group w-100">
        <label for="email">
          {{ `${ i18nScope }.email.title` | translate }} *
        </label>
        <input class="form-control" required
          id="email" ref="email"
          v-model="form.email.value"
          :class="{ 'is-invalid' : form.email.error }"
          :disabled="!form.emailInvite.value"
          :placeholder="`${ i18nScope }.email.desc` | translate"
          :readonly="disableAccountId"
          @blur="form.email.setDirty()">
        <div class="invalid-feedback">
          {{ form.email.error | translate }}
        </div>
      </div>
    </div>

    <div class="form-group">
      <label for="alias">
        {{ `${ i18nScope }.alias.title` | translate }} *
      </label>
      <input class="form-control" required
        id="alias" ref="alias"
        :placeholder="`${ i18nScope }.alias.desc` | translate"
        v-model="form.alias.value"
        :class="{ 'is-invalid' : form.alias.error }"
        @blur="form.alias.setDirty()">
      <div class="invalid-feedback">
        {{ `${ i18nScope }.alias.error` | translate }}
      </div>
    </div>
    
    <div class="form-group">
      <label for="tags">
        {{ `${ i18nScope }.tags.title` | translate }}
      </label>
      <input class="form-control" required
        id="tags" ref="tags"
        :placeholder="`${ i18nScope }.tags.desc` | translate"
        v-model="form.tags.value"
        :class="{ 'is-invalid' : form.tags.error }"
        @blur="form.tags.setDirty()">
      <div class="invalid-feedback">
        {{ `${ i18nScope }.tags.error` | translate }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './contact-form.ts';
  export default Component;
</script>

