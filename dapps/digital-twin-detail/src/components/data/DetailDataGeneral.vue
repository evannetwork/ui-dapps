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
    <div class="content-card">
      <!-- <h2 class="card-heading">{{ '_twin-detail.data.general.information-title' | translate }}</h2> -->

      <evan-form
        :title="'_twin-detail.data.general.information-title' | translate"
      >
        <evan-form-control-input
          v-model="name"
          :value="'hi'"
          :label="$t('_twin-detail.data.general.name')"
          :placeholder="$t('_twin-detail.data.general.name-placeholder')"
          :required="true"
        />

        <evan-form-control-textarea
          v-model="description"
          :label="$t('_twin-detail.data.general.desc')"
          :placeholder="$t('_twin-detail.data.general.desc-placeholder')"
        />

        <evan-form-control-input
          v-model="type"
          :label="$t('_twin-detail.data.general.type')"
          :disabled="true"
          :required="true"
        />

        <evan-form-control-input
          v-model="owner"
          :label="$t('_twin-detail.data.general.owner')"
          :disabled="true"
          :required="true"
        />
      </evan-form>
    </div>
  </div>
</template>

<script lang="ts">
import DigitalTwinDetailDataGeneralComponent from './DetailDataGeneral';
export default DigitalTwinDetailDataGeneralComponent;
</script>

<style lang="scss" scoped>
.content-card {
  background: white;
  border-radius: 4px;
  width: 564px;
  padding: 32px 24px;

  .card-heading {
    font-size: 16px;
    text-transform: uppercase;
    font-weight: bold;
  }
}
</style>
