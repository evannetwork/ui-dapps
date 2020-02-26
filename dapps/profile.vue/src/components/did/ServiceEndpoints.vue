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
    <div class="card-heading mb-3 d-flex flex-row justify-content-between align-items-center">
      <h2>
        {{ '_profile.did.service-endpoint-title' | translate }}
      </h2>
      <evan-button>TODO Edit</evan-button>
    </div>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem nemo possimus corrupti voluptates. Doloribus ab harum exercitationem a! Fuga ipsum molestias nisi ad unde exercitationem velit quia porro eius ullam!</p>

    <evan-table
      class="simple"
      :items="endpoints"
    />
  </div>
</template>

<script lang="ts">
import Component from './ServiceEndpoints';

export default Component;
</script>

<style lang="scss" scoped>
.content-card {
  background: white;
  border-radius: 4px;
  width: 560px;
  padding: 24px 24px;

  .card-heading h2 {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
