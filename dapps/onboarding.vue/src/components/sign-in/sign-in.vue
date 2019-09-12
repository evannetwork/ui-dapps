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
    <div class="col col-lg-6 bg-white">
      <img class="img-fluid col-2 mb-3"
        :src="$store.state.onboardingBaseUrl + `/assets/logo.png`">
      <img class="img-fluid col-8 offset-2 mb-5"
        :src="$store.state.onboardingBaseUrl + `/assets/sign-up-banner.png`">
      <h1 class="ml-5 mb-5 font-weight-bold text-dark" >{{ `_onboarding.sign-up.headings.header-${activeStep}` | translate }}</h1>
      <h3 class="ml-5 text-dark">{{ `_onboarding.sign-up.headings.desc-${activeStep}` | translate }}</h3>
    </div>
    <div class="col col-lg-6">
      <div class="container">
        <div class="evan-steps border-top p-3">
          <h4 class="text-center mt-4 mb-3 text-uppercase font-weight-bold">
            {{ '_onboarding.sign-in.title' | translate }}
          </h4>

          <div class="pt-3 pb-3 col-8 offset-2">
            <div class="step" v-if="activeStep === 0">
              <p class="text-center mt-3 mb-4" v-html="$t(`_onboarding.sign-in.get-mnemonic-desc`)">
              </p>

              <h5 class="text-center mt-4 mb-3 text-uppercase font-weight-bold">
                {{ '_onboarding.sign-in.recovery-key' | translate }}
              </h5>

              <evan-onboarding-mnemonic
                :mnemonic.sync="mnemonic"
                :valid.sync="validMnemonic"
                v-on:submit="setMnemonic()">
              </evan-onboarding-mnemonic>

              <small class="text-danger" v-if="!profileExists">
                {{ '_onboarding.sign-in.no-profile-desc' | translate }}
              </small>

              <div class="text-center mt-4">
                <button type="button" class="btn btn-block btn-primary"
                  id="sign-in"
                  v-if="!checking"
                  :disabled="!validMnemonic"
                  @click="setMnemonic()">
                  {{ '_onboarding.sign-in.next' | translate }}
                </button>
                <evan-loading v-if="checking"></evan-loading>
              </div>

              <p class="text-center mt-5" v-html="$t(`_onboarding.sign-in.not-signed-up`)"></p>
            </div>

            <div class="step" v-if="activeStep === 1">
              <h5 class="text-center mt-4 mb-4">
                {{ '_onboarding.sign-in.get-password-desc' | translate }}
              </h5>
              <form class="p-4" v-on:submit.prevent="checkPassword">
                <div class="form-group">
                  <label for="password">{{ '_evan.password' | translate }}</label>
                  <input class="form-control" type="password" required
                    id="password" ref="password"
                    :placeholder="'_evan.password-placeholder' | translate"
                    v-model="form.password.value"
                    :class="{ 'is-invalid' : form.password.touched && !form.password.valid }">
                  <div class="invalid-feedback">
                    {{ '_evan.invalid-password' | translate }}
                  </div>
                </div>

                <div class="text-center">
                  <button type="submit" class="btn btn-block btn-primary"
                    :disabled="form.password.value.length < 8 || checking">
                    <span class="spinner-border spinner-border-sm mr-3" role="status" aria-hidden="true"
                      v-if="checking">
                    </span>
                    {{ '_evan.use-password' | translate }}
                  </button>
                </div>
              </form>

              <p class="text-center mt-5" v-html="$t(`_onboarding.sign-in.not-signed-up`)"></p>
            </div>

            <div class="step" v-if="activeStep === 2">
               <h5 class="text-center mt-4 mb-4">
                {{ '_onboarding.sign-in.welcome-desc' | translate | translate }}
              </h5>

              <evan-onboarding-accept-contact
                :loadAlias="true">
              </evan-onboarding-accept-contact>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
  import SignIn from './sign-in.ts';
  export default SignIn;
</script>
