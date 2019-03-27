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
        <div class="d-flex pl-3 pr-3 pt-4 pb-4 border-bottom align-items-center">
          <h4 class="m-0">
            {{ `_mailbox.add` | translate }}
          </h4>
        </div>

        <form class="p-4" v-on:submit.prevent="sendMail">
          <!-- <div class="form-group">
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

          <div class="text-center mt-3 w-100">
            <button type="submit"
              class="btn btn-rounded btn-primary"
              :disabled="!contactForm.isValid">
              {{ `${ formI18nScope }.submit` | translate }}
            </button>
          </div> -->
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './add.ts';
  export default Component;
</script>

