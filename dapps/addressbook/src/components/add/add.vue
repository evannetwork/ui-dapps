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
    <div class="p-3 text-left">
      <div class="bg-level-1 border">
        <div class="d-flex p-3 border-bottom align-items-center">
          <h4 class="m-0">
            {{ `_addressbook.add` | translate }}
          </h4>
        </div>

        <form class="p-4" v-on:submit.prevent="addContact">
          <div class="form-group">
            <label for="alias">
              {{ `${ formI18nScope }.alias.title` | translate }}
            </label>
            <input class="form-control" required
              id="alias" ref="alias"
              :placeholder="`${ formI18nScope }.alias.desc` | translate"
              v-model="contactForm.alias.value"
              v-bind:class="{ 'is-invalid' : contactForm.alias.error }"
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
                  {{ `${ formI18nScope }.address.title` | translate }}
                </label>
                <input class="form-control" required
                  id="address" ref="address"
                  :disabled="contactForm.emailInvite.value"
                  :placeholder="`${ formI18nScope }.address.desc` | translate"
                  v-model="contactForm.address.value"
                  v-bind:class="{ 'is-invalid' : contactForm.address.error }"
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
                  {{ `${ formI18nScope }.email.title` | translate }}
                </label>
                <input class="form-control" required
                  id="email" ref="email"
                  :disabled="!contactForm.emailInvite.value"
                  :placeholder="`${ formI18nScope }.email.desc` | translate"
                  v-model="contactForm.email.value"
                  v-bind:class="{ 'is-invalid' : contactForm.email.error }"
                  @blur="contactForm.email.setDirty()">
                <div class="invalid-feedback">
                  {{ `${ formI18nScope }.email.error` | translate }}
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-3 w-100">
            <button type="submit"
              class="btn btn-rounded btn-primary"
              :disabled="!contactForm.isValid">
              {{ `${ formI18nScope }.submit` | translate }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './add.ts';
  export default Component;
</script>

