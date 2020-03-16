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
    <template v-if="!loading">
      <div v-if="!notLoadedButSignedIn">
        <div
          v-if="!inviteeAddress"
          class=""
          v-html="$t('_onboarding.signed-in.welcome-unlocked', { 'alias': alias, 'accountId': accountId })"
        />
        <div
          v-if="inviteeAddress"
          class="border p-3 bg-level-3"
        >
          <p
            v-html="$t('_onboarding.signed-in.invited', {
              'alias': alias,
              'accountId': accountId,
              'inviteeAlias': $route.query.inviteeAlias,
              'eveAmount': $route.query.eveAmount
            })"
          />
        </div>

        <evan-modal ref="acceptingError">
          <template v-slot:header>
            <h5 class="modal-title">
              {{ '_onboarding.sign-up.profile-create-error.desc' | translate }}
            </h5>
          </template>
          <template v-slot:footer>
            <button
              type="button"
              class="btn btn-primary font-weight-normal"
              @click="$refs.acceptingError.hide()"
            >
              {{ '_onboarding.sign-up.profile-create-error.ok' | translate }}
            </button>
          </template>
        </evan-modal>

        <div class="mt-3">
          <evan-success v-if="accepted" />
          <div
            v-if="!accepted"
            class="text-center m-3"
          >
            <evan-loading v-if="accepting" />
            <button
              v-if="!accepting && inviteeAddress"
              type="submit"
              class="btn btn-primary btn-block"
              @click="acceptContact()"
            >
              <span>{{ '_onboarding.signed-in.accept-contact' | translate }}</span>
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="notLoadedButSignedIn"
        v-html="$t('_onboarding.signed-in.welcome-signed-in', { 'accountId': accountId })"
      />

      <div class="mt-3 text-center">
        <button
          v-if="!accepting && !inviteeAddress"
          type="submit"
          class="btn btn-outline-primary btn-block"
          :class="inviteeAddress ? 'evan-button evan-cancel' : ''"
          @click="navigateToEvan()"
        >
          <span>{{ '_onboarding.signed-in.go-to-evan' | translate }}</span>
        </button>
      </div>
    </template>

    <evan-loading v-if="loading" />
  </div>
</template>

<script lang="ts">
import AcceptContact from './accept-contact';

export default AcceptContact;
</script>
