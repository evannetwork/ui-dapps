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
          {{ '_org.ident.notary.title' | translate }}
        </h3>
      </div>
      <span class="mx-auto"></span>
      <div v-if="!loading">
        <org-ident-notary-request
          ref="identAction">
        </org-ident-notary-request>
        <a class="btn btn-primary btn-rounded" target="_blank"
          :id="`ident-request-unkown`"
          @click="$refs.identAction.show()">
          {{ `_org.ident.notary.status-actions.unkown` | translate }}
          <i class="mdi mdi-arrow-right label ml-3"></i>
        </a>
      </div>
    </div>

    <evan-loading v-if="loading"></evan-loading>
    <div v-else>
      <div class="mt-3"
        v-for="(requestId, index) in requests">
        <org-ident-notary-detail
          :requestId="requestId">
        </org-ident-notary-detail>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './overview.ts';
  export default Component;
</script>
