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
  <div class="content-card">
    <div class="d-flex justify-content-between align-items-center pb-1">
      <div>
        <h5 class="my-0 py-0 font-weight-bold d-flex">
          <i class="mdi mr-2 mdi-lock" />
          <div>
            {{ $t(`${$route.params.container}.${name}`, name) }}
            <small class="d-block">
              {{ getValues().length }} / {{ totalEntries }}
            </small>
          </div>
        </h5>
      </div>
      <div>
        <evan-button
          v-if="$store.state.container.isOwner"
          type="secondary"
          size="sm"
          @click="onShare"
        >
          {{ '_evan.share' | translate }}
        </evan-button>
        <b-dropdown
          :id="`dataset-list-${name}-dropdown`"
          class="p-0"
          variant="link"
          toggle-class="text-decoration-none"
          no-caret
        >
          <template v-slot:button-content>
            <evan-button
              :type="'icon-secondary'"
              icon="mdi mdi-dots-vertical"
            />
          </template>
          <b-dropdown-item disabled>
            {{ '_twin-detail.data.list.show-all' | translate }}
          </b-dropdown-item>
          <b-dropdown-item
            :id="`dataset-list-${name}-add`"
            :disabled="!isEditable"
            @click="$refs.addListItem.showPanel()"
          >
            {{ '_twin-detail.data.list.add-list-item.title' | translate }}
            <i
              v-if="!isEditable"
              class="mdi mdi-eye-off-outline text-right w-100"
            />
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>

    <add-list-item
      ref="addListItem"
      :name="name"
      :schema="schema"
    />

    <list-item-detail
      ref="listItemDetail"
      :name="name"
      :schema="schema"
      :value="selectedValue"
    />

    <share-container
      v-if="$store.state.container.isOwner"
      ref="shareContainer"
    />

    <div class="mt-3">
      <evan-table
        v-if="!$store.state.reloadFlags[$route.params.container][name]"
        class="simple clickable-rows"
        :fields="columns"
        :items="getValues()"
        :responsive="true"
        :show-empty="true"
        :sticky-header="'500px'"
        @row-clicked="openDetail"
      >
        <template v-slot:cell(__loading)="value">
          <div
            v-if="isValueLoading(value.item)"
            class="spinner-border spinner-border-sm"
          />
        </template>
        <template v-slot:cell()="value">
          {{ transformValuesForDisplay(value.item, value.field.key) }}
        </template>

        <template v-slot:empty>
          <span>{{ '_twin-detail.data.table-empty' | translate }}</span>
        </template>
      </evan-table>
    </div>
  </div>
</template>

<script lang="ts">
import ContainerListComponent from './List';

export default ContainerListComponent;
</script>

<style lang="scss" scoped>
/deep/ .dropdown.b-dropdown {
  & > button.btn {
    padding: 0;
  }
}

/deep/ .loading-cell {
  width: 30px;
  min-width: 30px;
}
</style>
