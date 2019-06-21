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
      id="contact-add-modal"
      ref="contactAddModal"
      :maxWidth="'1000px'">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_addressbook.add` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <form v-on:submit.prevent="addContact">
          <div class="white-box border-smooth rounded p-3">
            <div class="form-group">
              <label for="alias">
                {{ `${ formI18nScope }.alias.title` | translate }} *
              </label>
              <input class="form-control" required
                id="alias" ref="alias"
                :placeholder="`${ formI18nScope }.alias.desc` | translate"
                v-model="contactForm.alias.value"
                :class="{ 'is-invalid' : contactForm.alias.error }"
                @blur="contactForm.alias.setDirty()">
              <div class="invalid-feedback">
                {{ `${ formI18nScope }.alias.error` | translate }}
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 d-flex align-items-center">
                <div class="form-check mr-3">
                  <input class="form-check-input"
                    id="emailInvite" type="radio"
                    :value="false"
                    v-model="contactForm.emailInvite.value">
                </div>
                <div class="form-group w-100">
                  <label for="address">
                    {{ `${ formI18nScope }.address.title` | translate }} *
                  </label>
                  <input class="form-control" required
                    id="address" ref="address"
                    :disabled="contactForm.emailInvite.value"
                    :placeholder="`${ formI18nScope }.address.desc` | translate"
                    v-model="contactForm.address.value"
                    :class="{ 'is-invalid' : contactForm.address.error }"
                    @blur="contactForm.address.setDirty()">
                  <div class="invalid-feedback">
                    {{ `${ formI18nScope }.address.error` | translate }}
                  </div>
                </div>
              </div>

              <div class="col-md-6 d-flex align-items-center">
                <div class="form-check mr-3">
                  <input class="form-check-input"
                    id="emailInvite" type="radio"
                    :value="true"
                    v-model="contactForm.emailInvite.value">
                </div>
                <div class="form-group w-100">
                  <label for="email">
                    {{ `${ formI18nScope }.email.title` | translate }} *
                  </label>
                  <input class="form-control" required
                    id="email" ref="email"
                    :disabled="!contactForm.emailInvite.value"
                    :placeholder="`${ formI18nScope }.email.desc` | translate"
                    v-model="contactForm.email.value"
                    :class="{ 'is-invalid' : contactForm.email.error }"
                    @blur="contactForm.email.setDirty()">
                  <div class="invalid-feedback">
                    {{ `${ formI18nScope }.email.error` | translate }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="white-box border-smooth rounded p-3 mt-3">
            <p class="w-100">
              {{ `${ formI18nScope }.bmail.desc` | translate }}
            </p>

            <div class="form-group w-100">
              <label for="name">
                {{ `${ formI18nScope }.msgTitle.title` | translate }} *
              </label>
              <input class="form-control" required
                id="msgTitle" ref="msgTitle"
                :placeholder="`${ formI18nScope }.msgTitle.desc` | translate"
                v-model="contactForm.msgTitle.value"
                :class="{ 'is-invalid' : contactForm.msgTitle.error }"
                @blur="contactForm.msgTitle.setDirty()">
              <div class="invalid-feedback">
                {{ `${ formI18nScope }.msgTitle.error` | translate }}
              </div>
            </div>
            <div class="form-group w-100">
              <label for="name">
                {{ `${ formI18nScope }.msgBody.title` | translate }} *
              </label>
              <textarea class="form-control" required
                rows="10"
                id="msgBody" ref="msgBody"
                :placeholder="`${ formI18nScope }.msgBody.desc` | translate"
                v-model="contactForm.msgBody.value"
                :class="{ 'is-invalid' : contactForm.msgBody.error }"
                @blur="contactForm.msgBody.setDirty()">
              </textarea>
              <div class="invalid-feedback">
                {{ `${ formI18nScope }.msgBody.error` | translate }}
              </div>
            </div>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <button type="submit"
          class="btn btn-primary btn-rounded"
          :disabled="!contactForm.isValid">
          {{ `${ formI18nScope }.submit` | translate }}
          <i class="mdi mdi-arrow-right label ml-3"></i>
        </button>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './add.ts';
  export default Component;
</script>

