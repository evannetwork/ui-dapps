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
  <div class="row h-100">
    <evan-profile-creating :creatingProfile="creatingProfile" v-if="creatingProfile" />
    <evan-onboarding-layout-wrapper v-else
      type="twin-sign-up"
      :step="activeStep">
      <div>
        <h4 class="text-center mt-4 mb-3 text-uppercase font-weight-bold">
          {{ '_onboarding.sign-up.twin.create' | translate }}
        </h4>
        <evan-steps class="text-center"
          minimal="true"
          :activeStep="activeStep"
          :steps="steps"
          @stepChange="activeStep = $event"
        />
        <div v-if="activeStep === 0">
          <p class="text-center mt-3 mb-4">
            {{ '_onboarding.sign-up.twin.steps.dbcp.desc' | translate }}
          </p>

          <evan-form
            :i18nScope="'_onboarding.sign-up.twin.dbcp'"
            :onlyForm="true"
            :stacked="true"
            :form="twinDbcpForm">
          </evan-form>
        </div>
        <div v-if="activeStep === 1">
          <p class="text-center mt-3 mb-4">
            {{ '_onboarding.sign-up.twin.steps.metadata.desc' | translate }}
          </p>
          
          <div class="row">
            <div class="col-6">{{ '_onboarding.sign-up.twin.metadata.notation' | translate }}</div>
            <div class="col-6 text-right">{{ '_onboarding.sign-up.twin.metadata.value' | translate }}</div>
          </div>
          <evan-form
            :i18nScope="'_onboarding.sign-up.twin.metadata'"
            :onlyForm="true"
            :stacked="true"
            :form="metadataForm">
          </evan-form>
        </div>
        <div v-if="activeStep === 2">
          <p class="text-center mt-3 mb-4">
            {{ '_onboarding.sign-up.twin.steps.list.desc' | translate }}
          </p>

          <div class="row">
            <div class="col-4">{{ '_onboarding.sign-up.twin.list.date' | translate }}</div>
            <div class="col-4 text-center">{{ '_onboarding.sign-up.twin.list.description' | translate }}</div>
            <div class="col-4 text-right">{{ '_onboarding.sign-up.twin.list.value' | translate }}</div>
          </div>
          <evan-form
            :i18nScope="'_onboarding.sign-up.twin.list'"
            :onlyForm="true"
            :stacked="true"
            :form="listForm">
          </evan-form>
        </div>
        <div v-if="activeStep === 3">
          <p class="text-center mt-3 mb-4">
            {{ '_onboarding.sign-up.twin.steps.finish.desc' | translate }}
          </p>

          <evan-form
            :i18nScope="'_onboarding.sign-up'"
            :onlyForm="true"
            :stacked="true"
            :form="profileForm">
            <template v-slot:form-control-accountType>
              <div class="d-none" />
            </template>
          </evan-form>

          <profile-captcha-terms :signUpComp="this" />

          <div class="text-center">
            <button type="button" class="btn btn-primary btn-block"
              :disabled="!recaptchaToken || !termsAccepted.value"
              @click="createProfile()">
              {{ '_onboarding.sign-up.create-profile.title' | translate }}
            </button>
          </div>
        </div>

        <div class="text-center mt-5" v-else>
          <button type="submit" class="btn btn-primary btn-block"
            :disabled="steps[activeStep + 1] && steps[activeStep + 1].disabled()"
            @click="activeStep++">
            {{ '_onboarding.continue' | translate }}
          </button>
        </div>
      </div>
    </evan-onboarding-layout-wrapper>
  </div>
</template>

<script lang="ts">
  import Component from './twin-sign-up.ts';
  export default Component;
</script>


