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
  <div class="
    container mx-auto m-5 p-0
    border bg-level-1">
    <evan-loading v-if="loading"></evan-loading>
    <template v-if="!loading">
      <div class="d-flex p-2 align-items-center">
        <button class="btn btn-lg"
          v-if="!creatingProfile"
          @click="$router.push({ name: 'welcome', query: $route.query })">
          <i class="mdi mdi-chevron-left"></i>
        </button>

        <h4 class="m-0 ml-3">{{ '_onboarding.sign-up.title' | translate }}</h4>
      </div>

      <div class="evan-steps border-top p-3">
        <div class="evan-step-header">
          <button class="btn"
            v-for="(step, index) of steps"
            :disabled="step.disabled(this)"
            @click="activeStep = index">
            <span class="stepper-circle"
              :class="{
                'bg-primary': activeStep === index,
                'bg-secondary': activeStep !== index,
              }">
              {{ index + 1}}
            </span>
            <span>{{ step.title | translate }}</span>
          </button>
        </div>
        <div class="pt-3 pb-3">
          <div class="step" v-if="activeStep === 0">
            <h5 class="text-center mt-4 mb-4">
              {{ '_onboarding.sign-up.profile-informations-desc' | translate }}
            </h5>

            <form class="p-4" v-on:submit.prevent="useProfile">
              <div class="form-group">
                <label for="userName">
                  {{ '_onboarding.sign-up.user-name' | translate }}
                </label>
                <input class="form-control" required
                  id="userName" ref="userName"
                  :placeholder="'_onboarding.sign-up.user-name' | translate"
                  v-model="profileForm.userName.value"
                  :class="{ 'is-invalid' : profileForm.userName.error }"
                  @blur="profileForm.userName.setDirty()">
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
                  :placeholder="('_onboarding.sign-up.password' + index) | translate"
                  v-model="profileForm[`password${ index }`].value"
                  :class="{ 'is-invalid' : profileForm[`password${ index }`].error }"
                  @input="profileForm[`password${ index }`].setDirty()">
                <div class="invalid-feedback">
                  {{ profileForm[`password${ index }`].error | translate }}
                </div>
              </div>

              <div class="text-center">
                <button type="submit" class="btn btn-rounded btn-primary"
                  :disabled="!profileForm.isValid">
                  {{ '_onboarding.continue' | translate }}
                </button>
              </div>
            </form>
          </div>
          <div class="step" v-if="activeStep === 1">
            <h5 class="text-center mt-4 mb-4">
              {{ '_onboarding.sign-up.get-mnemonic-desc' | translate }}
            </h5>
            <div class="bg-level-3 p-3 mt-3 mb-3 border"
              v-html="$t('_onboarding.sign-up.get-mnemonic-desc-long')">
            </div>

            <evan-onboarding-mnemonic
              ref="mnemonic"
              :mnemonic.sync="mnemonic"
              :valid.sync="validMnemonic"
              :disabled="true"
              v-on:submit="useMnemonic()">
            </evan-onboarding-mnemonic>

            <div>
              <div class="text-center mt-4">
                <button type="button" class="btn btn-outline-secondary btn-rounded"
                  v-if="mnemonicRiddle"
                  @click="cancelRiddle()">
                  {{ '_onboarding.sign-up.cancel-riddle' | translate }}
                </button>
                <button type="button" class="btn btn-rounded btn-primary"
                  :disabled="!validMnemonic"
                  @click="useMnemonic()">
                  {{ '_onboarding.continue' | translate }}
                </button>
                <evan-loading v-if="checking"></evan-loading>
              </div>
            </div>
          </div>
          <div class="step" v-if="activeStep === 2">
            <template v-if="!creatingProfile">
              <h5 class="text-center mt-4 mb-4">
                {{ '_onboarding.sign-up.create-profile.desc' | translate }}
              </h5>

              <div class="bg-level-3 p-3 mt-3 mb-3 border"
                v-html="$t('_onboarding.sign-up.create-profile.long')">
              </div>

              <div class="bg-level-3 p-3 mt-3 mb-3 border"
                v-html="termsOfUse">
              </div>

              <div class="d-flex justify-content-center mb-3">
                <vue-recaptcha class="evan-recaptcha"
                  v-if="!initialzing"
                  ref="recaptcha"
                  sitekey="6LfoK1IUAAAAAOK0EbTv-IqtBq2NS-bvKWcUbm8r"
                  theme="light"
                  @verify="onCaptchaVerified"
                  @expired="onCaptchaExpired">
                </vue-recaptcha>
              </div>
            </template>

            <evan-modal ref="creatingProfileError">
              <template v-slot:body>
                <p>{{ '_onboarding.sign-up.profile-create-error.desc' | translate }}</p>
              </template>
            </evan-modal>

            <div class="evan-padding text-center"
              v-if="creatingProfile">
              <template  v-if="creatingProfile !== 5">
                <evan-loading></evan-loading>
                <h5>
                  {{ ('_onboarding.sign-up.create-profile.status-' + creatingProfile) | translate }}
                </h5>
                <p>
                  {{ $t('_onboarding.sign-up.create-profile.creation-time', { creationTime: creationTime }) }}
                </p>
                <div class="bg-inverted mx-auto p-5 col-md-6">
                  <img class="img-fluid col-md-8"
                    :src="$store.state.onboardingBaseUrl + '/assets/creating_' + creatingProfile + '.png'">
                </div>
              </template>
              <evan-success v-if="creatingProfile === 5"></evan-success>
            </div>

            <div class="text-center"
              v-if="!creatingProfile">
              <button type="button" class="btn btn-rounded btn-primary"
                :disabled="!recaptchaToken"
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
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import SignUp from './sign-up.ts';
  export default SignUp;
</script>


