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
  <div class="d-flex flex-wrap flex-row justify-content-between">
    <div class="row w-100 m-0"
      v-if="Array.isArray(data)">
      <div class="array-header"
        v-for="(key, index) in Object.keys(dataSchema.items.properties)"
        :class="[ `col-${ Math.round(12 / Object.keys(dataSchema.items.properties).length) }` ]">
        {{ getTranslationFromDBCP(`${ dataSetName }.properties.${ key }.label`) }}
      </div>
    </div>
    <div class="w-100 mt-3">
      <evan-form
        class="w-100"
        v-for="(form) in forms"
        :i18nScope="'_onboarding.sign-up.twin.metadata'"
        :onlyForm="true"
        :stacked="true"
        :form="form">
      </evan-form>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './data-set-form.ts';
  export default Component;
</script>

<style lang="scss" scoped>
  @import './data-set-form.scss';
</style>
