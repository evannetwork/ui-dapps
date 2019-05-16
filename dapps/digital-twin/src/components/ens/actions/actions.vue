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
    <evan-modal
      :id="`evan-dt-lookup-modal-${ lookupModalScope }`"
      ref="lookupModal">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_digitaltwins.lookup.${ lookupModalScope }.title` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <p class="text-left m-0"
          v-html="$t(`_digitaltwins.lookup.${ lookupModalScope }.desc`, modalParams)">
        </p>
      </template>
      <template v-slot:footer
        v-if="lookupModalScope === 'purchase' || lookupModalScope === 'create'">
        <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
          id="dt-ens-create"
          v-if="lookupModalScope === 'create'"
          @click="$refs.lookupModal.hide(); checkAddress(undefined, true);">
          {{ `_digitaltwins.lookup.${ lookupModalScope }.action` | translate }}
        </button>
        <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
          id="dt-ens-purchase"
          v-else-if="lookupModalScope === 'purchase'"
          @click="purchaseAdress();">
          {{ `_digitaltwins.lookup.${ lookupModalScope }.action` | translate }}
        </button>
      </template>
    </evan-modal>
    <div class="text-center"
      id="dt-ens-purchasing"
      v-if="purchasing">
      <h4 class="mt-5 mb-3">{{ '_digitaltwins.lookup.purchasing' | translate }}</h4>
      <b>
        {{ purchasingInstances.map(instance => instance.data.ensAddress).join(', ') }}
      </b>
      <evan-loading></evan-loading>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './actions.ts';
  export default Component;
</script>
