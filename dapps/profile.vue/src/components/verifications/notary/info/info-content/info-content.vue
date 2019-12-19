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
    <b class="d-block">{{'_profile.verifications.notary.request.why.title' | translate}}</b>
    <p class="mb-4">
      {{ $t('_profile.verifications.notary.request.why.description', { accountId: address }) }}
      <a href="https://evannetwork.github.io/docs/first_steps/power_apps/notary-verification.html"
        class="text-link" target="_blank" rel="noreferer noopener">
        {{'_profile.verifications.notary.request.why.link' | translate}}
      </a>
    </p>

    <b class="d-block">{{'_profile.verifications.notary.request.who.title' | translate}}</b>
    <p class="mb-4">
      {{'_profile.verifications.notary.request.who.description' | translate}}
      <a href="https://evannetwork.github.io/docs/first_steps/power_apps/notary-verification.html"
        class="text-link" target="_blank" rel="noreferer noopener">
        {{'_profile.verifications.notary.request.who.link' | translate}}
      </a>
    </p>

    <p class="w-100"
      v-if="!enoughFunds && readableFunds"
      v-html="$t(`_profile.verifications.notary.request.not-enough-funds`,{readableFunds})">
    </p>

    <b class="d-block mb-1">{{'_profile.verifications.notary.request.how.title' | translate}}</b>
    <div class="row mr-0">
      <div class="col-md-4"
        v-for="(key) in ['1', '2', '3']" :key="key">
        <div class="bg-level-2 h-100 py-5 px-3">
          <div class="d-flex align-items-center mb-3">
            <small class="
              mr-3
              border rounded-circle border-dark
              d-flex align-items-center justify-content-center"
              style="width: 24px; height: 24px;">
              {{ key }}
            </small>
            <small class="font-weight-semibold">
              {{`_profile.verifications.notary.request.how.steps.${key}.title` | translate}}
            </small>
          </div>
          <small class="mt-3">
            {{`_profile.verifications.notary.request.how.steps.${key}.description` | translate }}
          </small>
        </div>
      </div>
    </div>

    <b class="d-block mt-4">
      {{'_profile.verifications.notary.request.costs.title' | translate}}
    </b>
    <p class="mb-4">{{'_profile.verifications.notary.request.costs.description' | translate}}</p>
  </div>
</template>

<script lang="ts">
  import Component from './info-content';
  export default Component;
</script>