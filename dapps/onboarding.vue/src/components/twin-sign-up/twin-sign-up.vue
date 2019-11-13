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
    <evan-profile-creating
      :activeStep="creatingProfile"
      :maximumSteps="6"
      :customSteps="{
        5: {
          picture: $store.state.onboardingBaseUrl + '/assets/creating_twin.png',
          text: $t('_onboarding.sign-up.twin.creating'),
        },
      }"
      v-if="creatingProfile"
    />
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
        <div
          v-for="(step, index) in steps"
          v-if="!rerenderSteps && index > 0 && index < steps.length - 1"
          :class="{ 'd-none': activeStep !== index }">
          <p class="text-center mt-3 mb-4">
            {{ steps[activeStep].description }}
          </p>

          <twin-data-set-form
            ref="stepForm"
            :data="step.dataSetSpecs.data"
            :dataSchema="step.dataSetSpecs.dataSchema"
            :dataSetName="step.dataSetSpecs.dataSetName"
            :description="step.dataSetSpecs.description"
          />
        </div>
        <div v-if="activeStep === steps.length - 1">
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
              @click="createOfflineTwin()">
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
    <evan-modal
      ref="creatingProfileError">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_onboarding.sign-up.profile-create-error.title' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <p>{{ '_onboarding.sign-up.profile-create-error.desc' | translate }}</p>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './twin-sign-up.ts';
  export default Component;
</script>


