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
    <evan-form
      :editable="onlyForm || $store.state.profileDApp.permissions.readWrite.indexOf('deviceDetails') !== -1"
      :form="deviceDetailForm"
      :handleShare="() => $store.commit('toggleSidePanel', 'sharing')"
      :i18nScope="'_profile.device.detail'"
      :isLoading="$store.state.dispatcher.curr.running.updateProfileDispatcher"
      :shareable="$route.params.address === $store.state.runtime.activeIdentity"
      :title="'_profile.device.detail.title' | translate"
      @save="changeProfileData()">
    </evan-form>
  </div>
</template>

<script lang="ts">
  import Component from './detail';
  export default Component;
</script>
