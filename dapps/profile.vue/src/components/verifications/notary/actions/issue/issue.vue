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
  <div>
    <evan-modal
      ref="issueModal"
      :max-width="'600px'"
    >
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_profile.verifications.notary.issue.header' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <evan-modal
          ref="statusModal"
          :max-width="'600px'"
          hide-footer-button="true"
        >
          <template v-slot:header>
            <h5 class="modal-title">
              {{ `_profile.verifications.notary.issue.issued.${ status }.title` | translate }}
            </h5>
          </template>
          <template v-slot:body>
            <div class="text-center">
              <evan-success v-if="status === 'success'" />
              <div class="p-5 mt-3 text-center">
                <p />
                <p class="mt-3">
                  {{ `_profile.verifications.notary.issue.issued.${ status }.desc` | translate }}
                </p>
              </div>
            </div>
          </template>
          <template v-slot:footer>
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="hideBoth();"
            >
              {{ '_evan.cancel' | translate }}
            </button>
          </template>
        </evan-modal>

        <div
          v-if="issuing"
          class="text-center"
        >
          <evan-loading />
          <h4>{{ '_profile.verifications.notary.issue.issuing' | translate }}</h4>
        </div>
        <template v-else>
          <div class="form-group">
            <label for="alias">
              {{ `_profile.verifications.notary.issue.requestId.title` | translate }} *
            </label>
            <input
              ref="alias"
              v-model="issueForm.requestId.value"
              class="form-control"
              required
              :placeholder="`_profile.verifications.notary.issue.requestId.desc` | translate"
              :class="{ 'is-invalid' : issueForm.requestId.error }"
              @blur="issueForm.requestId.setDirty()"
            >
            <div class="invalid-feedback">
              {{ `_profile.verifications.notary.issue.requestId.error` | translate }}
            </div>
          </div>
          <div class="form-group">
            <label for="alias">
              {{ `_profile.verifications.notary.issue.accountId.title` | translate }} *
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span
                  id="basic-addon1"
                  class="input-group-text"
                >did:evan:</span>
              </div>
              <input
                ref="alias"
                v-model="issueForm.accountId.value"
                class="form-control"
                required
                :placeholder="`_profile.verifications.notary.issue.accountId.desc` | translate"
                :class="{ 'is-invalid' : issueForm.accountId.error }"
                @blur="issueForm.accountId.setDirty()"
              >
              <div class="invalid-feedback">
                {{ `_profile.verifications.notary.issue.accountId.error` | translate }}
              </div>
            </div>
          </div>
          <div>
            <label
              for="privateFiles"
              class="d-block"
            >
              {{ '_profile.verifications.notary.issue.privateFiles.title' | translate }}
            </label>
            <div>
              <evan-file-input
                ref="privateFiles"
                v-model="issueForm.privateFiles.value"
                :class="{ 'is-invalid' : issueForm.privateFiles.error }"
                :accept="'application/pdf'"
                @input="issueForm.privateFiles.setDirty();"
              />
              <div
                v-if="issueForm.privateFiles.error"
                class="invalid-feedback d-block"
              >
                {{ issueForm.privateFiles.error | translate }}
              </div>
            </div>
          </div>
          <div class="mt-3">
            <label
              for="publicFiles"
              class="d-block"
            >
              {{ '_profile.verifications.notary.issue.publicFiles.title' | translate }}
            </label>
            <div>
              <evan-file-input
                ref="publicFiles"
                v-model="issueForm.publicFiles.value"
                :class="{ 'is-invalid' : issueForm.publicFiles.error }"
                :accept="'application/pdf'"
                @input="issueForm.publicFiles.setDirty();"
              />
            </div>
          </div>
          <small class="text-muted">
            {{ '_profile.verifications.notary.issue.file-rename-hint' | translate }}
          </small>
        </template>
      </template>
      <template v-slot:footer>
        <div>
          <button
            type="button"
            class="btn btn-primary "
            :disabled="!issueForm.isValid || issuing"
            @click="issueIdentification()"
          >
            {{ `_profile.verifications.notary.issue.issue` | translate }}
            <div
              v-if="issuing"
              class="spinner-border spinner-border-sm text-light ml-3"
            />
            <i
              v-else
              class="mdi mdi-arrow-right label ml-3"
            />
          </button>
        </div>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
import Component from './issue.ts';

export default Component;
</script>
