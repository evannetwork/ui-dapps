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
    <div class="d-flex align-items-center mb-5">
      <div>
        <h3 class="font-weight-bold mb-0">
          {{ '_org.overview.title' | translate }}
        </h3>
      </div>
      <span class="mx-auto"></span>
      <div v-if="!loading">
        <org-ident-notary-issue
          ref="orgIdentIssue">
        </org-ident-notary-issue>
        <button type="button" class="btn btn-primary btn-rounded"
          id="ident-request"
          @click="$refs.orgIdentIssue.show()">
          {{ `_org.ident.notary.issue.issue` | translate }}
          <i class="mdi mdi-arrow-right label ml-3"></i>
        </button>
      </div>
    </div>

    <evan-loading v-if="loading"></evan-loading>
    <div v-else>
      <div class="row content pt-1 pb-0"
        :id="`evan-org-overview`">
        <div class="col-md-12 col-lg-6 col-xl-4 mb-4"
          v-for="(address, index) in Object.keys(organizations)">
          <a class="d-flex bg-level-1 border-smooth rounded evan-highlight w-100"
            :id="`evan-org-${ address }`"
            :href="`${ dapp.fullUrl }/${ address }`">
            <div class="px-3 py-2" style="overflow: visible">
              <img class="img-fluid p-3"
                v-if="organizations[address].img"
                :src="organizations[address].img">
              <i
                class="mdi mdi-domain text-muted"
                style="font-size: 50px;">
              </i>
            </div>
            <div class="d-flex align-items-center w-100">
              <div class="w-100 p-3" style="height: 81px; max-width: calc(100% - 20px)">
                <h4 class="font-weight-semibold mb-0 force-oneline">
                  {{ organizations[address].alias }}
                </h4>
                <span class="font-weight-semibold text-muted force-oneline">
                  {{ `_org.types.${ organizations[address].type }` | translate }}
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './overview.ts';
  export default Component;
</script>
