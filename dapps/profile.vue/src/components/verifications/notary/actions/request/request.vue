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
      ref="requestModal"
      :hide-footer-button="status === -1 || status === 3"
      :max-width="'800px'"
      @close="modalClosed()"
    >
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_profile.verifications.notary.request.header' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <template v-if="!sending">
          <!-- steps indicator -->
          <evan-steps
            v-if="status >= 0 && status < 3"
            :steps="steps"
            :active-step="status"
            @stepChange="status = $event; setupSummary()"
          />

          <!-- Verification start info -->
          <div v-if="status === -1">
            <notary-info-content
              :address="identity"
              :enough-funds="enoughFunds"
              :readable-funds="readableFunds"
            />
          </div>

          <!-- request verification form -->
          <div
            v-else-if="status === 0"
            class="container"
          >
            <p class="mt-0 mb-3">
              {{ '_profile.verifications.notary.request.requesting-account' | translate }}
            </p>

            <evan-profile-preview
              size="default"
              :editable="false"
              :address="activeAccount"
            />

            <template v-if="companyData.contact.country !== 'DE' || missingCompanyFields.registration.length !== 0 || missingCompanyFields.contact.length !== 0">
              <b
                v-if="companyData.contact.country && companyData.contact.country !== 'DE'"
                class="d-block border p-3 mt-3"
              >
                {{ '_profile.verifications.notary.request.only-de' | translate }}
              </b>
              <template v-else>
                <p class="mt-8 mb-3">
                  {{ '_profile.verifications.notary.request.fill-missing' | translate }}
                </p>

                <profile-company-registration
                  v-if="missingCompanyFields.registration.length !== 0"
                  :address="address"
                  :only-edit="true"
                  :required="requiredCompanyFields.registration"
                />
                <profile-company-contact
                  v-if="missingCompanyFields.contact.length !== 0"
                  :address="address"
                  :only-edit="true"
                  :required="requiredCompanyFields.contact"
                  :restrict-countries="['DE']"
                />
              </template>
            </template>

            <evan-form
              v-else
              class="mb-0 mt-5"
              :form="requestForm"
              :i18n-scope="'_profile.verifications.notary.request'"
              only-form="true"
              stacked="true"
            />
          </div>

          <!-- approval screen -->
          <div
            v-else-if="status === 1"
            class="container mt-5"
          >
            <p>{{ '_profile.verifications.notary.request.proof.title' | translate }}</p>
            <labeled-list :entries="approveData" />
            <p>{{ '_profile.verifications.notary.request.proof.description' | translate }}</p>
            <labeled-list
              :entries="approveAddress"
              hide-label
              hide-empty
            />
          </div>

          <!-- approve costs screen -->
          <div
            v-else-if="status === 2 && !sending"
            class="mt-5"
          >
            <p>{{ '_profile.verifications.notary.request.costs.hint' | translate }}</p>
            <div class="d-flex p-3 align-items-center justify-content-center">
              <evan-form-control-checkbox
                id="approvedCosts"
                v-model="approvedCosts"
                class="mr-3 mb-0"
                style="min-width: 0; width: auto;"
                required
              />
              <label
                for="approvedCosts"
                class="form-check-label"
              >
                <h4 class="mb-0">{{ '_profile.verifications.notary.request.costs.approve' | translate }}</h4>
              </label>
            </div>
          </div>
        </template>

        <!-- loader-->
        <div
          v-if="sending"
          class="text-center"
        >
          <evan-loading />
          <h4>{{ '_profile.verifications.notary.request.requesting' | translate }}</h4>
        </div>

        <!-- success screen -->
        <div
          v-else-if="status === 3"
          class="text-center"
        >
          <evan-success />
          <div class="p-5 mt-3 text-center">
            <p>{{ '_profile.verifications.notary.request.requested1' | translate }}</p>
            <p class="mt-3">
              {{ '_profile.verifications.notary.request.requested2' | translate }}
            </p>
            <p class="mt-3">
              <b>{{ '_profile.verifications.notary.request.requested3' | translate }}</b>
            </p>
          </div>
        </div>
      </template>

      <template v-slot:footer>
        <span
          v-if="status !== -1"
          class="mx-auto"
        />
        <!-- back btn -->
        <template v-if="status >= 0 && status <= 2 && !sending">
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="status -= 1"
          >
            <i class="mdi mdi-arrow-left label mr-3" />
            {{ `_profile.verifications.back` | translate }}
          </button>
        </template>

        <!-- start button -->
        <template v-if="status === -1">
          <button
            type="button"
            class="btn btn-primary mx-auto"
            :disabled="!enoughFunds || (status === 1 && !requestForm.isValid) || sending"
            @click="nextStatus()"
          >
            {{ `_profile.verifications.notary.request.request-verification` | translate }}
          </button>
        </template>

        <!-- next btn -->
        <template v-if="status < 2 && status !== -1">
          <button
            type="button"
            class="btn btn-primary"
            :disabled="(status === 0 && !requestForm.isValid) || sending"
            @click="nextStatus()"
          >
            {{ `_profile.verifications.next` | translate }}
            <i class="mdi mdi-arrow-right label ml-3" />
          </button>
        </template>

        <!-- request ident btn -->
        <template v-if="status === 2">
          <button
            type="button"
            class="btn btn-primary"
            :disabled="!approvedCosts || sending"
            @click="requestIdentification()"
          >
            {{ `_profile.verifications.notary.request.request-ident` | translate }}
            <div
              v-if="sending"
              class="spinner-border spinner-border-sm text-light ml-3"
            />
            <i
              v-else
              class="mdi mdi-arrow-right label ml-3"
            />
          </button>
        </template>

        <!-- final close button -->
        <template v-if="status === 3">
          <button
            type="button"
            class="btn btn-primary"
            @click="$refs.requestModal.hide()"
          >
            {{ `_profile.verifications.done` | translate }}
          </button>
        </template>
      </template><!-- eof footer -->
    </evan-modal>
  </div>
</template>

<script lang="ts">
import Component from './request';

export default Component;
</script>

<style lang="scss" scoped>
  @import './request.scss'
</style>
