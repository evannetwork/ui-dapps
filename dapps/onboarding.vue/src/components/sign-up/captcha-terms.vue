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
  <div class="my-3">
    <div class="d-flex justify-content-center">
      <div class="terms-of-use">
        <evan-form-control-checkbox
          class="mr-3" style="min-width: 0; width: auto; margin: 0;"
          id="termsAccepted"
          v-model="signUpComp.termsAccepted.value"
          :class="{ 'is-invalid' : signUpComp.termsAccepted.error }"
          @input="signUpComp.termsAccepted.setDirty()"
          @click="signUpComp.termsAccepted.value = !signUpComp.termsAccepted.value"
        />
        <label
          for="termsAccepted"
          class="form-check-label"
          v-html="$t(`_onboarding.sign-up.terms-accepted`)">
        </label>
        <div class="invalid-feedback">
          {{ '_onboarding.sign-up.errors.terms-accepted' | translate }}
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <vue-recaptcha id="evan-recaptcha"
        v-if="!signUpComp.initialzing"
        ref="recaptcha"
        :sitekey="signUpComp.recaptchaId"
        theme="light"
        @verify="signUpComp.onCaptchaVerified"
        @expired="signUpComp.onCaptchaExpired">
      </vue-recaptcha>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './captcha-terms';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './captcha-terms.scss';
</style>