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
    <div class="white-box border-smooth rounded mt-3 p-4">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="d-block mb-0">
            {{ '_datacontainer.technical.address' | translate }}
          </label>
          <a target="_blank"
            :href="`${ explorerUrl }/address/${ uiDT.address }/transactions`">
            {{ uiDT.address }}
          </a>
          <br>
          <a class="btn btn-primary btn-rounded mt-3 d-inline-block" target="_blank"
            :href="`${ dapp.baseUrl }/explorer.evan/detail/${ uiDT.address }/general`">
            {{ '_datacontainer.technical.in-explorer' | translate }}
          </a>
        </div>

        <div class="col-md-6 mb-3">
          <label class="d-block mb-0">
            {{ '_datacontainer.technical.owner' | translate }}
          </label>
          <a target="_blank"
            :href="`${ explorerUrl }/address/${ uiDT.owner }/transactions`">
            {{ uiDT.owner }}
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
