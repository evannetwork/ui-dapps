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
    <evan-modal ref="requestModal"
      :maxWidth="'600px'">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_org.ident-notary.request.header' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <div class="text-center"
          v-if="sending">
          <evan-loading></evan-loading>
          <h5>{{ '_org.ident-notary.request.requesting' | translate }}</h5>
        </div>
        <div v-else-if="status === 0">
          <div class="form-group">
            <label for="company">
              {{ `_org.ident-notary.request.company.title` | translate }} *
            </label>
            <input class="form-control" required
              id="company" ref="company"
              :placeholder="`_org.ident-notary.request.company.desc` | translate"
              v-model="requestForm.company.value"
              :class="{ 'is-invalid' : requestForm.company.error }"
              @blur="requestForm.company.setDirty()">
            <div class="invalid-feedback">
              {{ '_org.ident-notary.request.company.error' | translate }}
            </div>
          </div>
          <div class="form-group">
            <label for="regNumber">
              {{ `_org.ident-notary.request.regNumber.title` | translate }} *
            </label>
            <input class="form-control" required
              id="regNumber" ref="regNumber"
              :placeholder="`_org.ident-notary.request.regNumber.desc` | translate"
              v-model="requestForm.regNumber.value"
              :class="{ 'is-invalid' : requestForm.regNumber.error }"
              @blur="requestForm.regNumber.setDirty()">
            <div class="invalid-feedback">
              {{ '_org.ident-notary.request.regNumber.error' | translate }}
            </div>
          </div>

          <label>
            {{ `_org.ident-notary.request.postal-address` | translate }} *
          </label>
          <div class="form-group mb-2">
            <select class="form-control custom-select"
              id="country" ref="country"
              :placeholder="`_org.ident-notary.request.country.desc` | translate"
              v-model="requestForm.country.value">
              <option :value="'germany'">
                {{ '_org.ident-notary.request.countries.germany' | translate }}
              </option>
            </select>
          </div>
          <div class="form-group mb-2">
            <input class="form-control" required
              id="address" ref="address"
              :placeholder="`_org.ident-notary.request.address.desc` | translate"
              v-model="requestForm.address.value"
              :class="{ 'is-invalid' : requestForm.address.error }"
              @blur="requestForm.address.setDirty()">
            <div class="invalid-feedback">
              {{ '_org.ident-notary.request.address.error' | translate }}
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 pr-0">
              <div class="form-group mb-2">
                <input class="form-control" required
                  id="zipCode" ref="zipCode"
                  :placeholder="`_org.ident-notary.request.zipCode.desc` | translate"
                  v-model="requestForm.zipCode.value"
                  :class="{ 'is-invalid' : requestForm.zipCode.error }"
                  @blur="requestForm.zipCode.setDirty()">
                <div class="invalid-feedback">
                  {{ '_org.ident-notary.request.zipCode.error' | translate }}
                </div>
              </div>
            </div>
            <div class="col-md-8 pl-1">
              <div class="form-group mb-2">
                <input class="form-control" required
                  id="city" ref="city"
                  :placeholder="`_org.ident-notary.request.city.desc` | translate"
                  v-model="requestForm.city.value"
                  :class="{ 'is-invalid' : requestForm.city.error }"
                  @blur="requestForm.city.setDirty()">
                <div class="invalid-feedback">
                  {{ '_org.ident-notary.request.city.error' | translate }}
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="contact">
              {{ `_org.ident-notary.request.contact.title` | translate }} *
            </label>
            <input class="form-control" required
              id="contact" ref="contact"
              :placeholder="`_org.ident-notary.request.contact.desc` | translate"
              v-model="requestForm.contact.value"
              :class="{ 'is-invalid' : requestForm.contact.error }"
              @blur="requestForm.contact.setDirty()">
            <div class="invalid-feedback">
              {{ '_org.ident-notary.request.contact.error' | translate }}
            </div>
          </div>
        </div>
        <div v-else-if="status === 1">
          <p>{{ '_org.ident-notary.request.proof.title' | translate }}</p>

          <div class="my-3 p-3 border border-sm bg-level-2">
            <div class="row">
              <div class="col-6">
                <span>{{ '_org.ident-notary.request.proof.you-request' | translate }}</span>
              </div>
              <div class="col-6">
                <b>{{ '_org.ident-notary.request.proof.you-request-2' | translate }}</b>
              </div>
            </div>

            <div class="row">
              <div class="col-6">
                <span>{{ '_org.ident-notary.request.proof.for-org' | translate }}</span>
              </div>
              <div class="col-6">
                <b>{{ requestForm.company.value }}</b>
              </div>
            </div>

            <div class="row">
              <div class="col-6">
                <span>{{ '_org.ident-notary.request.proof.with-reg-number' | translate }}</span>
              </div>
              <div class="col-6">
                <b>{{ requestForm.regNumber.value }}</b>
              </div>
            </div>
          </div>

          <p>{{ '_org.ident-notary.request.proof.question-desc' | translate }}</p>
          <div class="my-3 p-3 border border-sm bg-level-2">
            <div class="row">
              <div class="col-6">
                <span>{{ '_org.ident-notary.request.proof.contact-is' | translate }}</span>
              </div>

              <div class="col-6">
                <b class="d-block">{{ requestForm.contact.value }}</b>
                <b class="d-block">{{ requestForm.address.value }}</b>
                <b class="d-block">
                  {{ requestForm.zipCode.value }}
                  {{ requestForm.city.value }},
                  {{ `_org.ident-notary.request.countries.${ requestForm.country.value }` | translate }}
                </b>
              </div>
            </div>
          </div>

          <div class="mt-3 text-center">
            <p>{{ '_org.ident-notary.request.proof.footer' | translate }}</p>
            <h5 class="font-weight-bold">{{ '_org.ident-notary.request.proof.footer2' | translate }}</h5>
          </div>
        </div>
        <div class="text-center" v-else-if="status === 2">
          <evan-success></evan-success>
          <div class="p-5 mt-3">
            <h5>{{ '_org.ident-notary.request.requested1' | translate }}</h5>
            <h5 class="mt-3">{{ '_org.ident-notary.request.requested2' | translate }}</h5>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <template v-if="!sending && status !== 2">
          <span class="mx-auto"></span>
          <button type="button" class="btn btn-primary btn-rounded"
            id="ident-request"
            v-if="status === 0"
            :disabled="!requestForm.isValid"
            @click="status = 1">
            {{ `_org.ident-notary.request.next` | translate }}
            <i class="mdi mdi-arrow-right label ml-3"></i>
          </button>
          <template v-else>
            <button type="button" class="btn btn-outline-secondary btn-rounded"
              id="ident-request"
              @click="status = 0">
              {{ `_org.ident-notary.request.back` | translate }}
            </button>
            <button type="button" class="btn btn-primary btn-rounded"
              id="ident-request"
              @click="requestIdentification()">
              {{ `_org.ident-notary.request.request-ident` | translate }}
              <div class="spinner-border spinner-border-sm text-light ml-3" v-if="checkingPin"></div>
              <i class="mdi mdi-arrow-right label ml-3" v-else></i>
            </button>
          </template>
        </template>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './request.ts';
  export default Component;
</script>
