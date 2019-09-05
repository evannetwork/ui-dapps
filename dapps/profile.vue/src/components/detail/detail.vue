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
  <div class="container-wide">
    <evan-loading v-if="loading"></evan-loading>
    <template v-else>
      <contact-detail ref="contactDetailModal"></contact-detail>
      <evan-logout ref="evanLogout" :disableButton="true"></evan-logout>

      <div class="d-flex mb-5 align-items-center">
        <div style="width: calc(100% - 200px)">
          <h3 class="font-weight-bold mb-0 force-oneline bg-level-3">
            {{ '_profile.detail.desc' | translate }}
          </h3>
        </div>
        <span class="mx-auto"></span>
        <div class="d-flex align-items-center">
          <button type="button" class="btn btn-icon mr-3"
            @click="$refs.contactDetailModal.show(accountId);">
            <i class="mdi mdi-pencil-outline"></i>
            <evan-tooltip :placement="'bottom'">
              {{ `_profile.detail.edit` | translate }}
            </evan-tooltip>
          </button>
          <button type="button" class="btn btn-icon"
            @click="$refs.evanLogout.logout();">
            <i class="mdi mdi-logout"></i>
            <evan-tooltip :placement="'bottom'">
              {{ '_evan.logout' | translate }}
            </evan-tooltip>
          </button>
        </div>
      </div>

      <div class="white-box border-smooth rounded p-4">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="d-block mb-0">
              {{ '_profile.detail.alias' | translate }}
            </label>
            <span>
              {{ alias }}
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="d-block mb-0">
              {{ '_profile.detail.account-id' | translate }}
            </label>
            <a target="_blank"
              :href="`https://testexplorer.evan.network/address/${ accountId }/transactions`">
              {{ accountId }}
            </a>
          </div>

          <div class="col-md-6 mb-3">
            <label class="d-block mb-0">
              {{ '_profile.detail.balance' | translate }}
            </label>
            <span>
              {{ balance }} EVE
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
  import Component from './detail.ts';
  export default Component;
</script>

