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
  <div class="layout-wrapper w-100">
    <div class="col col-lg-6 left-panel">
      <img class="evan-logo"
        :src="$store.state.onboardingBaseUrl + `/assets/logo.png`">
      <div class="h-100">
        <div class="w-100">
          <div class="banner-wrapper">
            <img
              :src="$store.state.onboardingBaseUrl + `/assets/left-panel/${ images[step] }`"
              @load="setImageStyle()"
              class="desc-banner">
          </div>
          <h2 class="mx-8 mb-2 font-weight-bold text-dark" >
            {{ `_onboarding.headings.${ type }.${ step }.title` | translate }}
          </h2>
          <h3 class="mx-8 text-dark"
            v-html="$t(`_onboarding.headings.${ type }.${ step }.desc`)">
          </h3>
        </div>
      </div>
    </div>
    <div class="col col-lg-6 content-wrapper" style="display: grid">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './layout-wrapper';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './layout-wrapper.scss';
</style>