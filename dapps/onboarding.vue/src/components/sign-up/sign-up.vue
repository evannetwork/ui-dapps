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
    <evan-profile-creating :maximumSteps="5" :creatingProfile="creatingProfile" v-if="creatingProfile" />
    <evan-onboarding-layout-wrapper v-else
      :type="`sign-up.${ profileForm.accountType.value }`"
      :step="activeStep">
      <div>
        <h4 class="text-center mt-4 mb-3 text-uppercase font-weight-bold">
          {{ '_onboarding.sign-up.create-account' | translate }}
        </h4>
        <evan-steps class="text-center"
          minimal="true"
          :activeStep="activeStep"
          :steps="steps"
          @stepChange="activeStep = $event"
        />
        <div v-if="activeStep === 0">
          <p class="text-center mt-3 mb-4">
            {{ '_onboarding.sign-up.steps.base.desc' | translate }}
          </p>

          <evan-form
            :i18nScope="'_onboarding.sign-up'"
            :onlyForm="true"
            :stacked="true"
            :form="profileForm"
          />
        </div>
        <div v-if="profileForm.accountType.value === 'company'">
          <p class="text-center mt-3 mb-4" v-if="activeStep === 1">
            {{ '_onboarding.sign-up.steps.company.registration.desc' | translate }}
          </p>
          <p class="text-center mt-3 mb-4" v-if="activeStep === 2">
            {{ '_onboarding.sign-up.steps.company.contact.desc' | translate }}
          </p>

          <!-- don't hide them, so formular validity checks will be done correctly -->
          <profile-company-registration
            ref="companyRegistration"
            onlyForm="true"
            stacked="true"
            :address="address"
            :class="{ 'd-none': activeStep !== 1 }"
            :data="userData.registration || { }">
          </profile-company-registration>
          <profile-company-contact
            ref="companyContact"
            onlyForm="true"
            stacked="true"
            :address="address"
            :class="{ 'd-none': activeStep !== 2 }"
            :data="userData.contact || { }">
          </profile-company-contact>
        </div>
        <div v-if="activeStep === (steps.length - 1)">
          <p class="text-center mb-8">
            {{ '_onboarding.sign-up.steps.captcha.desc' | translate }}
          </p>

          <profile-captcha-terms :signUpComp="this" />

          <div class="d-flex justify-content-center mt-3">
            <vue-recaptcha id="evan-recaptcha"
              v-if="!initialzing"
              ref="recaptcha"
              :sitekey="recaptchaId"
              theme="light"
              @verify="onCaptchaVerified"
              @expired="onCaptchaExpired">
            </vue-recaptcha>
          </div>
          <div class="text-center mt-8">
            <button type="button" class="btn  btn-primary btn-block"
              :disabled="!recaptchaToken || !termsAccepted.value"
              @click="createProfile()">
              {{ '_onboarding.sign-up.create-profile.title' | translate }}
            </button>
          </div>
        </div>
        <div class="text-center" v-else>
          <button type="submit" class="btn  btn-primary btn-block"
            :disabled="steps[activeStep + 1] && steps[activeStep + 1].disabled()"
            @click="activeStep++">
            {{ '_onboarding.continue' | translate }}
          </button>

          <p class="text-center mt-5" v-html="$t(`_onboarding.sign-up.already-signed-up`)"></p>
        </div>

        <div v-if="onboardedDialog">
          <h5 class="text-center mt-4 mb-4">
            {{ '_onboarding.sign-up.welcome-desc' | translate }}
          </h5>

          <evan-onboarding-accept-contact :loadAlias="true" />
        </div>
      </div>
    </evan-onboarding-layout-wrapper>
    <evan-modal
      ref="modal"
      :hideFooterButton="true"
      :maxWidth="'800px'"
      @close="navigateToEvan();"
      disableBackdrop="true">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_onboarding.sign-up.get-mnemonic' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <div>
          <p v-html="$t('_onboarding.sign-up.get-mnemonic-desc-long')">
          </p>
          <h3 class="text-danger text-center">{{ mnemonic }}</h3>
        </div>
      </template>
      <template v-slot:footer>
        <evan-button type="secondary"
          id="modal-cancel"
          @click="navigateToEvan();">
          {{ '_evan.view-profile' | translate }}
        </evan-button>
      </template>
    </evan-modal>
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
  import SignUp from './sign-up.ts';
  export default SignUp;
</script>


