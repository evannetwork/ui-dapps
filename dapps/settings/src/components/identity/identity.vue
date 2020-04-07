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
  <div class="evan-content-container">
    <evan-loading v-if="loading" />
    <template v-else-if="!useIdentity">
      <h3>{{ '_settings.identity.not-support' | translate }}</h3>
    </template>
    <template v-else>
      <evan-searchbox
        id="searchBox"
        ref="searchBox"
        :debounce-time="250"
        @keyup="$set(table, 'filter', $refs.searchBox.searchTerm)"
      >
        <span>{{ '_settings.routes.identity' | translate }}</span>
      </evan-searchbox>

      <identity-sidepanel
        ref="identitySidepanel"
        :contacts="contacts"
      />

      <evan-table
        class="clickable-rows"
        primary-key="address"
        :items="permittedContacts"
        :fields="table.columns"
        :filter="table.filter"
        :filter-included-fields="table.filterBy"
        :show-empty="true"
        :show-scrollbar="true"
        :sticky-header="'calc(100vh - 85px)'"
        :tbody-transition-props="{ name: 'list', mode: 'out-in' }"
        @row-clicked="$refs.identitySidepanel.show($event)"
      >
        <template v-slot:cell(displayName)="contact">
          {{
            contact.item.displayName || contact.item.address
          }}
        </template>
        <template v-slot:cell(note)="contact">
          {{
            contact.item.note
          }}
        </template>
        <template v-slot:cell(icon)="contact">
          <i
            class="table-icon"
            :class="contact.item.icon"
          />
        </template>
        <template v-slot:cell(granted)="contact">
          {{ contact.item.granted | moment('L') }}
        </template>
        <template v-slot:cell(actions)="contact">
          <evan-loading
            v-if="granting[contact.item.address]"
          />
        </template>
        <template v-slot:table-caption>
          <div class="table-spacer" />
        </template>

        <!-- Empty slots -->
        <template v-slot:empty>
          <span>{{ '_settings.identity.table.empty.text' | translate }}</span>
        </template>
        <template v-slot:emptyfiltered>
          <span>{{ '_settings.identity.table.empty.filtered' | translate }}</span>
        </template>
      </evan-table>
    </template>
  </div>
</template>

<script lang="ts">
import Component from './identity';

export default Component;
</script>
