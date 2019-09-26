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
  <div class="row h-100">
    <div class="col-12 d-flex justify-content-center align-items-center"
      v-if="creatingProfile">
      <div>
        <template v-if="creatingProfile !== 5">
          <div>
            <img class="img-fluid"
              style="height: 526px;"
              :src="$store.state.onboardingBaseUrl + '/assets/creating_' + creatingProfile + '.png'">
          </div>
          <div style="height: 10px" class="mx-auto progress my-3 bg-white">
            <div
              class="progress-bar"
              role="progressbar"
              :style="{width: `${(creatingProfile * 20)}%`}"
            ></div>
          </div>
          <h5 class="font-weight-bold mt-5 text-center">
            {{ ('_onboarding.sign-up.create-profile.status-' + creatingProfile) | translate }}
          </h5>
        </template>
        <div v-if="creatingProfile === 5" class="h-100 d-flex align-items-center justify-content-center">
          <evan-success></evan-success>
        </div>
      </div>
    </div>
    <evan-onboarding-layout-wrapper v-else :step="activeStep">
      <div class="evan-steps">
        <h4 class="text-center mt-4 mb-3 text-uppercase font-weight-bold">
          {{ '_onboarding.sign-up.create-account' | translate }}
        </h4>
        <div class="evan-step-header-sm text-center">
          <button class="btn"
            v-for="(step, index) of steps"
            :class="{ 'active': activeStep === index, }"
            :disabled="step.disabled(this)"
            @click="activeStep = index">
            <span class="stepper-circle">
            </span>
          </button>
        </div>
        <div class="step" v-if="activeStep === 0">
          <p class="text-center mt-3 mb-4">
            {{ '_onboarding.sign-up.select-account-type' | translate }}
          </p>

          <form v-on:submit.prevent="useProfile">
            <div class="form-group">
              <label for="accountType">
                {{ '_onboarding.sign-up.account-type' | translate }}
              </label>
              <select class="form-control custom-select" required
                id="accountType" ref="accountType"
                :placeholder="'_onboarding.sign-up.account-type' | translate"
                v-model="profileForm.accountType.value"
                :class="{ 'is-invalid' : profileForm.accountType.error }"
                @blur="profileForm.accountType.setDirty()">
                <option value="unspecified">{{ '_onboarding.sign-up.account-types.unspecified' | translate }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="alias text-black">
                {{ '_onboarding.sign-up.alias' | translate }}
              </label>
              <input class="form-control" required
                id="alias" ref="alias"
                :placeholder="'_onboarding.sign-up.user-name' | translate"
                v-model="profileForm.alias.value"
                :class="{ 'is-invalid' : profileForm.alias.error }"
                @blur="profileForm.alias.setDirty()">
              <small class="form-text text-muted">
                {{ '_onboarding.sign-up.alias-help' | translate }}
              </small>
              <div class="invalid-feedback">
                {{ '_onboarding.sign-up.errors.user-name' | translate }}
              </div>
            </div>

            <div class="form-group"
              v-for="(_, index) in [ '', '' ]">
              <label for="password">
                {{ ('_onboarding.sign-up.password' + index) | translate }}
              </label>
              <input class="form-control" type="password" required
                :id="`password${ index }`" :ref="`password${ index }`"
                v-model="profileForm[`password${ index }`].value"
                :class="{ 'is-invalid' : profileForm[`password${ index }`].error }"
                @input="profileForm[`password${ index }`].setDirty()">
              <small class="form-text text-muted">
                {{ '_onboarding.sign-up.password-help' | translate }}
              </small>
              <div class="invalid-feedback">
                {{ profileForm[`password${ index }`].error | translate }}
              </div>
            </div>

            <div class="text-center mt-5">
              <button type="submit" class="btn  btn-primary btn-block"
                :disabled="!profileForm.isValid"
                @click="activeStep = 1">
                {{ '_onboarding.continue' | translate }}
              </button>
            </div>
          </form>

          <p class="text-center mt-5" v-html="$t(`_onboarding.sign-up.already-signed-up`)"></p>
        </div>
        <div class="step" v-if="activeStep === 1">
          <template v-if="!creatingProfile">
            <p class="text-center mt-4 mb-4">
              {{ '_onboarding.sign-up.create-profile.desc' | translate }}
            </p>
            <div class="d-flex justify-content-center mb-3">
              <vue-recaptcha id="evan-recaptcha"
                v-if="!initialzing"
                ref="recaptcha"
                :sitekey="recaptchaId"
                theme="light"
                @verify="onCaptchaVerified"
                @expired="onCaptchaExpired">
              </vue-recaptcha>
            </div>

            <div class="form-group text-center">
              <input type="checkbox" required
                id="termsAccepted" ref="termsAccepted"
                v-model="profileForm.termsAccepted.value"
                :class="{ 'is-invalid' : profileForm.termsAccepted.error }"
                @blur="profileForm.termsAccepted.setDirty()">
              <label
                for="termsAccepted"
                class="ml-3"
                v-html="$t(`_onboarding.sign-up.terms-accepted`)">
              </label>
              <div class="invalid-feedback">
                {{ '_onboarding.sign-up.errors.terms-accepted' | translate }}
              </div>
            </div>
          </template>

          <div class="text-center"
            v-if="!creatingProfile">
            <button type="button" class="btn  btn-primary btn-block"
              :disabled="!recaptchaToken || !profileForm.termsAccepted.value"
              @click="createProfile()">
              {{ '_onboarding.sign-up.create-profile.title' | translate }}
            </button>
          </div>
        </div>
        <div class="step" v-if="activeStep === 3">
          <h5 class="text-center mt-4 mb-4">
            {{ '_onboarding.sign-up.welcome-desc' | translate }}
          </h5>

          <evan-onboarding-accept-contact
            :loadAlias="true">
          </evan-onboarding-accept-contact>
        </div>
      </div>
    </evan-onboarding-layout-wrapper>
    <evan-modal
      ref="modal"
      :hideFooterButton="true"
      :maxWidth="'800px'"
      @close="navigateToEvan();">
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


