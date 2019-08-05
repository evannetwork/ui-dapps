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
      ref="issueModal"
      :maxWidth="'600px'">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_org.ident.notary.issue.header' | translate }}
        </h5>
      </template>
      <template v-slot:body
        id="issue-verification-modal">
        <div class="form-group">
          <label for="alias">
            {{ `_org.ident.notary.issue.requestId.title` | translate }} *
          </label>
          <input class="form-control" required
            id="alias" ref="alias"
            :placeholder="`_org.ident.notary.issue.requestId.desc` | translate"
            v-model="issueForm.requestId.value"
            :class="{ 'is-invalid' : issueForm.requestId.error }"
            @blur="issueForm.requestId.setDirty()">
          <div class="invalid-feedback">
            {{ `_org.ident.notary.issue.requestId.error` | translate }}
          </div>
        </div>
        <div class="form-group">
          <label for="alias">
            {{ `_org.ident.notary.issue.accountId.title` | translate }} *
          </label>
          <input class="form-control" required
            id="alias" ref="alias"
            :placeholder="`_org.ident.notary.issue.accountId.desc` | translate"
            v-model="issueForm.accountId.value"
            :class="{ 'is-invalid' : issueForm.accountId.error }"
            @blur="issueForm.accountId.setDirty()">
          <div class="invalid-feedback">
            {{ `_org.ident.notary.issue.accountId.error` | translate }}
          </div>
        </div>
        <div>
          <label for="privateFiles" class="d-block">
            {{ '_org.ident.notary.issue.privateFiles.title' | translate }}
          </label>
          <div>
            <evan-file-input
              id="issue-privateFiles" ref="privateFiles"
              :class="{ 'is-invalid' : issueForm.privateFiles.error }"
              v-model="issueForm.privateFiles.value"
              @input="issueForm.privateFiles.setDirty();">
            </evan-file-input>
            <div class="invalid-feedback d-block" v-if="issueForm.privateFiles.error">
              {{ issueForm.privateFiles.error | translate }}
            </div>
          </div>
        </div>
        <div class="mt-3">
          <label for="publicFiles" class="d-block">
            {{ '_org.ident.notary.issue.publicFiles.title' | translate }}
          </label>
          <div>
            <evan-file-input
              id="issue-publicFiles" ref="publicFiles"
              :class="{ 'is-invalid' : issueForm.publicFiles.error }"
              v-model="issueForm.publicFiles.value"
              @input="issueForm.publicFiles.setDirty();">
            </evan-file-input>
            <div class="invalid-feedback d-block" v-if="issueForm.publicFiles.error">
              {{ issueForm.publicFiles.error | translate }}
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div>
          <button type="button" class="btn btn-primary btn-rounded"
            id="ident-issue"
            :disabled="!issueForm.isValid || issuing"
            @click="issueIdentification()">
            {{ `_org.ident.notary.issue.issue` | translate }}
            <div class="spinner-border spinner-border-sm text-light ml-3" v-if="issuing"></div>
            <i class="mdi mdi-arrow-right label ml-3" v-else></i>
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
