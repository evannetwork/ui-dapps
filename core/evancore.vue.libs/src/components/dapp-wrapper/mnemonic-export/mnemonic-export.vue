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
  <div v-if="mnemonic">
    <evan-modal
      ref="modal"
      :close-action="onModalClose"
      :hide-footer-button="true"
      :max-width="'1000px'"
      :hide-close-button="true"
      class="mnemonic-modal"
      disable-backdrop="true"
    >
      <template v-slot:header>
        <h5 class="modal-title inverted">
          {{ '_evan.mnemonic-export.title' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <div class="print-view">
          <div class="row">
            <!-- dark left info box -->
            <div class="col-md-6 info-box inverted pr-7">
              <i class="mdi mdi-shield-alert-outline header-icon" />
              <img
                class="evan-logo print-only"
                :src="`${ $store.state.uiBaseUrl }/assets/evan-logo-dark-half.svg`"
              >
              <!-- eslint-disable vue/no-v-html -->
              <h3
                class="print-only mt-5"
                v-html="$t('_evan.mnemonic-export.recovery-key')"
              />
              <p
                class="hyphen-auto pre-wrap text-justify"
                v-html="$t('_evan.mnemonic-export.description')"
              />
              <p
                class="hyphen-auto pre-wrap text-justify bold no-print"
                v-html="$t('_evan.mnemonic-export.print-or-store')"
              />
              <!-- eslint-enable vue/no-v-html -->
              <p
                class="mt-5 d-flex no-print align-items-center justify-content-between"
                style="min-height: 40px;"
              >
                <label class="mb-0 d-flex align-items-center">
                  <evan-checkbox
                    id="understood-checkbox-backup-1"
                    v-model="understood"
                    class="understood-checkbox"
                  />
                  <span>{{ '_evan.mnemonic-export.understood' | translate }}</span>
                </label>

                <evan-button
                  :label="$t('_evan.mnemonic-export.go-secure')"
                  icon="mdi mdi-account-key"
                  type="danger"
                  :disabled="!understood"
                  @click="goSecure"
                />
              </p>
            </div>
            <!--rigth box containing mnemonic -->
            <div class="col-md-6 mnemonic-box">
              <div class="row mb-2 pl-5">
                <div class="col-md-4">
                  <span
                    class="bold"
                    style="white-space: nowrap;"
                  >
                    {{ '_evan.mnemonic-export.account-id' | translate }}
                  </span>
                </div>
                <div class="col-md-8 account-id">
                  <span>{{ address }}</span>
                </div>
              </div>
              <div class="row mb-2 pl-5">
                <div class="col-md-4">
                  <span
                    class="bold"
                    style="white-space: nowrap;"
                  >
                    {{ '_evan.mnemonic-export.evan-id' | translate }}
                  </span>
                </div>
                <div class="col-md-8 account-id">
                  <span>{{ identityAddress }}</span>
                </div>
              </div>
              <div class="row mb-2 pl-5">
                <div class="col-md-4">
                  <span class="bold">{{ '_evan.mnemonic-export.alias' | translate }}</span>
                </div>
                <div class="col-md-8">
                  <span>{{ alias }}</span>
                </div>
              </div>
              <div class="print-only row mb-2 pl-5">
                <div class="col-md-4">
                  <span class="bold">{{ '_evan.mnemonic-export.created-at' | translate }}</span>
                </div>
                <div class="col-md-8">
                  <span>{{ now | moment('LLL') }}</span>
                </div>
              </div>
              <div class="no-print row mb-2 mt-4 pl-5">
                <div class="col-12">
                  <span class="bold">{{ '_evan.mnemonic-export.recovery-key' | translate }}</span>
                  <evan-button
                    class="copy-btn"
                    icon="mdi mdi-mdi mdi-content-copy"
                    type="icon-secondary"
                    @click="() => copyToClipboard(mnemonic.join(' '))"
                  />
                </div>
              </div>
              <div class="row mnemonics pl-5">
                <div
                  v-for="(word, index) of mnemonic"
                  :key="word"
                  class="col-md-6 col-lg-4"
                >
                  <div class="word">
                    <span class="order">{{ index + 1 }}:</span>
                    <span>{{ word }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <evan-button
          type="text"
          @click="downloadMnemonics"
        >
          {{ '_evan.mnemonic-export.download' | translate }}
        </evan-button>
        <evan-button
          type="primary"
          @click="print"
        >
          {{ '_evan.mnemonic-export.print' | translate }}
        </evan-button>
      </template>
    </evan-modal>
    <evan-modal
      ref="understoodModal"
      class="understood-modal"
      :max-width="'600px'"
    >
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_evan.mnemonic-export.cancel.title' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <p>{{ '_evan.mnemonic-export.cancel.desc' | translate }}</p>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
import Component from './mnemonic-export';

export default Component;
</script>

<style lang="scss" scoped>
  @import "./mnemonic-export.scss";
</style>
