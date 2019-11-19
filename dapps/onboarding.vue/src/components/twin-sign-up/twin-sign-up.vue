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
    <div class="col-12 d-flex justify-content-center align-items-center"
      v-if="creatingProfile">
      <div>
        <template v-if="creatingProfile < 6">
          <div>
            <img class="img-fluid"
              style="max-width: 390px"
              :src="`${ $store.state.onboardingBaseUrl }/assets/left-panel/${ images[creatingProfile - 1] }`">
          </div>
          <div style="height: 10px; min-width: 390px;" class="mx-auto progress my-3 bg-white">
            <div
              class="progress-bar"
              role="progressbar"
              :style="{width: `${(creatingProfile * 20)}%`}"
            ></div>
          </div>
          <h5 class="font-weight-bold mt-5 text-center">
            {{ `_onboarding.sign-up.create-profile-twin.status-${ creatingProfile}` | translate }}
          </h5>
        </template>
        <div v-else class="h-100 d-flex align-items-center justify-content-center">
          <evan-success></evan-success>
        </div>
      </div>
    </div>
    <evan-onboarding-layout-wrapper v-else
      type="twin-sign-up"
      :step="activeStep"
      :images="[ '1.svg', '2.svg', '3.svg', '13.svg' ]">
      <div>
        <h4 class="text-center mt-4 mb-3 text-uppercase font-weight-bold">
          {{ '_onboarding.sign-up.twin.create' | translate }}
        </h4>
        <evan-steps class="text-center"
          :activeStep="activeStep"
          :steps="steps"
          @stepChange="activeStep = $event"
          minimal="true"
          v-if="activeStep !== steps.length"
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
        <template v-if="!rerenderSteps">
          <div
            v-for="(step, index) in dataSetSteps()"
            :key="index"
            :class="{ 'd-none': activeStep !== steps.indexOf(step) }">
            <p class="text-center mt-3 mb-4"
              v-if="steps[activeStep]">
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
        </template>
        <div v-if="activeStep === steps.length">
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
          <div class="d-flex justify-content-between text-center mt-5">
            <evan-button
              @click="activeStep--"
              class="mr-3"
              type="secondary">
              {{ '_onboarding.back' | translate }}
            </evan-button>
            <evan-button
              :disabled="!(recaptchaToken && termsAccepted.value && profileForm.isValid)"
              @click="createOfflineTwin()"
              class="btn-block"
              type="primary">
              {{ '_onboarding.sign-up.create-profile.title' | translate }}
            </evan-button>
          </div>
        </div>

        <div class="d-flex justify-content-between text-center mt-5" v-else>
          <evan-button
            :href="activeStep === 0 ? 'https://evan.network' : ''"
            @click="activeStep !== 0 && activeStep--"
            class="mr-3"
            type="secondary">
            <template v-if="activeStep === 0">{{ '_onboarding.back-to-website' | translate }}</template>
            <template v-else>{{ '_onboarding.back' | translate }}</template>
          </evan-button>
          <evan-button
            :disabled="steps[activeStep + 1] && steps[activeStep + 1].disabled()"
            @click="activeStep++"
            class="btn-block"
            type="primary">
            {{ '_onboarding.continue' | translate }}
          </evan-button>
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
  import Component from './twin-sign-up';
  export default Component;
</script>


