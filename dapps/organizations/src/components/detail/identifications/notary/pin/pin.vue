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
      <template v-slot:body
        id="pin-verification-modal">
        <div id="pin-enter" v-if="status === 0">
          <p class="text-justify">{{ '_org.ident.notary.pin.desc' | translate }}</p>
          <p class="text-justify">
            {{ '_org.ident.notary.pin.desc2' | translate }}
          </p>
          <div class="form-row my-3">
            <label for="alias" class="col-md-4">
              {{ `_org.ident.notary.pin.pin.title` | translate }} *
            </label>
            <input
              class="form-control pin-input col-md-4"
              type="text" pattern="^\d{6}$"  maxlength="6" size="6" autocomplete="off" required
              id="alias" ref="alias"
              placeholder="000000"
              v-model="pinForm.pin.value"
              :class="{ 'is-invalid' : pinForm.pin.error }"
              @blur="pinForm.pin.setDirty()"
            >
            <div class="invalid-feedback col-xs-12">
              {{ `_org.ident.notary.pin.pin.${ pinForm.pin.error }` | translate }}
            </div>
          </div>
          <p class="text-center text-muted">
            {{`_org.ident.notary.pin.pin.desc` | translate}}
          </p>
        </div>

        <div id="answer-success" v-if="status === 1">
          <div class="my-5 px-3" v-if="answer">
            <h5>
              {{ '_org.ident.notary.pin.confirmation-code' | translate }}
            </h5>

            <p class="mt-3 mb-0">
              {{ '_org.ident.notary.pin.confirmation-code-desc' | translate }}
            </p>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <span class="mx-auto"></span>
        <div id="pin-enter-btn" v-if="status === 0">
          <button type="button" class="btn btn-primary btn-rounded"
            id="ident-pin-print"
            :disabled="!pinForm.isValid || answer || checkingPin"
            @click="generateAnswer()">
            {{ `_org.ident.notary.pin.generate-answer` | translate }}
            <div class="spinner-border spinner-border-sm text-light ml-3" v-if="checkingPin"></div>
          </button>
        </div>
        <div id="answer-success-btn" v-if="status === 1">
          <a class="btn btn-primary btn-rounded"
            id="ident-pin-print"
            target="_blank"
            :class="{
              'disabled': !answer
            }"
            @click="printPdf()">
            {{ `_org.ident.notary.print` | translate }}
            <i class="mdi mdi-arrow-right label ml-3"></i>
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
