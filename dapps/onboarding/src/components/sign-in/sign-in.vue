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
    <div class="d-flex p-2 align-items-center">
      <button class="btn btn-lg"
        @click="$router.push({ name: 'welcome', query: $route.query })">
        <i class="mdi mdi-chevron-left"></i>
      </button>

      <h4 class="m-0 ml-3">{{ '_onboarding.sign-in.title' | translate }}</h4>
    </div>

    <div class="evan-steps border-top p-3">
      <div class="evan-step-header">
        <button class="btn"
          v-for="(step, index) of steps"
          :disabled="index !== activeStep && activeSteps.indexOf(index) === -1"
          @click="activeStep = index">
          <span class="stepper-circle"
            :class="{
              'bg-primary': activeStep === index,
              'bg-secondary': activeStep !== index,
            }">
            {{ index + 1}}
          </span>
          <span>{{ step | translate }}</span>
        </button>
      </div>
      <div class="pt-3 pb-3">
        <div class="step" v-if="activeStep === 0">
          <h5 class="text-center mt-4 mb-4">
            {{ '_onboarding.sign-in.get-mnemonic-desc' | translate }}
          </h5>

          <evan-onboarding-mnemonic
            :mnemonic.sync="mnemonic"
            :valid.sync="validMnemonic"
            v-on:submit="setMnemonic()">
          </evan-onboarding-mnemonic>

          <evan-modal ref="notOnboarded">
            <template v-slot:header>
              <h5 class="modal-title">
                {{ '_onboarding.sign-in.no-profile' | translate }}
              </h5>
            </template>
            <template v-slot:body>
              <p v-html="$t('_onboarding.sign-in.no-profile-desc')"></p>
            </template>
            <template v-slot:footer>
              <button type="button" class="btn btn-rounded btn-primary"
                @click="openSignupWithMnemonic()">
                {{ '_onboarding.sign-in.title' | translate }}
              </button>
            </template>
          </evan-modal>

          <div class="text-center mt-4">
            <button type="button" class="btn btn-rounded btn-primary"
              v-if="!checking"
              :disabled="!validMnemonic"
              @click="setMnemonic()">
              {{ '_onboarding.sign-in.title' | translate }}
            </button>
            <evan-loading v-if="checking"></evan-loading>
          </div>
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
              <button type="submit" class="btn btn-rounded btn-primary"
                :disabled="form.password.value.length < 8 || checking">
                <span class="spinner-border spinner-border-sm mr-3" role="status" aria-hidden="true"
                  v-if="checking">
                </span>
                {{ '_evan.use-password' | translate }}
              </button>
            </div>
          </form>
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
</template>


<script lang="ts">
  import SignIn from './sign-in.ts';
  export default SignIn;
</script>
