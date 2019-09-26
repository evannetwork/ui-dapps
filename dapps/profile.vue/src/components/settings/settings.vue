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
  <div class="container-wide">
    <evan-loading v-if="loading"></evan-loading>
    <template v-else>
      <div class="d-flex mb-5 align-items-center">
        <div style="width: calc(100% - 200px)">
          <h3 class="font-weight-bold mb-0 force-oneline bg-level-3">
            {{ '_profile.settings.desc' | translate }}
          </h3>
        </div>
      </div>

      <div class="white-box border-smooth rounded p-4">
        <label for="language">
          {{ `_profile.settings.language` | translate }}
        </label>
        <select class="form-control custom-select"
          id="language" ref="language"
          v-model="language"
          @change="languageChanged()">
          <option value="">{{ '_profile.settings.languages.browser' | translate }}</option>
          <option value="de">{{ '_profile.settings.languages.de' | translate }}</option>
          <option value="en">{{ '_profile.settings.languages.en' | translate }}</option>
        </select>
        <span class="text-muted small">
          {{ '_profile.settings.reload-hint' | translate }}
        </span>
      </div>

      <div class="white-box border-smooth rounded p-4 mt-3">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="devMode"
            v-model="devMode"
            @change="devModeChanged()">
          <label class="form-check-label" for="devMode">
            {{  '_profile.settings.developer-mode' | translate }}
          </label>
        </div>

        <template v-if="devMode">
          <div class="d-flex align-items-center mt-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="devDomainEnabled"
                v-model="devDomainEnabled"
                @change="devDomainChanged()">
            </div>
            <div class="form-group w-100">
              <label for="devDomain">
                {{ `_profile.settings.dev-domain.title` | translate }}
              </label>
              <input class="form-control"
                id="devDomain" ref="devDomain"
                :placeholder="`_profile.settings.dev-domain.desc` | translate"
                :disabled="!devDomainEnabled"
                v-model="devDomain"
                @change="devDomainChanged()">
            </div>
          </div>
          <span class="text-muted small">
            {{ '_profile.settings.dev-domain.desc' | translate }}
          </span>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './settings';
  export default Component;
</script>

