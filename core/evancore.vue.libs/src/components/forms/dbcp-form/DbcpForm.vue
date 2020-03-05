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
      :form="dbcpForm"
      i18n-scope="_evan.dbcp-form"
      is-public
      v-bind="$props"
      @save="$emit('save')"
    >
      <evan-form-control
        :label="$t('_evan.dbcp-form.image.label')"
        :stacked="stacked"
        :required="false"
        class="twin-image"
      >
        <div class="d-flex justify-content-center">
          <evan-profile-picture
            size="lg"
            type="device"
            :account-name="name"
            :is-editable="editable"
            :src="image || description.imgSquare || null"
            @changed="image = $event; $refs.form.setEditMode(true)"
          />
        </div>
      </evan-form-control>

      <template v-slot:after>
        <slot />
      </template>
    </evan-form>
  </div>
</template>

<script lang="ts">
import DbcpFormComponent from './DbcpForm';

export default DbcpFormComponent;
</script>

<style lang="scss" scoped>
@import '~@evan.network/ui/src/style/utils';

/deep/ .twin-image label {
  align-items: center;
  display: flex;
}
</style>
