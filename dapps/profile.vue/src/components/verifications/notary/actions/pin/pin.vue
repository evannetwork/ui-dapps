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
  <div>
    <evan-modal
      ref="pinModal"
      :maxWidth="'600px'">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_profile.verifications.notary.pin.header' | translate }}
        </h5>
      </template>

      <template v-slot:body>
        <evan-steps
          :active-step="status"
          :steps="steps"
          @updatestep="status = $event">
        </evan-steps>
        <!-- pin enter screen -->
        <div v-if="status === 0" class="m-5">
          <p class="text-justify">{{ '_profile.verifications.notary.pin.desc' | translate }}</p>
          <div class="form-group my-6 col-md-8 offset-md-2">
            <label for="pin-input">
              {{ `_profile.verifications.notary.pin.pin.title` | translate }} *
            </label>
            <input
              class="form-control pin-input"
              type="text" pattern="^\d{6}$"  maxlength="6" size="6" autocomplete="off" required
              ref="pin-input"
              placeholder="000000"
              v-model="pinForm.pin.value"
              :class="{ 'is-invalid' : pinForm.pin.error }"
              @blur="pinForm.pin.setDirty()"
              autofocus
            >
            <div class="invalid-feedback col-xs-12">
              {{ `_profile.verifications.notary.pin.pin.${ pinForm.pin.error }` | translate }}
            </div>
          </div>
          <p class="text-center text-muted">
            {{`_profile.verifications.notary.pin.pin.desc` | translate}}
          </p>
        </div>
        <!-- print screen -->
        <div v-if="status === 1">
          <div class="m-5 px-3">
            <p>{{ '_profile.verifications.notary.pin.confirmation-code' | translate }}</p>
            <p class="mt-3 mb-0">{{ '_profile.verifications.notary.pin.confirmation-code-desc' | translate }}</p>
            <p>
              <a :href="pdfUrl" target="_blank" rel="noopener norefferer">{{ '_profile.verifications.notary.pin.download' | translate }}</a>
            </p>
          </div>
        </div>
        <!-- success screen -->
        <div v-if="status === 2">
          <div class="m-5 px-3">
            <p>{{ '_profile.verifications.notary.pin.did-printed' | translate }}</p>
            <p>
              <a :href="pdfUrl" target="_blank" rel="noopener norefferer">{{ '_profile.verifications.notary.pin.download' | translate }}</a>
            </p>
            <p class="mt-3"><b>{{ '_profile.verifications.notary.pin.do-not-forget' | translate }}</b></p>
            <p class="mt-3">{{ '_profile.verifications.notary.pin.next-step' | translate }}</p>
            <p>{{ '_profile.verifications.notary.pin.next-step2' | translate }}</p>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <span class="mx-auto"></span>
        <div v-if="status === 0">
          <button type="button" class="btn btn-primary "
            :disabled="!pinForm.isValid || checkingPin"
            @click="generateAnswer()">
            {{ `_profile.verifications.notary.pin.generate-answer` | translate }}
            <div class="spinner-border spinner-border-sm text-light ml-3" v-if="checkingPin"></div>
          </button>
        </div>
        <div v-if="status === 1">
          <button class="btn btn-primary "
            @click="printPdfOrNext()">
            <span v-if="printStatus === 'initial'">{{ `_profile.verifications.notary.print` | translate }}</span>
            <span v-if="printStatus !== 'initial'">{{ `_profile.verifications.next` | translate }}</span>
            <i class="mdi mdi-arrow-right label ml-3"></i>
          </button>
        </div>
        <div v-if="status === 2">
          <button class="btn btn-primary "
            target="_blank"
            @click="$refs.pinModal.hide(); triggerRequestReload();">
            {{ `_profile.verifications.done` | translate }}
          </button>
        </div>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './pin.ts';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './pin.scss'
</style>
