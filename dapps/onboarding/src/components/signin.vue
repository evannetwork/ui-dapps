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
  <div class="evan-onboarding-login md-layout md-gutter md-alignment-center-center">
    <div class="md-layout-item md-size-60 md-medium-size-80 md-small-size-100">
      <md-toolbar class="md-accent" md-elevation="0">
        <md-button class="md-icon-button" 
          v-on:click="$router.push($store.state.urlBasePath)">
          <md-icon>chevron_left</md-icon>
        </md-button>
        <h3>{{ '_onboarding.sign-in' | translate }}</h3>
      </md-toolbar>
      <md-steppers :md-active-step.sync="active" md-vertical md-linear>
        <md-step id="first"
          :md-done.sync="first"
          :md-editable="true"
          :md-label="'_onboarding.signin.get-mnemonic' | translate"
          :md-description="'_onboarding.signin.get-mnemonic-desc' | translate">
          <evan-onboarding-mnemonic
            v-model="mnemonic">
          </evan-onboarding-mnemonic>
          <md-button class="md-raised md-primary" @click="setDone('first', 'second')">Continue</md-button>
        </md-step>

        <md-step id="second"
          :md-done.sync="second"
          :md-editable="false"
          :md-error="secondStepError"
          :md-label="'_onboarding.signin.get-mnemonic' | translate"
          :md-description="'_onboarding.signin.get-mnemonic-desc' | translate">

          <md-button class="md-raised md-primary" @click="setDone('second', 'third')">Continue</md-button>
          <md-button class="md-raised md-primary" @click="setError()">Set error!</md-button>
        </md-step>

        <md-step
          :md-done.sync="third"
          :md-editable="false"
          :md-label="'_onboarding.signin.welcome' | translate"
          :md-description="'_onboarding.signin.welcome-desc' | translate">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.</p>
          <md-button class="md-raised md-primary" @click="setDone('third')">Done</md-button>
        </md-step>
      </md-steppers>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import * as bcc from 'bcc';
  import { System, core, dapp, getDomainName } from 'dapp-browser';
  import MnemonicComponent from './mnemonic.vue';

  export default Vue.extend({
    data: function () {
      return {
        mnemonic: '',
        active: 'first',
        first: false,
        second: false,
        third: false,
        secondStepError: ''
      }
    },
    created () {

    },
    methods: {
      setDone (id, index) {
        this[id] = true

        this.secondStepError = ''

        if (index) {
          this.active = index
        }
      },
      setError () {
        this.secondStepError = 'This is an error!'
      }
    }
  });
</script>

<style lang="scss" scoped>
  .evan-onboarding-login {
    height: 100%;
  }
</style>

