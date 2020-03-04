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
      v-if="creatingProfile"
      :active-step="creatingProfile"
      :type="profileForm.accountType.value"
      :maximum-steps="5"
    />
    <evan-onboarding-layout-wrapper
      v-else
      :type="`sign-up.${ profileForm.accountType.value }`"
      :step="activeStep"
      :images="getLeftPanelImages()"
    >
      <div>
        <div v-if="!onboardedDialog">
          <h4 class="text-center text-uppercase font-weight-bold">
            {{ '_onboarding.sign-up.create-account' | translate }}
          </h4>
          <evan-steps
            class="text-center my-3"
            minimal="true"
            :active-step="activeStep"
            :steps="steps"
            @stepChange="activeStep = $event"
          />
          <div v-if="activeStep === 0">
            <p class="text-center mt-3 mb-0">
              {{ '_onboarding.sign-up.steps.base.desc' | translate }}
            </p>

            <evan-form
              class="mt-3 mb-2"
              :i18n-scope="'_onboarding.sign-up'"
              :only-form="true"
              :stacked="true"
              :form="profileForm"
            />
          </div>
          <div v-if="profileForm.accountType.value === 'company'">
            <p
              v-if="activeStep === 1"
              class="text-center mt-3 mb-0"
            >
              {{ '_onboarding.sign-up.steps.company.registration.desc' | translate }}
            </p>
            <p
              v-if="activeStep === 2"
              class="text-center mt-3 mb-0"
            >
              {{ '_onboarding.sign-up.steps.company.contact.desc' | translate }}
            </p>

            <!-- don't hide them, so formular validity checks will be done correctly -->
            <profile-company-contact
              ref="companyContact"
              class="mt-3 mb-2"
              :address="address"
              :class="{ 'd-none': activeStep !== 1 }"
              :data="userData.contact || { }"
              only-form="true"
              stacked="true"
              @countryChanged="userData.contact.country = $event;"
            />
            <profile-company-registration
              ref="companyRegistration"
              class="mt-3 mb-2"
              :address="address"
              :class="{ 'd-none': activeStep !== 2 || activeStep === (steps.length - 1) }"
              :data="userData.registration || { }"
              only-form="true"
              stacked="true"
            />
          </div>
          <div v-if="activeStep === (steps.length - 1)">
            <p class="text-center mb-3">
              {{ '_onboarding.sign-up.steps.captcha.desc' | translate }}
            </p>

            <profile-captcha-terms :sign-up-comp="this" />
            <div class="d-flex justify-content-between text-center">
              <evan-button
                class="mr-3"
                type="secondary"
                @click="activeStep--"
              >
                {{ '_onboarding.back' | translate }}
              </evan-button>
              <evan-button
                :disabled="!recaptchaToken || !termsAccepted.value"
                class="btn-block"
                type="primary"
                @click="createProfile()"
              >
                {{ '_onboarding.sign-up.create-profile.title' | translate }}
              </evan-button>
            </div>
          </div>
          <div v-else>
            <div class="d-flex justify-content-between text-center">
              <evan-button
                v-if="activeStep !== 0"
                class="mr-3"
                type="secondary"
                @click="activeStep--"
              >
                {{ '_onboarding.back' | translate }}
              </evan-button>
              <span
                v-else
                class="mx-auto"
              />
              <evan-button
                :disabled="steps[activeStep + 1] && steps[activeStep + 1].disabled()"
                class="btn-block"
                type="primary"
                @click="activeStep++"
              >
                {{ '_onboarding.continue' | translate }}
              </evan-button>
            </div>

            <p
              class="text-center mt-5"
              v-html="$t(`_onboarding.sign-up.already-signed-up`)"
            />
          </div>
        </div>
        <div v-else>
          <h5 class="text-center">
            {{ '_onboarding.sign-up.welcome-desc' | translate }}
          </h5>

          <evan-onboarding-accept-contact :load-alias="true" />
        </div>
      </div>
    </evan-onboarding-layout-wrapper>
    <evan-modal
      ref="creatingProfileError"
    >
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
import SignUp from './sign-up';

export default SignUp;
</script>
