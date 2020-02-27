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
  <div class="d-flex">
    <div class="content">
      <div class="mb-3">
        <div class="mb-1 d-flex flex-row justify-content-between">
          <div>
            <h1>{{ '_profile.did.did-title' | translate }} (DID)</h1>
            <p>TODO created at 04-21-2020 updated at 04-29-2020</p>
          </div>
          <evan-button>
            {{ '_profile.did.export-document' | translate }}
          </evan-button>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Rerum fuga officia dolorum maiores minima nisi soluta?
          Rem hic deserunt dolore debitis, rerum praesentium quos necessitatibus non eum eos ad tempora.
        </p>
      </div>

      <div class="content-card mb-3">
        <h2 class="card-heading">
          {{ '_profile.did.did-title' | translate }}
        </h2>
      </div>

      <service-endpoints
        class="mb-3"
      />

      <delegates />
    </div>
  </div>
</template>

<script lang="ts">
import Component from './DID';

export default Component;
</script>

<style lang="scss" scoped>
.content {
  margin-left: auto;
  margin-right: auto;
  padding-top: 56px;
  padding-bottom: 56px;
  width: 560px;
}
.content-card {
  background: white;
  border-radius: 4px;
  width: 560px;
  padding: 24px 24px;

  .card-heading {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
