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
        <h4 class="text-center text-uppercase font-weight-bold">
          {{ '_onboarding.sign-up.twin.create' | translate }}
        </h4>
        <evan-steps class="text-center my-3"
          :activeStep="activeStep"
          :steps="twinSteps"
          @stepChange="activeStep = $event"
          minimal="true"
          v-if="activeStep !== twinSteps.length"
        />
        <div v-if="activeStep === 0">
          <p class="text-center mb-0">
            {{ '_onboarding.sign-up.twin.steps.dbcp.desc' | translate }}
          </p>

          <evan-form
            :form="twinDbcpForm"
            :i18nScope="'_onboarding.sign-up.twin.dbcp'"
            :onlyForm="true"
            :stacked="true"
            class="my-3">
          </evan-form>
        </div>
        <template v-if="!rerenderSteps">
          <div
            v-for="(step, index) in dataSetSteps()"
            :key="index"
            :class="{ 'd-none': activeStep !== twinSteps.indexOf(step) }">
            <p class="text-center"
              v-if="twinSteps[activeStep]">
              {{ twinSteps[activeStep].description }}
            </p>

            <twin-data-set-form
              ref="stepForm"
              :data="step.dataSetSpecs.data"
              :dataSchema="step.dataSetSpecs.dataSchema"
              :dataSetName="step.dataSetSpecs.dataSetName"
              :description="step.dataSetSpecs.description"
            />

            <p class="d-block text-center mb-4 text-muted font-italic"
              v-if="twinSteps[activeStep]">
              {{ '_onboarding.sign-up.twin.further-changes' | translate }}
            </p>
          </div>
        </template>
        <div v-if="activeStep === twinSteps.length">
          <p class="text-center mb-0">
            {{ '_onboarding.sign-up.twin.steps.finish.desc' | translate }}
          </p>

          <evan-form
            :form="profileForm"
            :i18nScope="'_onboarding.sign-up'"
            :onlyForm="true"
            :stacked="true"
            class="mt-3">
            <template v-slot:form-control-accountType>
              <div class="d-none" />
            </template>
          </evan-form>

          <profile-captcha-terms :signUpComp="this" />
          <div class="d-flex justify-content-between text-center">
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

        <div class="d-flex justify-content-between text-center" v-else>
          <evan-button
            :href="activeStep === 0 ? 'https://evan.network' : ''"
            @click="activeStep !== 0 && activeStep--"
            class="mr-3"
            type="secondary">
            <template v-if="activeStep === 0">{{ '_onboarding.back-to-website' | translate }}</template>
            <template v-else>{{ '_onboarding.back' | translate }}</template>
          </evan-button>
          <evan-button
            :disabled="twinSteps[activeStep + 1] && twinSteps[activeStep + 1].disabled()"
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


