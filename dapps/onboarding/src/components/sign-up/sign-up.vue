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
  <div class="evan-onboarding-signup md-layout md-gutter md-alignment-center-center">
    <div class="md-layout-item md-size-60 md-medium-size-80 md-small-size-100">
      <md-toolbar class="md-accent" md-elevation="0">
        <md-button class="md-icon-button" 
          v-on:click="$router.push({ name: 'welcome', query: $route.query })">
          <md-icon>chevron_left</md-icon>
        </md-button>
        <h3>{{ '_onboarding.sign-up.title' | translate }}</h3>
      </md-toolbar>

      <!-- <md-steppers md-vertical md-linear
        :md-active-step.sync="steps.active">
        <md-step id="profile"
          :md-done.sync="steps.profile"
          :md-editable="!creatingProfile"
          :md-label="'_onboarding.sign-up.profile-informations' | translate"
          :md-description="'_onboarding.sign-up.profile-informations-desc' | translate">
          <div class="evan-content evan-padding">
            <md-field
              :class="profileForm.errors.userName ? 'md-invalid' : ''">
              <label>{{ '_onboarding.sign-up.user-name' | translate }}</label>
              <md-input required
                ref="userName"
                v-model="profileForm.userName"
                @keyup.enter.native="useProfile()"
                @input="userNameChanged()">
              </md-input>
              <span class="md-error" v-if="profileForm.errors.userName">
                {{ '_onboarding.sign-up.errors.user-name' | translate }}
              </span>
            </md-field>
            <md-field
              v-for="(password, index) in profileForm.passwords"
              :class="profileForm.errors.passwords[index] ? 'md-invalid' : ''">
              <label>{{ ('_onboarding.sign-up.password' + index) | translate }}</label>
              <md-input required type="password" 
                v-model="profileForm.passwords[index]"
                @keyup.enter.native="useProfile()"
                @input="passwordChanged(index)">
              </md-input>
              <span class="md-error" v-if="profileForm.errors.passwords[index]">
                {{ profileForm.errors.passwords[index] | translate }}
              </span>
            </md-field>
          </div>
          <div class="md-layout md-gutter md-alignment-center-center evan-margin-top">
            <md-button class="md-raised evan-round evan-primary"
              :disabled="!profileForm.isValid"
              @click="useProfile()">
              {{ '_onboarding.continue' | translate }}
            </md-button>
          </div>
        </md-step>

        <md-step id="mnemonic"
          :md-done.sync="steps.mnemonic"
          :md-editable="!creatingProfile"
          :md-label="'_onboarding.sign-up.get-mnemonic' | translate"
          :md-description="'_onboarding.sign-up.get-mnemonic-desc' | translate">
          <div class="md-layout-item evan-content evan-warn evan-padding"
            v-html="$t('_onboarding.sign-up.get-mnemonic-desc-long')">
          </div>

          <div class="evan-padding evan-margin-top">
            <evan-onboarding-mnemonic
              ref="mnemonic"
              :mnemonic.sync="mnemonic"
              :valid.sync="validMnemonic"
              :disabled="true"
              v-on:submit="useMnemonic()">
            </evan-onboarding-mnemonic>
          </div>
          <div class="md-layout md-gutter md-alignment-center-center evan-margin-top">
            <md-button class="md-raised evan-round evan-primary"
              v-if="mnemonicRiddle"
              @click="cancelRiddle()">
              {{ '_onboarding.sign-up.cancel-riddle' | translate }}
            </md-button>
            <md-button class="md-raised evan-round evan-primary"
              :disabled="!validMnemonic"
              @click="useMnemonic()">
              {{ '_onboarding.continue' | translate }}
            </md-button>
          </div>
        </md-step>

        <md-step id="createProfile"
          :md-done.sync="steps.createProfile"
          :md-editable="!creatingProfile"
          :md-label="'_onboarding.sign-up.create-profile.title' | translate"
          :md-description="'_onboarding.sign-up.create-profile.desc' | translate">
          <div class="evan-padding" v-if="!creatingProfile">
            <p v-html="$t('_onboarding.sign-up.create-profile.long')"></p>

            <div class="md-layout md-gutter md-alignment-left-left">
              <p v-html="$t('_onboarding.sign-up.terms-of-use.full')"></p>
            </div>

            <vue-recaptcha class="evan-recaptcha"
              v-if="!initialzing"
              ref="recaptcha"
              sitekey="6LfoK1IUAAAAAOK0EbTv-IqtBq2NS-bvKWcUbm8r"
              theme="light"
              @verify="onCaptchaVerified"
              @expired="onCaptchaExpired">
            </vue-recaptcha>

            <md-dialog-alert
              :md-active.sync="creatingProfileError"
              :div="'_onboarding.sign-up.profile-create-error.desc' | translate"
              :md-confirm-text="'_onboarding.sign-up.profile-create-error.ok' | translate">
            </md-dialog-alert>
          </div>

          <div class="evan-padding profile-creation-container"
            v-if="creatingProfile">
            <md-progress-spinner
              v-if="creatingProfile !== 5"
              :md-diameter="30"
              :md-stroke="3"
              md-mode="indeterminate">
            </md-progress-spinner>
            <h3>
              {{ ('_onboarding.sign-up.create-profile.status-' + creatingProfile) | translate }}
            </h3>
            <p v-if="creatingProfile !== 5">
              {{ $t('_onboarding.sign-up.create-profile.creation-time', { creationTime: creationTime }) }}
            </p>
            <img v-if="creatingProfile !== 5"
              :src="$store.state.dappBaseUrl + '/assets/creating_' + creatingProfile + '.png'">
            <evan-success v-if="creatingProfile === 5"></evan-success>
          </div>

          <div class="md-layout md-gutter md-alignment-center-center evan-margin-top"
            v-if="!creatingProfile">
            <md-button class="md-raised evan-round evan-primary"
              :disabled="!recaptchaToken"
              @click="createProfile()">
              {{ '_onboarding.sign-up.create-profile.title' | translate }}
            </md-button>
          </div>
        </md-step>

        <md-step id="signedIn"
          v-if="$route.query.inviteeAlias"
          :md-done.sync="steps.signedIn"
          :md-editable="false"
          :md-label="'_onboarding.sign-up.welcome' | translate"
          :md-description="'_onboarding.sign-up.welcome-desc' | translate">
          <evan-onboarding-accept-contact
            :loadAlias="true"
            v-if="steps.active === 'signedIn'">
          </evan-onboarding-accept-contact>
        </md-step>
      </md-steppers> -->
    </div>
  </div>
</template>


<script lang="ts">
  import SignUp from './sign-up.ts';
  export default SignUp;
</script>


