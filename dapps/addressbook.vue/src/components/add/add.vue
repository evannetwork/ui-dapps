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
      id="contact-add-modal"
      ref="contactAddModal"
      :maxWidth="'1000px'">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_addressbook.add` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <evan-loading v-if="loading"></evan-loading>
        <template v-else>
          <div class="evan-steps">
            <div class="evan-step-header mt-3">
              <!-- step button is disabled when a previous step was reactived and is currently invalid -->
              <button class="btn"
                v-for="(step, index) of steps"
                :class="{ 'active': activeStep === index, }"
                :disabled="step.disabled(index)"
                :id="`evan-container-create-step-${ index }`"
                @click="activeStep = index">
                <span class="stepper-circle">{{ index + 1}}</span>
                <span>{{ step.title | translate }}</span>
              </button>
            </div>
          </div>
          <div class="white-box border-smooth rounded p-3" v-if="activeStep === 0">
            <p class="w-100">
              {{ `${ formI18nScope }.desc` | translate }}
            </p>

            <contact-form
              :form="contactForm">
            </contact-form>

            <div class="form-group" v-if="contactForm.emailInvite.value">
              <label for="eve">
                {{ `${ formI18nScope }.eve.title` | translate }}
              </label>
              <input class="form-control" required type="number"
                id="eve" ref="eve"
                :placeholder="`${ formI18nScope }.eve.desc` | translate"
                v-model="contactForm.eve.value"
                :class="{ 'is-invalid' : contactForm.eve.error }"
                @blur="contactForm.eve.setDirty()">
              <div class="invalid-feedback">
                {{ contactForm.eve.error | translate }}
              </div>
            </div>

            <p class="w-100 mt-3 bg-warning p-3"
              v-if="contactForm.emailInvite.value">
              {{ `${ formI18nScope }.desc-email` | translate }}
            </p>
          </div>

          <div class="white-box border-smooth rounded p-3" v-if="activeStep === 1">
            <p class="w-100">
              {{ `${ formI18nScope }.bmail.desc` | translate }}
            </p>

            <div class="form-group w-100">
              <label for="name">
                {{ `${ formI18nScope }.fromAlias.title` | translate }} *
              </label>
              <input class="form-control" required
                id="fromAlias" ref="fromAlias"
                :placeholder="`${ formI18nScope }.fromAlias.desc` | translate"
                v-model="mailForm.fromAlias.value"
                :class="{ 'is-invalid' : mailForm.fromAlias.error }"
                @blur="mailForm.fromAlias.setDirty()">
              <div class="invalid-feedback">
                {{ `${ formI18nScope }.fromAlias.error` | translate }}
              </div>
            </div>
            <div class="form-group w-100">
              <label for="name">
                {{ `${ formI18nScope }.msgTitle.title` | translate }} *
              </label>
              <input class="form-control" required
                id="msgTitle" ref="msgTitle"
                :placeholder="`${ formI18nScope }.msgTitle.desc` | translate"
                v-model="mailForm.msgTitle.value"
                :class="{ 'is-invalid' : mailForm.msgTitle.error }"
                @blur="mailForm.msgTitle.setDirty()">
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
                v-model="mailForm.msgBody.value"
                :class="{ 'is-invalid' : mailForm.msgBody.error }"
                @blur="mailForm.msgBody.setDirty()">
              </textarea>
              <div class="invalid-feedback">
                {{ `${ formI18nScope }.msgBody.error` | translate }}
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-slot:footer v-if="!loading">
        <button type="submit" class="btn btn-primary "
          v-if="activeStep === 0"
          :disabled="!contactForm.isValid"
          @click="activeStep = 1">
          {{ `${ formI18nScope }.continue` | translate }}
          <i class="mdi mdi-arrow-right label ml-3"></i>
        </button>
        <button type="submit" class="btn btn-primary "
          v-else
          :disabled="!mailForm.isValid"
          @click="addContact">
          {{ `${ formI18nScope }.submit` | translate }}
          <i class="mdi mdi-arrow-right label ml-3"></i>
        </button>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './add';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './add.scss';
</style>
