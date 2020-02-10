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
      <evan-form-dbcp
        :description="$store.state.twin.description"
        :is-loading="$store.state.twin.dispatcherStates.description"
        :shareable="false"
        :title="'_twin-detail.data.general.information-title' | translate"
        :editable="isOwner"
        @init="dbcpForm = $event"
        @save="setDescription();"
      >
        <evan-form-control-input
          :disabled="true"
          :label="'_twin-detail.data.general.type' | translate"
          :required="true"
          :value="'_twin-detail.data.general.type-value' | translate"
        />

        <evan-form-control-input
          :disabled="true"
          :label="'_twin-detail.data.general.owner' | translate"
          :required="true"
          :value="`${ $store.state.twin.ownerName } (${ $store.state.twin.ownerAddress })`"
        />
      </evan-form-dbcp>
    </div>
  </div>
</template>

<script lang="ts">
import DigitalTwinDetailDataGeneralComponent from './DetailDataGeneral';

export default DigitalTwinDetailDataGeneralComponent;
</script>

<style lang="scss" scoped>
.form-group.inline {
   align-items: center;

   & > label.col-form-label {
    font-size: 12px;
  }
}
</style>
