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
        <div v-if="status === 0">
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
            <input class="form-control" required
              id="country" ref="country"
              :placeholder="`_org.ident-notary.request.country.desc` | translate"
              v-model="requestForm.country.value"
              :class="{ 'is-invalid' : requestForm.country.error }"
              @blur="requestForm.country.setDirty()">
            <div class="invalid-feedback">
              {{ '_org.ident-notary.request.country.error' | translate }}
            </div>
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
      </template>
      <template v-slot:footer>
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
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './request.ts';
  export default Component;
</script>
