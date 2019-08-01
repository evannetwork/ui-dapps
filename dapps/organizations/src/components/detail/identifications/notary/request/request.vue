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
      ref="requestModal"
      :hideFooterButton="status === -1 || status === 3"
      :maxWidth="'800px'">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_org.ident.notary.request.header' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <div id="request-verification-modal" class="modal-content">
          <!-- steps indicator -->
          <steps-indicator
            v-if="status >= 0 && status < 3"
            :steps="steps"
            :active-step="status"
            @updatestep="updatestep"
          ></steps-indicator>

          <!-- Verification start info -->
          <div id="ident-desc" v-if="status === -1">
            <h4>{{'_org.ident.notary.request.why.title' | translate}}</h4>
            <p class="mb-4">{{ $t('_org.ident.notary.request.why.description', { accountId: $route.params.address }) }}
              <a href="https://evannetwork.github.io/docs/first_steps/power_apps/notary-verification.html"
                class="text-link" target="_blank" rel="noreferer noopener">
                {{'_org.ident.notary.request.why.link' | translate}}
              </a>
            </p>

            <h4>{{'_org.ident.notary.request.who.title' | translate}}</h4>
             <p class="mb-4">{{'_org.ident.notary.request.who.description' | translate}}
              <a href="https://evannetwork.github.io/docs/first_steps/power_apps/notary-verification.html"
                class="text-link" target="_blank" rel="noreferer noopener">
                {{'_org.ident.notary.request.who.link' | translate}}
              </a>
            </p>

            <h4>{{'_org.ident.notary.request.how.title' | translate}}</h4>
            <div class="row row-eq-height">
              <div v-for="(key) in ['1', '2', '3']" :key="key" class="step col-md-4">
                <div>
                  <h5 class="bold bold emphasized">{{`_org.ident.notary.request.how.steps.${key}.title` | translate}}</h5>
                  <p>{{`_org.ident.notary.request.how.steps.${key}.description` | translate}}</p>
                </div>
              </div>
            </div>

            <h4 class="mt-4 mb-4">{{'_org.ident.notary.request.costs.title' | translate}}</h4>
            <p class="mb-4">{{'_org.ident.notary.request.costs.description' | translate}}</p>
          </div>

          <!-- request verification form -->
          <div id="ident-formular" v-else-if="status === 0">
            <div class="form-group">
              <label for="organization">
                {{ `_org.ident.notary.request.organization.title` | translate }} *
              </label>
              <input class="form-control" required
                id="organization" ref="organization"
                :placeholder="`_org.ident.notary.request.organization.desc` | translate"
                v-model="requestForm.organization.value"
                :class="{ 'is-invalid' : requestForm.organization.error }"
                @blur="requestForm.organization.setDirty()">
              <div class="invalid-feedback">
                {{ '_org.ident.notary.request.organization.error' | translate }}
              </div>
            </div>
            <div class="form-group mb-4">
              <label for="country">
                {{ `_org.ident.notary.request.country.title` | translate }} *
              </label>
              <select class="form-control custom-select"
                id="country" ref="country"
                :placeholder="`_org.ident.notary.request.country.desc` | translate"
                v-model="requestForm.country.value">
                <option :value="'germany'">
                  {{ '_org.ident.notary.request.countries.germany' | translate }}
                </option>
              </select>
            </div>

            <div class="row mb-4">
              <div class="col-6">
                <div class="form-group">
                  <label for="court">
                    {{ `_org.ident.notary.request.court.title` | translate }} *
                  </label>
                  <input class="form-control" required
                    id="court" ref="court"
                    :placeholder="`_org.ident.notary.request.court.desc` | translate"
                    v-model="requestForm.court.value"
                    :class="{ 'is-invalid' : requestForm.court.error }"
                    @blur="requestForm.court.setDirty()">
                  <div class="invalid-feedback">
                    {{ '_org.ident.notary.request.court.error' | translate }}
                  </div>
                </div>
              </div>
              <div class="col-2">
                <div class="form-group">
                  <label for="register">
                    {{ `_org.ident.notary.request.register.title` | translate }} *
                  </label>
                  <select class="form-control custom-select"
                    id="register" ref="register"
                    :placeholder="`_org.ident.notary.request.register.desc` | translate"
                    v-model="requestForm.register.value">
                    <option :value="'HRA'">
                      HRA
                    </option>
                    <option :value="'HRB'">
                      HRB
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="registerNumber">
                    {{ `_org.ident.notary.request.registerNumber.title` | translate }} *
                  </label>
                  <input class="form-control" required
                    id="registerNumber" ref="registerNumber"
                    :placeholder="`_org.ident.notary.request.registerNumber.desc` | translate"
                    v-model="requestForm.registerNumber.value"
                    :class="{ 'is-invalid' : requestForm.registerNumber.error }"
                    @blur="requestForm.registerNumber.setDirty()">
                   <div class="invalid-feedback">
                    {{ '_org.ident.notary.request.registerNumber.error' | translate }}
                  </div>
                </div>
              </div>
            </div>
            <label>
              {{ `_org.ident.notary.request.postal-address` | translate }} *
            </label>
            <div class="form-group">
              <input class="form-control" required
                id="address" ref="address"
                :placeholder="`_org.ident.notary.request.address.desc` | translate"
                v-model="requestForm.address.value"
                :class="{ 'is-invalid' : requestForm.address.error }"
                @blur="requestForm.address.setDirty()">
              <div class="invalid-feedback">
                {{ '_org.ident.notary.request.address.error' | translate }}
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 pr-0">
                <div class="form-group mb-2">
                  <input class="form-control" required
                    id="zipCode" ref="zipCode"
                    :placeholder="`_org.ident.notary.request.zipCode.desc` | translate"
                    v-model="requestForm.zipCode.value"
                    :class="{ 'is-invalid' : requestForm.zipCode.error }"
                    @blur="requestForm.zipCode.setDirty()">
                  <div class="invalid-feedback">
                    {{ '_org.ident.notary.request.zipCode.error' | translate }}
                  </div>
                </div>
              </div>
              <div class="col-md-8 pl-1">
                <div class="form-group mb-2">
                  <input class="form-control" required
                    id="city" ref="city"
                    :placeholder="`_org.ident.notary.request.city.desc` | translate"
                    v-model="requestForm.city.value"
                    :class="{ 'is-invalid' : requestForm.city.error }"
                    @blur="requestForm.city.setDirty()">
                  <div class="invalid-feedback">
                    {{ '_org.ident.notary.request.city.error' | translate }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                 <div class="form-group">
                  <label for="contact">
                    {{ `_org.ident.notary.request.contact.title` | translate }} *
                  </label>
                  <input class="form-control" required
                    id="contact" ref="contact"
                    :placeholder="`_org.ident.notary.request.contact.desc` | translate"
                    v-model="requestForm.contact.value"
                    :class="{ 'is-invalid' : requestForm.contact.error }"
                    @blur="requestForm.contact.setDirty()">
                  <div class="invalid-feedback">
                    {{ '_org.ident.notary.request.contact.error' | translate }}
                  </div>
                </div>
              </div>
              <div class="col-6">
                 <div class="form-group">
                  <label for="department">
                    {{ `_org.ident.notary.request.department.title` | translate }}
                  </label>
                  <input class="form-control" required
                    id="department" ref="department"
                    :placeholder="`_org.ident.notary.request.department.desc` | translate"
                    v-model="requestForm.department.value"
                    :class="{ 'is-invalid' : requestForm.department.error }"
                    @blur="requestForm.department.setDirty()">
                  <div class="invalid-feedback">
                    {{ '_org.ident.notary.request.department.error' | translate }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- approval screen -->
          <div id="ident-accept" v-else-if="status === 1" class="mt-5">
            <p>{{ '_org.ident.notary.request.proof.title' | translate }}</p>
            <labeled-list :entries="approveData" />
            <p>{{ '_org.ident.notary.request.proof.description' | translate }}</p>
            <labeled-list :entries="approveAddress" hideLabel hideEmpty/>
          </div>

          <!-- approve costs screen -->
          <div id="ident-accept" v-else-if="status === 2 && !sending" class="mt-5">
            <p>{{ '_org.ident.notary.request.costs.hint' | translate }}</p>
            <div class="form-check text-center m-6">
                <input id="costs-approval" type="checkbox" v-model="approvedCosts" class="form-check-input" required />
                <label for="costs-approval" class="form-check-label">
                  <h4>{{ '_org.ident.notary.request.costs.approve' | translate }}</h4>
                </label>
            </div>
          </div>

           <!-- loader-->
          <div class="text-center"
            id="request-verification-loading"
            v-if="sending">
            <evan-loading></evan-loading>
            <h4>{{ '_org.ident.notary.request.requesting' | translate }}</h4>
          </div>

          <!-- success screen -->
          <div class="text-center"
            id="ident-requested"
            v-else-if="status === 3">
            <evan-success></evan-success>
            <div class="p-5 mt-3 text-center">
              <p>{{ '_org.ident.notary.request.requested1' | translate }}</p>
              <p class="mt-3">{{ '_org.ident.notary.request.requested2' | translate }}</p>
              <p class="mt-3"><b>{{ '_org.ident.notary.request.requested3' | translate }}</b></p>
            </div>
          </div>

        </div>
      </template>



      <template v-slot:footer>
        <span class="mx-auto" v-if="status !== -1"></span>
        <!-- back btn -->
        <template v-if="status >= 0 && status <= 2">
          <button
            type="button" class="btn btn-outline-primary btn-rounded"
            id="ident-request-back"
            @click="status -= 1">
            <i class="mdi mdi-arrow-left label mr-3"></i>
            {{ `_org.ident.back` | translate }}
          </button>
        </template>

        <!-- start button -->
         <template v-if="status === -1">
          <button type="button" class="btn btn-primary btn-rounded mx-auto"
            id="ident-request-start"
            :disabled="(status === 1 && !requestForm.isValid) || sending"
            @click="status += 1">
            {{ `_org.ident.notary.request.request-verification` | translate }}
          </button>
        </template>

        <!-- next btn -->
        <template v-if="status < 2 && status !== -1">
          <button type="button" class="btn btn-primary btn-rounded"
            id="ident-request-next"
            :disabled="(status === 0 && !requestForm.isValid) || sending"
            @click="status += 1">
            {{ `_org.ident.next` | translate }}
            <i class="mdi mdi-arrow-right label ml-3"></i>
          </button>
        </template>

        <!-- request ident btn -->
        <template v-if="status === 2">
          <button type="button" class="btn btn-primary btn-rounded" id="ident-request"
            @click="requestIdentification()"
            :disabled="!approvedCosts"
          >
            {{ `_org.ident.notary.request.request-ident` | translate }}
            <div class="spinner-border spinner-border-sm text-light ml-3" v-if="sending"></div>
            <i class="mdi mdi-arrow-right label ml-3" v-else></i>
          </button>
        </template>

        <!-- final close button -->
        <template v-if="status === 3">
          <button type="button" class="btn btn-primary btn-rounded" id="ident-request"
            @click="$refs.requestModal.hide()"
          >
            {{ `_org.ident.done` | translate }}
          </button>
        </template>
      </template><!-- eof footer -->
    </evan-modal>
  </div>
</template>


<script lang="ts">
  import Component from './request.ts';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './request.scss'
</style>
