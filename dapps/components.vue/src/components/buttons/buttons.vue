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
  <div class="container py-3">
    <h1>{{ '_comp.buttons' | translate }}</h1>
    <p>The buttons have been clicked <b>{{ btnCounter }}</b> times.</p>

    <div class="white-box border">
      <h3 class="header">Button Status</h3>

      <div class="content">
        <div class="row">
          <div class="col-md-6 form-group ">
            <label>
              disabled
              <input class="form-control" type="checkbox" v-model="disabled">
            </label><br />
            <label>
              isLoading
              <input class="form-control" type="checkbox" v-model="isLoading"/>
            </label>
          </div>
          <div class="form-group mb-0 col-md-6">
            <span>Button Size</span>
            <select class="form-control custom-select"
              ref="type"
              v-model="size">
              <option value="lg">lg</option>
              <option value="normal">normal</option>
              <option value="sm">sm</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="white-box border border-sm mt-3"
      v-for="(type) in [
        'primary', 'secondary',
        'text-primary', 'text-secondary',
        'link',
        'danger'
      ]"
      :key="type">
      <h3 class="header">{{ type }}</h3>

      <div class="content">
        <evan-button
          class="mb-3"
          :size="size" :type="type" :disabled="disabled" :label="type" :isLoading="isLoading"
          @click="btnCounter += 1"
        />

        <evan-button
          class="mb-3"
          :size="size" :type="type" :disabled="disabled" :isLoading="isLoading"
          :label="`${type} icon left`"
          icon="mdi-arrow-left"
          iconPosition="left"
          @click="btnCounter += 1"
        />

        <evan-button
          class="mb-3"
          :size="size" :type="type" :disabled="disabled" :isLoading="isLoading"
          :label="`${type} icon right(default)`"
          icon="mdi-arrow-right"
          @click="btnCounter += 1"
        />

        <evan-button
          class="mb-3"
          :size="size" :type="type" :disabled="disabled" :isLoading="isLoading"
          label="YUMMY"
          @click="btnCounter += 1">
          <i class="mdi left mdi-arrow-left"></i>
          {{ type }} custom content &nbsp;
          <div class="spinner-border left spinner-border-sm"></div>
          <i class="mdi left mdi-arrow-right"></i>
        </evan-button>
      </div>
    </div>

    <div class="white-box border border-sm mt-3">
      <h3 class="header">icon-primary</h3>

      <div class="content">
        <evan-button
          class="mb-3"
          :size="size" type="icon-primary" :disabled="disabled"
           @click="btnCounter += 1">
          <i class="mdi mdi-plus"></i>
        </evan-button>
        <evan-button
          class="mb-3"
          :size="size" type="icon-primary" :disabled="disabled"
           @click="btnCounter += 1">
          <i class="mdi mdi-delete"></i>
        </evan-button>

        <evan-button
          class="mb-3"
          :size="size" type="icon-primary" :disabled="disabled"
           @click="btnCounter += 1">
          <i class="mdi mdi-plus-circle-outline"></i>
        </evan-button>
        <evan-button
          class="mb-3"
          :size="size" type="icon-primary" :disabled="disabled"
           @click="btnCounter += 1">
          <i class="mdi mdi-delete-circle-outline"></i>
        </evan-button>
      </div>
    </div>

    <div class="white-box border border-sm mt-3">
      <h3 class="header">icon-secondary</h3>

      <div class="content">
        <evan-button
          class="mb-3"
          :size="size" type="icon-secondary" :disabled="disabled"
           @click="btnCounter += 1">
          <i class="mdi mdi-plus"></i>
        </evan-button>
        <evan-button
          class="mb-3"
          :size="size" type="icon-secondary" :disabled="disabled"
           @click="btnCounter += 1">
          <i class="mdi mdi-delete"></i>
        </evan-button>

        <evan-button
          class="mb-3"
          :size="size" type="icon-secondary" :disabled="disabled"
           @click="btnCounter += 1">
          <i class="mdi mdi-plus-circle-outline"></i>
        </evan-button>
        <evan-button
          class="mb-3"
          :size="size" type="icon-secondary" :disabled="disabled"
           @click="btnCounter += 1">
          <i class="mdi mdi-delete-circle-outline"></i>
        </evan-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './buttons';
  export default Component;
</script>
