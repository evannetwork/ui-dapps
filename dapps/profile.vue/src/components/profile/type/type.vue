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
            v-for="(newType, index) in types"
            :class="{
              'ml-3': index !== 0,
              'evan-highlight active': type === newType,
            }"
            @click="type = newType">
            <evan-profile-picture
              class="mb-3"
              :src="`${ $store.state.profileBaseUrl }/assets/${ newType }.svg`"
              :type="newType"
              size="lg"
            />
            <h5 class="mb-3">{{ `_evan.profile.types.${ newType }` | translate }}</h5>
            <small class="text-muted">{{ `_evan.profile.types.${ newType }-desc` | translate }}</small>
          </evan-card>
        </div>
      </template>
      <template v-slot:footer>
        <div>
          <button type="button" class="btn btn-primary"
            :disabled="type === initialType"
            @click="typeChanged();">
            {{ `_profile.type.change` | translate }}
            <i class="mdi mdi-arrow-right label ml-3"></i>
          </button>
        </div>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './type';
  export default Component;
</script>
