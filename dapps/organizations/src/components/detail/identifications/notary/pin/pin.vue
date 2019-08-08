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
          {{ '_org.ident.notary.pin.header' | translate }}
        </h5>
      </template>

      <template v-slot:body id="pin-verification-modal">
        <steps-indicator :active-step="status" :steps="steps" />
        <!-- pin enter screen -->
        <div id="pin-enter" v-if="status === 0" class="m-5">
          <p class="text-justify">{{ '_org.ident.notary.pin.desc' | translate }}</p>
          <div class="form-group my-6 col-md-8 offset-md-2">
            <label for="pin-input">
              {{ `_org.ident.notary.pin.pin.title` | translate }} *
            </label>
            <input
              class="form-control pin-input"
              type="text" pattern="^\d{6}$"  maxlength="6" size="6" autocomplete="off" required
              id="pin-input" ref="pin-input"
              placeholder="000000"
              v-model="pinForm.pin.value"
              :class="{ 'is-invalid' : pinForm.pin.error }"
              @blur="pinForm.pin.setDirty()"
              autofocus
            >
            <div class="invalid-feedback col-xs-12">
              {{ `_org.ident.notary.pin.pin.${ pinForm.pin.error }` | translate }}
            </div>
          </div>
          <p class="text-center text-muted">
            {{`_org.ident.notary.pin.pin.desc` | translate}}
          </p>
        </div>
        <!-- print screen -->
        <div id="answer-success" v-if="status === 1">
          <div class="m-5 px-3">
            <p>{{ '_org.ident.notary.pin.confirmation-code' | translate }}</p>
            <p class="mt-3 mb-0">{{ '_org.ident.notary.pin.confirmation-code-desc' | translate }}</p>
            <p>
              <a :href="pdfUrl" target="_blank" rel="noopener norefferer">{{ '_org.ident.notary.pin.download' | translate }}</a>
            </p>
          </div>
        </div>
        <!-- success screen -->
        <div id="answer-success" v-if="status === 2">
          <div class="m-5 px-3">
            <p>{{ '_org.ident.notary.pin.did-printed' | translate }}</p>
            <p>
              <a :href="pdfUrl" target="_blank" rel="noopener norefferer">{{ '_org.ident.notary.pin.download' | translate }}</a>
            </p>
            <p class="mt-3"><b>{{ '_org.ident.notary.pin.do-not-forget' | translate }}</b></p>
            <p class="mt-3">{{ '_org.ident.notary.pin.next-step' | translate }}</p>
            <p>{{ '_org.ident.notary.pin.next-step2' | translate }}</p>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <span class="mx-auto"></span>
        <div id="pin-enter-btn" v-if="status === 0">
          <button type="button" class="btn btn-primary btn-rounded"
            id="ident-pin-generate"
            :disabled="!pinForm.isValid || checkingPin"
            @click="generateAnswer()">
            {{ `_org.ident.notary.pin.generate-answer` | translate }}
            <div class="spinner-border spinner-border-sm text-light ml-3" v-if="checkingPin"></div>
          </button>
        </div>
        <div id="answer-success-btn" v-if="status === 1">
          <a class="btn btn-primary btn-rounded"
            id="ident-pin-print-next"
            @click="printPdfOrNext()">
            <span v-if="printStatus === 'initial'">{{ `_org.ident.notary.print` | translate }}</span>
            <span v-if="printStatus !== 'initial'">{{ `_org.ident.next` | translate }}</span>
            <i class="mdi mdi-arrow-right label ml-3"></i>
          </a>
        </div>
        <div id="answer-success-btn" v-if="status === 2">
          <a class="btn btn-primary btn-rounded"
            id="ident-pin-done"
            target="_blank"
            @click="$refs.pinModal.hide(); triggerRequestReload();">
            {{ `_org.ident.done` | translate }}
          </a>
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
