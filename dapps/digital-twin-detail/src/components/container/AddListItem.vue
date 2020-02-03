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
  <form
    id="addListItem"
    ref="addListItem"
    @submit.prevent="addDigitalTwin"
  >
    <evan-swipe-panel
      ref="addListItemPanel"
      alignment="right"
      type="default"
      class="light"
      :show-backdrop="true"
      :hide-close-button="true"
      :title="$t('_twin-detail.data.list.add-list-item.title')"
    >
      <data-set-form
        :data-schema="schema.items"
        :is-loading="$store.state.container.dispatcherStates.entries[name]"
        :name="name"
        :value="value"
        :only-form="true"
        @init="dataSetForm = $event"
      />
      <template v-slot:footer>
        <div class="d-flex">
          <evan-button
            type="secondary"
            :label="'_twin-detail.data.list.add-list-item.cancel' | translate"
            @click="closePanel"
          />
          <evan-button
            type="primary"
            native-type="submit"
            class="ml-3 flex-grow-1"
            :is-loading="loading"
            :disabled="!isValid()"
            :label="'_twin-detail.data.list.add-list-item.submit' | translate"
            @click="onSave()"
          />
        </div>
      </template>
    </evan-swipe-panel>
  </form>
</template>

<script lang="ts">
import AddListItemComponent from './AddListItem';

export default AddListItemComponent;
</script>

<style lang="scss" scoped>
// @import './AddDigitalTwins.scss';
</style>
