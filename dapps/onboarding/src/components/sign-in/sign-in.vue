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
  <div class="evan-onboarding-sigin md-layout md-gutter md-alignment-center-center">
    <div class="md-layout-item md-size-60 md-medium-size-80 md-small-size-100">
      <md-toolbar class="md-accent" md-elevation="0">
        <md-button class="md-icon-button" 
          v-on:click="$router.push({ name: 'welcome', query: $route.query })">
          <md-icon>chevron_left</md-icon>
        </md-button>
        <h3>{{ '_onboarding.sign-in.title' | translate }}</h3>
      </md-toolbar>
      <md-steppers :md-active-step.sync="steps.active" md-vertical md-linear>
        <md-step id="mnemonic"
          :md-done.sync="steps.mnemonic"
          :md-editable="true"
          :md-label="'_onboarding.sign-in.get-mnemonic' | translate"
          :md-description="'_onboarding.sign-in.get-mnemonic-desc' | translate">
          <div class="evan-padding">
            <evan-onboarding-mnemonic
              :mnemonic.sync="mnemonic"
              :valid.sync="validMnemonic"
              v-on:submit="setMnemonic()">
            </evan-onboarding-mnemonic>

            <md-dialog-confirm
              :md-active.sync="notOnboarded"
              :md-title="'_onboarding.sign-in.no-profile' | translate"
              :div="'_onboarding.sign-in.no-profile-desc' | translate"
              :md-confirm-text="'_onboarding.close' | translate"
              :md-cancel-text="'_onboarding.sign-up.title' | translate"
              @md-cancel="openSignupWithMnemonic()"
              @md-confirm="notOnboarded = false">
            </md-dialog-confirm>
          </div>

          <div class="md-layout md-gutter md-alignment-center-center evan-margin-top">
            <md-button class="md-raised evan-round evan-primary"
              v-if="!checking"
              :disabled="!validMnemonic"
              @click="setMnemonic()">
              {{ '_onboarding.continue' | translate }}
            </md-button>
            <md-progress-spinner
              v-if="checking"
              :md-diameter="30"
              :md-stroke="3"
              md-mode="indeterminate">
            </md-progress-spinner>
          </div>
        </md-step>

        <md-step id="password"
          :md-done.sync="steps.password"
          :md-editable="false"
          :md-label="'_onboarding.sign-in.get-password' | translate"
          :md-description="'_onboarding.sign-in.get-password-desc' | translate">
          <div class="evan-padding">
            <md-field>
              <label>{{ '_onboarding.password' | translate }}</label>
              <md-input type="password" ref="password"
                v-model="password"
                @keyup.enter.native="checkPassword()">
              </md-input>
            </md-field>

            <div class="md-layout md-gutter md-alignment-space-between-center"
              v-if="invalidPassword">
              <span class="md-error">
                {{ '_onboarding.sign-in.invalid-password' | translate }}
              </span>
            </div>
          </div>

          <div class="md-layout md-gutter md-alignment-center-center evan-margin-top">
            <md-button class="md-raised evan-round evan-primary"
              v-if="!checking"
              :disabled="password.length < 8"
              @click="checkPassword()">
              {{ '_onboarding.sign-in.decrypt' | translate }}
            </md-button>
            <md-progress-spinner
              v-if="checking"
              :md-diameter="30"
              :md-stroke="3"
              md-mode="indeterminate">
            </md-progress-spinner>
          </div>
        </md-step>

        <md-step id="signedIn"
          v-if="$route.query.inviteeAlias"
          :md-done.sync="steps.signedIn"
          :md-editable="false"
          :md-label="'_onboarding.sign-in.welcome' | translate"
          :md-description="'_onboarding.sign-in.welcome-desc' | translate">
          <evan-onboarding-accept-contact
            :loadAlias="true"
            v-if="steps.active === 'signedIn'">
          </evan-onboarding-accept-contact>
        </md-step>
      </md-steppers>
    </div>
  </div>
</template>


<script lang="ts">
  import SignIn from './sign-in.ts';
  export default SignIn;
</script>


