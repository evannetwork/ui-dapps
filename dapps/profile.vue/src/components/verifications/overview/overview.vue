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
        <button type="button" class="btn btn-primary"
          id="ident-request"
          @click="$refs.orgIdentIssue.show()">
          {{ `_profile.verifications.notary.issue.issue` | translate }}
          <i class="mdi mdi-arrow-right label ml-3"></i>
        </button>
      </div>
    </div>
    <div class="w-100 mt-5 d-flex flex-wrap flex-row"
      v-if="!rerender">
      <evan-loading v-if="loading"></evan-loading>
      <template v-else>
        <div class="text-center mt-5" v-if="type !== 'company'">
          <h5>{{ '_profile.type.no-verifications-avaiable' | translate }}</h5>
        </div>
        <template v-else-if="type === 'company'">
          <notary-verification :address="address"></notary-verification>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './overview';
  export default Component;
</script>

<style lang="scss">
  @import './overview.scss'
</style>