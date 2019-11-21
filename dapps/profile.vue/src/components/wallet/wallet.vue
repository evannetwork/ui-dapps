/* Copyright (C) 2018-present evan GmbH. This program is free software: you can
redistribute it and/or modify it under the terms of the GNU Affero General
Public License, version 3, as published by the Free Software Foundation. This
program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along
with this program. If not, see http://www.gnu.org/licenses/ or write to the Free
Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA,
02110-1301 USA, or download the license from the following URL:
https://evan.network/license/ */

<template>
  <div class="row">
    <div class="p-xxl-11 p-xl-6 p-3 col-12">
      <div class="row">
        <div class="col-xl-6">
          <evan-wallet-card :address="$route.params.address" />
        </div>
        <div class="col-xl-4 d-flex">
          <evan-button>Buy</evan-button>
          <evan-button>Send</evan-button>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-xl-12">
          <h1>Last Transactions</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo, dolore
            distinctio porro eveniet facere eum saepe consequuntur aliquam
            error, ea, consequatur commodi pariatur. Dolore architecto, quos
            ipsum quidem id corrupti.
          </p>
        </div>
      </div>
    </div>
    <evan-swipe-panel
      class="light"
      alignment="right"
      ref="wallet-sidebar"
      :showBackdrop="windowWidth < 1200"
      :hideCloseButton="windowWidth >= 1200"
      :mountId="windowWidth < 1200 ? null : 'dapp-wrapper-sidebar-right'"
    >
      <buy-eve></buy-eve>
    </evan-swipe-panel>
  </div>
</template>

<script lang="ts">
import Component from './wallet';
export default Component;
</script>

<style lang="scss">
@import './wallet.scss';
</style>
