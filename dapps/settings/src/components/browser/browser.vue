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
  <div class="evan-content-container">
    <div class="white-box mt-5">
      <h3 class="mb-5 d-block">
        {{ $t(`_settings.browser.language`) }}
      </h3>
      <select
        id="language"
        ref="language"
        v-model="language"
        class="form-control custom-select"
        @change="languageChanged()"
      >
        <option value="">
          {{ $t('_settings.browser.languages.browser') }}
        </option>
        <option value="de">
          {{ $t('_settings.browser.languages.de') }}
        </option>
        <option value="en">
          {{ $t('_settings.browser.languages.en') }}
        </option>
      </select>
      <span class="text-muted small">
        {{ $t('_settings.browser.reload-hint') }}
      </span>
    </div>

    <div class="white-box mt-5">
      <h3 class="mb-5 d-block">
        {{ $t('_settings.browser.developer-mode') }}
      </h3>
      <evan-form-control-checkbox
        id="devMode"
        v-model="devMode"
        class="mt-3"
        style="min-width: 0;"
        @input="devModeChanged()"
      />

      <template v-if="devMode">
        <b>
          {{ $t(`_settings.browser.dev-domain.title`) }}
        </b>
        <div class="d-flex align-items-center mt-3">
          <div>
            <evan-form-control-checkbox
              id="devDomainEnabled"
              v-model="devDomainEnabled"
              class="mr-3"
              @input="devDomainChanged()"
            />
          </div>
          <div class="form-group ml-3 w-100">
            <input
              id="devDomain"
              ref="devDomain"
              v-model="devDomain"
              class="form-control"
              :placeholder="$t(`_settings.browser.dev-domain.desc`)"
              :disabled="!devDomainEnabled"
              @change="devDomainChanged()"
            >
          </div>
        </div>
        <span class="text-muted small">
          {{ $t('_settings.browser.dev-domain.desc') }}
        </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Component from './browser';

export default Component;
</script>
