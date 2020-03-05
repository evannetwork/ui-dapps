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
  <div
    class="row h-100"
    style="display: grid"
  >
    <evan-onboarding-layout-wrapper
      type="sign-in"
      :step="activeStep"
      :images="[ '10.svg', '13.svg' ]"
    >
      <div class="evan-steps">
        <div
          v-if="activeStep === 0"
          class="step"
        >
          <h4
            class="text-center text-uppercase font-weight-bold"
          >
            {{ '_onboarding.sign-in.title' | translate }}
          </h4>
          <p
            class="text-center mb-0"
            v-html="$t(`_onboarding.sign-in.get-mnemonic-desc`)"
          />

          <h5
            class="text-center text-uppercase font-weight-bold mt-5"
          >
            {{ '_onboarding.sign-in.recovery-key' | translate }}
          </h5>

          <evan-onboarding-mnemonic
            class="my-3"
            :mnemonic.sync="mnemonic"
            :valid.sync="validMnemonic"
            @submit="setMnemonic()"
          />

          <small
            v-if="!profileExists"
            class="text-danger"
          >{{ '_onboarding.sign-in.no-profile-desc' | translate }}</small>

          <div class="text-center">
            <button
              v-if="!checking"
              id="sign-in"
              type="button"
              class="btn btn-block btn-primary"
              :disabled="!validMnemonic"
              @click="setMnemonic()"
            >
              {{ '_onboarding.sign-in.next' | translate }}
            </button>
            <evan-loading v-if="checking" />
          </div>

          <div class="text-center mt-5">
            <span>{{ '_onboarding.sign-in.not-signed-up' | translate }}</span>
            <router-link :to="{ name: 'sign-up', query: $route.query}">
              {{ '_onboarding.sign-up.create-profile.title' | translate }}
            </router-link>
          </div>
        </div>

        <div
          v-if="activeStep === 1"
          class="step"
        >
          <evan-login
            :account-id="accountId"
            :mnemonic="mnemonic"
            :show-signup="true"
          />
        </div>

        <div
          v-if="activeStep === 2"
          class="step"
        >
          <h5 class="text-center">
            {{ '_onboarding.sign-in.welcome-desc' | translate }}
          </h5>

          <evan-onboarding-accept-contact :load-alias="true" />
        </div>
      </div>
    </evan-onboarding-layout-wrapper>
  </div>
</template>


<script lang="ts">
import SignIn from './sign-in';

export default SignIn;
</script>
