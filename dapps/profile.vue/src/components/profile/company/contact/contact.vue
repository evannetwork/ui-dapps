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
      ref="form"
      :editable="onlyForm || $store.state.profileDApp.permissions.readWrite.indexOf('contact') !== -1"
      :enableCancel="onlyEdit ? false : true"
      :form="form"
      :handleShare="() => $store.commit('toggleSidePanel', 'sharing')"
      :i18nScope="'_profile.company.contact'"
      :isLoading="!onlyForm && $store.state.dispatcher.curr.running.updateProfileDispatcher"
      :onlyForm="onlyForm"
      :shareable="$store.state.runtime && $route.params.address === $store.state.runtime.activeIdentity"
      :stacked="stacked"
      :title="'_profile.company.contact.title' | translate"
      @save="changeProfileData()">
    </evan-form>
  </div>
</template>

<script lang="ts">
  import Component from './contact';
  export default Component;
</script>
