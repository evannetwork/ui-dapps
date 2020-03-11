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
    <evan-loading v-if="loading"></evan-loading>
    <div class="white-box border-smooth rounded mt-3 p-4" v-else>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="d-block mb-0">
            {{ '_datacontainer.technical.address' | translate }}
          </label>
          <a target="_blank"
            :href="`${ explorerUrl }/address/${ containerAddress }/transactions`">
            {{ containerAddress }}
          </a>
          <br>
          <a class="btn btn-primary mt-3 d-inline-block" target="_blank"
            :href="`${ dapp.baseUrl }/explorer.evan/detail/${ containerAddress }/general`">
            {{ '_datacontainer.technical.in-explorer' | translate }}
          </a>
        </div>

        <div class="col-md-6 mb-3">
          <label class="d-block mb-0">
            {{ '_datacontainer.technical.owner' | translate }}
          </label>
          <a target="_blank"
            :href="`${ explorerUrl }/address/${ owner }/transactions`">
            {{ owner }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './technical.ts';
  export default Component;
</script>
