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
    <data-set-form
      v-if="!$store.state.reloadFlags[$route.params.container][name]"
      :data-schema="entrySchema"
      :is-loading="$store.state.container.dispatcherStates.entries[name]"
      :name="name"
      :value="getValue()"
      :shareable="$store.state.container.isOwner"
      :editable="isEditable"
      :handle-share="onShare"
      :prohibited="isProhibited()"
      @save="onSave($event)"
    />
    <share-container
      v-if="$store.state.container.isOwner"
      ref="shareContainer"
    />
  </div>
</template>

<script lang="ts">
import ContainerEntryComponent from './Entry';

export default ContainerEntryComponent;
</script>
