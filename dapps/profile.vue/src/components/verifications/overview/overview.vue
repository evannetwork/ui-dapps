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
  <div class="profile-verification-overview container-wide h-100">
    <div class="d-flex align-items-center">
      <div class="d-flex align-items-center">
        <h3 class="font-weight-bold mb-0">
          {{ '_profile.verifications.title' | translate }}
        </h3>

        <button class="btn" @click="rerender = true; $nextTick(() => rerender = false);">
          <i class="mdi mdi-reload"></i>
          <evan-tooltip :placement="'bottom'">
            {{ `_profile.verifications.reload` | translate }}
          </evan-tooltip>
        </button>
      </div>
      <span class="mx-auto"></span>
      <div v-if="canIssue">
        <notary-action-issue
          :address="address"
          ref="orgIdentIssue">
        </notary-action-issue>
        <button type="button" class="btn btn-primary "
          id="ident-request"
          @click="$refs.orgIdentIssue.show()">
          {{ `_profile.verifications.notary.issue.issue` | translate }}
          <i class="mdi mdi-arrow-right label ml-3"></i>
        </button>
      </div>
    </div>
    <div class="w-100 mt-5 d-flex flex-wrap flex-row"
      v-if="!rerender">
      <notary-verification :address="$route.params.address"></notary-verification>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './overview.ts';
  export default Component;
</script>

<style lang="scss">
  @import './overview.scss'
</style>