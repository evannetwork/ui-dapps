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
  <div>
    <evan-breadcrumbs :i18nScope="'_favorites'">
      <template v-slot:content>
        <button type="button" class="btn btn-primary btn-circle"
          @click="evanNavigate('overview/add')">
          <i class="fas fa-plus"></i>
        </button>
      </template>
    </evan-breadcrumbs>
    <evan-loading v-if="loading"></evan-loading>
    <div class="p-3 d-md-flex flex-wrap justify-content-center"
      v-if="!loading">
      <div class="favorite
          col-md-4 col-lg-3 col-xl-2
          p-0 m-md-3 mb-3 
          text-center
          bg-level-1 border evan-highlight"
        style="min-width: 250px"
        v-for="(favorite, index) in favorites"
        @click="openFavorite(favorite)">
        <img class="img-fluid p-3"
          style="max-width: 200px; min-height: 200px;"
          :src="favorite.imgSquare">

        <div class="text-left p-3 border-top">
          <h5 class="font-weight-bold">{{ favorite.name }}</h5>
          <span>{{ favorite.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './overview.ts';
  export default Component;
</script>

