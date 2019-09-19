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
        <!-- settings section -->
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <span>Picture Size (size)</span>
              <select class="form-control custom-select" ref="type" v-model="size">
                <option value="default">default</option>
                <option value="lg">large (lg)</option>
                <option value="sm">small (sm)</option>
              </select>
            </div>
             <div class="form-group">
              <label>
                Image source (src)
                <input
                  class="form-control"
                  type="text"
                  v-model="imgSrc"
                />
              </label>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label>
                isVerified ({{verified}})
                <input
                  class="form-control"
                  type="checkbox"
                  v-model="verified"
                />
              </label>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label>
                isEditable ({{editable}})
                <input
                  class="form-control"
                  type="checkbox"
                  v-model="editable"
                />
              </label>
            </div>
             <div class="form-group">
              <label>
                Name (name)
                <input
                  class="form-control"
                  type="text"
                  v-model="name"
                />
              </label>
            </div>
          </div>
        </div>
        <!-- profile pictures -->
        <div class="row" style>
          <div class="col-lg-3 col-md-6 col-xs-12">
            <h2>Device</h2>
            <evan-profile-picture
              :src="sampleForm.files.value[0] || imgSrc"
              :fileForm="sampleForm.files"
              type="device"
              :size="size"
              :name="name"
              :isVerified="verified"
              :isEditable="editable"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-xs-12">
            <h2>User</h2>
            <evan-profile-picture
             :src="sampleForm.files.value[0] || imgSrc"
              type="user"
              :size="size"
              :name="name"
              :isVerified="verified"
              :isEditable="editable"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-xs-12">
            <h2>Company</h2>
            <evan-profile-picture
             :src="sampleForm.files.value[0] || imgSrc"
              type="company"
              :size="size"
              :name="name"
              :isVerified="verified"
              :isEditable="editable"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-xs-12">
            <h2>Unknown</h2>
            <evan-profile-picture
              type="unknown"
              :size="size"
              :isVerified="false"
              :isEditable="false"
            />
            <p class="text-muted">Has usually no avatar, no name and verification.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from "./profile";
  export default Component;
</script>
