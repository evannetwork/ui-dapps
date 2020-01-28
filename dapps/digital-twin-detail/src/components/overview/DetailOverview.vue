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
      <!-- TODO: Use proper DID -->
      <detail-overview-general
        class="mb-3"
        :did="`did:evan:${twin.description.identity}`"
        :owner-name="twin.ownerName"
        :owner-address="twin.ownerAddress"
        :created-at="twin.createdAt"
      />

      <detail-overview-transactions
        :transactions="transactions"
      />
    </div>
  </div>
</template>

<script lang="ts">
import DetailOverviewComponent from './DetailOverview';

export default DetailOverviewComponent;
</script>

<style lang="scss" scoped>
.content {
  margin-left: auto;
  margin-right: auto;
  padding-top: 56px;
}
</style>
