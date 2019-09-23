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
    <!-- settings section -->
    <div class="white-box border">
      <h2 class="header">Profile Component Settings</h2>
      <div class="content">
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
              <label class="d-block">
                Image source (src)
                <input
                  class="form-control"
                  type="url"
                  v-model="imgSrc"
                  placeholder="https://placehold.it/150"
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
              <label class="d-block">
                Name (name)
                <input
                  class="form-control"
                  type="text"
                  v-model="accountName"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- profile pictures -->
    <div class="white-box border mt-6">
      <h3 class="header">Profile pictures</h3>
      <div class="content">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-xs-12">
            <h4>Device</h4>
            <evan-profile-picture
              :src="sampleForm.files.value[0] || imgSrc"
              :fileForm="sampleForm.files"
              type="device"
              :size="size"
              :accountName="accountName"
              :isVerified="verified"
              :isEditable="editable"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-xs-12">
            <h4>User</h4>
            <evan-profile-picture
              :src="sampleForm.files.value[0] || imgSrc"
              type="user"
              :size="size"
              :accountName="accountName"
              :isVerified="verified"
              :isEditable="editable"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-xs-12">
            <h4>Company</h4>
            <evan-profile-picture
              :src="sampleForm.files.value[0] || imgSrc"
              type="company"
              :size="size"
              :accountName="accountName"
              :isVerified="verified"
              :isEditable="editable"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-xs-12">
            <h4>Unspecified</h4>
            <evan-profile-picture
              type="unspecified"
              :size="size"
              :isVerified="false"
              :isEditable="false"
            />
            <p class="text-muted">Has usually no avatar, no name and verification.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile preview -->
    <div class="white-box border mt-6">
      <h3 class="header">Profile Preview</h3>
      <div class="content">
        <div class="row" style>
          <div class="col-lg-6 col-md-12">
            <h4>Device</h4>
            <evan-profile-preview
              :src="sampleForm.files.value[0] || imgSrc"
              type="device"
              :size="size"
              :accountName="accountName"
              :isVerified="verified"
              :isEditable="editable"
            />
          </div>
          <div class="col-lg-6 col-md-12">
            <h4>User</h4>
            <evan-profile-preview
              :src="sampleForm.files.value[0] || imgSrc"
              type="user"
              :size="size"
              :accountName="accountName"
              :isVerified="verified"
              :isEditable="editable"
            />
          </div>
          <div class="col-lg-6 col-md-12">
            <h4>Company</h4>
            <evan-profile-preview
              :src="sampleForm.files.value[0] || imgSrc"
              type="company"
              :size="size"
              :accountName="accountName"
              :isVerified="verified"
              :isEditable="editable"
            />
          </div>
          <div class="col-lg-6 col-md-12">
            <h4>Unspecified</h4>
            <evan-profile-preview
              type="unspecified"
              :size="size"
              :accountName="accountName"
              :isVerified="false"
              :isEditable="false"
            />
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
