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
  <div class="profile-sharings container-wide">
      <evan-loading v-if="loading" />
      <template v-else>
          
        <h3 class="font-weight-bold">{{ '_profile.sharings.title' | translate }}</h3>
        <p>{{ '_profile.sharings.desc' | translate }}</p>

        <template v-if="sharedContacts && sharedContacts.length > 0">
            
            <evan-base-list v-bind:data="sharedContacts" class="mt-5">
                <template v-slot:item="{item}">
                    <evan-shared-contact :item="item"/>
                </template>
            </evan-base-list>

        </template>
        <template v-else>
            
            <div class="hint-no-sharings text-muted text-center">{{ '_profile.sharings.no-data' | translate }}</div>

        </template>
      </template>
  </div>
</template>

<style lang="scss" scoped>
    @import "./sharings.scss";
</style>

<script lang="ts">
    import Component from "./sharings";
    export default Component;
</script>
