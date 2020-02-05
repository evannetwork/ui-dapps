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
  <evan-form-control
    class="evan-file-input"
    v-bind="$props"
  >
    <evan-modal
      id="file-input-remove-modal"
      ref="removeFileModal"
      @close="fileRemove = -1;"
    >
      <template v-slot:header>
        <h5 class="modal-title">
          {{ `_evan.file-input.remove-modal.title` | translate }}
        </h5>
      </template>
      <template v-slot:body>
        <p
          class="text-left m-0"
          v-html="$t(`_evan.file-input.remove-modal.desc`, modalParams)"
        />
      </template>
      <template v-slot:footer>
        <button
          id="file-input-remove-accept"
          type="button"
          class="btn btn-primary btn-rounded font-weight-normal"
          @click="removeFile($event, value[fileRemove], fileRemove)"
        >
          {{ `_evan.file-input.remove-modal.action` | translate }}
          <i class="mdi mdi-arrow-right label ml-3" />
        </button>
      </template>
    </evan-modal>

    <div
      v-for="(file, index) in value"
      :key="index"
      class="batch-label ml-0 mr-2 my-2"
    >
      <span>{{ file.name }}</span>

      <a
        :id="`file-input-download-${ index }`"
        class="btn p-0 ml-3"
        :href="file.blobUri"
        :download="file.name"
      >
        <i class="mdi mdi-download-outline" />
      </a>
      <button
        v-if="!disabled"
        id="file-input-remove"
        class="btn p-0 ml-1 delete"
        @click="removeFile($event, file, index)"
      >
        <i class="mdi mdi-delete-outline" />
      </button>
    </div>

    <div
      v-if="!disabled"
      class="dropzone"
      :class="{ 'border-secondary': hovered }"
      @drag-end="hovered = false"
      @drag-enter="hovered = true"
      @drag-leave="hovered = false"
      @drag-over="hovered = true"
      @drag-start="hovered = true"
      @drag="hovered = true"
      @drop="hovered = false"
    >
      <input
        id="file-input-upload"
        type="file"
        multiple
        :accept="accept"
        :name="name"
        @focus="$parent.$emit('setFocus', true)"
        @change="filesChanged($event.target.files)"
      >
      <div
        class="centered p-3"
        :class="{ 'text-secondary': hovered }"
      >
        {{ placeholder | translate }}
      </div>
    </div>
    <div
      v-else-if="value.length === 0"
      class="centered p-3"
    >
      {{ emptyText | translate }}
    </div>
  </evan-form-control>
</template>

<script lang="ts">
import Component from './files';

export default Component;
</script>

<style lang="scss" scoped>
  @import './files';
</style>
