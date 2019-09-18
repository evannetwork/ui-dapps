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
      ref="modal"
      :maxWidth="'800px'">
      <template v-slot:header>
        <h5 class="modal-title">
          {{ '_profile.type.switch' | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <div class="d-flex">
          <evan-card class="clickable fixed-size"
            icon="mdi mdi-check-decagram"
            v-for="(type, index) in types"
            :class="{
              'ml-3': index !== 0,
              'evan-highlight active': profileType === type,
            }"
            :highlight="false"
            :title="`_evan.profile.types.${ type }` | translate"
            @click="profileType = type"
          />
        </div>
      </template>
      <template v-slot:footer>
        <div>
          <button type="button" class="btn btn-primary "
            @click="typeChanged();">
            {{ `_profile.type.change` | translate }}
            <div class="spinner-border spinner-border-sm text-light ml-3" v-if="issuing"></div>
            <i class="mdi mdi-arrow-right label ml-3" v-else></i>
          </button>
        </div>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './type.ts';
  export default Component;
</script>
