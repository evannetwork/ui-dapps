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
    <form class="content" id="dbcp-form"
      v-on:submit.prevent="_dbcpForm.isValid && $emit('submit', _dbcpForm)">
      <slot name="before-inputs"></slot>
      <div class="form-group">
        <label for="name">
          {{ `_datacontainer.dbcp.name.title` | translate }}
        </label>
        <input class="form-control" required
          id="name" ref="name"
          :placeholder="`_datacontainer.dbcp.name.desc` | translate"
          v-model="_dbcpForm.name.value"
          :class="{ 'is-invalid' : _dbcpForm.name.error }"
          @blur="_dbcpForm.name.setDirty()">
        <div class="invalid-feedback">
          {{ `_datacontainer.dbcp.name.error` | translate }}
        </div>
      </div>
      <div class="form-group">
        <label for="description">
          {{ `_datacontainer.dbcp.description.title` | translate }}
        </label>
        <textarea class="form-control" rows="7"
          id="description" ref="description"
          :placeholder="`_datacontainer.dbcp.description.desc` | translate"
          v-model="_dbcpForm.description.value"
          :class="{ 'is-invalid' : _dbcpForm.description.error }"
          @blur="_dbcpForm.description.setDirty()">
        </textarea>
        <slot name="after-inputs"></slot>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
  import Component from './dbcp.ts';
  export default Component;
</script>
