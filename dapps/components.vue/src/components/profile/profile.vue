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
    <div class="white-box border">
      <h3 class="header">Profile pictures</h3>
      <div class="content">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <span>Picture Size</span>
              <select class="form-control custom-select"
                ref="type"
                v-model="size">
                <option value="default">default</option>
                <option value="lg">large (lg)</option>
                <option value="sm">small (sm)</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>
                isVerified ({{verified}})
                <input class="form-control" type="checkbox" v-model="verified">
              </label>
            </div>
          </div>


        </div>
        <div class="row">
          <div class="col-lg-3 col-md-6 col-xs-12">
            <h2>Device</h2>
            <evan-profile-picture src="https://placehold.it/150" type="device" :size="size" :isVerified="verified" />
          </div>
          <div class="col-lg-3 col-md-6 col-xs-12">
            <h2>User</h2>
            <evan-profile-picture src="https://placehold.it/150" type="user" :size="size" :isVerified="verified" />
          </div>
          <div class="col-lg-3 col-md-6 col-xs-12">
            <h2>Company</h2>
            <evan-profile-picture src="https://placehold.it/150" type="company" :size="size" :isVerified="verified" />
          </div>
           <div class="col-lg-3 col-md-6 col-xs-12">
            <h2>Unknown</h2>
            <evan-profile-picture src="https://placehold.it/150" type="unknown" :size="size" :isVerified="verified" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import Component from './profile';
  export default Component;
</script>
