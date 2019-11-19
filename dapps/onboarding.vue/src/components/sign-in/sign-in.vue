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
  <div class="row h-100" style="display: grid">
    <evan-onboarding-layout-wrapper
      type="sign-in"
      :step="activeStep"
      :images="[ '10.svg', '13.svg' ]">
      <div class="evan-steps">
        <div class="step" v-if="activeStep === 0">
          <h4
            class="text-center mt-4 mb-3 text-uppercase font-weight-bold"
          >{{ '_onboarding.sign-in.title' | translate }}</h4>
          <p class="text-center mt-3 mb-4" v-html="$t(`_onboarding.sign-in.get-mnemonic-desc`)"></p>

          <h5
            class="text-center mt-4 mb-3 text-uppercase font-weight-bold"
          >{{ '_onboarding.sign-in.recovery-key' | translate }}</h5>

          <evan-onboarding-mnemonic
            :mnemonic.sync="mnemonic"
            :valid.sync="validMnemonic"
            v-on:submit="setMnemonic()"
          ></evan-onboarding-mnemonic>

          <small
            class="text-danger"
            v-if="!profileExists"
          >{{ '_onboarding.sign-in.no-profile-desc' | translate }}</small>

          <div class="text-center mt-4">
            <button
              type="button"
              class="btn btn-block btn-primary"
              id="sign-in"
              v-if="!checking"
              :disabled="!validMnemonic"
              @click="setMnemonic()"
            >{{ '_onboarding.sign-in.next' | translate }}</button>
            <evan-loading v-if="checking"></evan-loading>
          </div>

          <p class="text-center mt-5" v-html="$t(`_onboarding.sign-in.not-signed-up`)"></p>
        </div>

        <div class="step" v-if="activeStep === 1">
          <evan-login :accountId="accountId" :mnemonic="mnemonic" :showSignup="true"></evan-login>
        </div>

        <div class="step" v-if="activeStep === 2">
          <h5 class="text-center mt-4 mb-4">{{ '_onboarding.sign-in.welcome-desc' | translate }}</h5>

          <evan-onboarding-accept-contact :loadAlias="true"></evan-onboarding-accept-contact>
        </div>
      </div>
    </evan-onboarding-layout-wrapper>
  </div>
</template>


<script lang="ts">
import SignIn from "./sign-in";
export default SignIn;
</script>
