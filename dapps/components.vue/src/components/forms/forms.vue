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
    <h1>{{ '_comp.forms' | translate }}</h1>
    <h2>{{ wurstAmount1 }} - {{ wurstAmount2 }} - {{ wurstAmount3 }}- {{ wurstAmount4 }}</h2>
    <label>Public ? <input type="checkbox" v-model="isPublic" /></label>
    <div class="row">
      <div class="col-md-8">
        <evan-form-data-wrapper
          v-slot="content"
          :handleSave="handleSubmit"
          :isPublic="isPublic"
          title="Wurstbasar"
        >
          <form>
            <evan-form-data-input
              id="evan-form-test-1"
              label="Wurst description"
              type="text"
              placeholder="Yet another Wurst"
              v-model="wurstAmount1"
            />

            <evan-form-data-input
              id="evan-form-test-2"
              label="Wurst extras"
              type="email"
              v-model="wurstAmount2"
            />

            <evan-form-data-input
              id="evan-form-test-3"
              label="Wurst amount"
              type="number"
              placeholder="The amount of Wurst"
              v-model="wurstAmount3"
            />

            <evan-form-data-select
              id="evan-form-test-4"
              label="Which Wurst?"
              type="number"
              placeholder="The amount of Wurst"
              v-model="wurstAmount4"
              :options="options"
            />

            <div class="form-group row">
              <label for="custom-input" class="col-md-3 col-form-label">
                <i class="mdi mdi-food-off" />
                Custom Input
              </label>
              <div class="col-md-9">
                <input type="checkbox"
                  id="custom-input"
                  class="form-control"
                  @focus="content.setEditMode(true)"
                  v-model="isPublic"
                />
              </div>
            </div>
          </form>
        </evan-form-data-wrapper>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Forms from './forms';
  export default Forms;
</script>

