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
    <evan-dapp-wrapper>
      <template v-slot:content>
        <evan-dapp-wrapper-level-2>
          <template v-slot:content>
            <div class="w300">
              <div class="d-flex pl-2 pr-4 pt-3 pb-3 align-items-center justify-content-between border-bottom">
                <h5 class="font-weight-bolder text-nowrap ml-3">
                  {{ '_addressbook.addressbook' | translate }}
                </h5>
              </div>

              <evan-loading v-if="loading"></evan-loading>

              <ul class="nav font-medium in w-100 mb-3 mt-auto"
                v-if="!loading">
                <li class="w-100 p-4 clickable d-flex"
                  v-for="(category, key) in contacts"
                  :class="{ 'active': key === activeCategory }"
                  @click="activeCategory = key">
                  <span v-if="key !== 'all'">{{ key }}</span>
                  <span v-if="key === 'all'">{{ '_addressbook.all' | translate }}</span>
                  <span class="mx-auto"></span>
                  <i class="fas fa-chevron-right"></i>
                </li>
              </ul>
            </div>
          </template>
        </evan-dapp-wrapper-level-2>

        <evan-loading v-if="loading"></evan-loading>

        <div v-if="!loading">
          <evan-breadcrumbs
            :i18nScope="'_addressbook'"
            :enableReload="true"
            @reload="loadContacts(true)">
            <template v-slot:content>
              <button type="button" class="btn btn-primary btn-circle"
                @click="evanNavigate('overview/add')">
                <i class="fas fa-plus"></i>
              </button>
            </template>
          </evan-breadcrumbs>

          <div class="p-3">
            <div class="bg-level-1 border">
              <div class="d-flex p-2 pt-3 pb-3 border-bottom">
                <h4 class="m-0 ml-3">
                  {{ '_addressbook.category' | translate }}: 

                  <b v-if="activeCategory !== 'all'">{{ activeCategory }}</b>
                  <b v-if="activeCategory === 'all'">{{ '_addressbook.all' | translate }}</b>
                </h4>
              </div>

              <div class="pl-3 pr-3">
                <table class="table table-borderless table-hover mt-3">
                  <thead>
                    <tr>
                      <th>{{ '_addressbook.alias' | translate }}</th>
                      <th>{{ '_addressbook.identifier' | translate }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="clickable"
                      v-for="(contact, index) in contacts[activeCategory]"
                      @click="evanNavigate(`detail/${ vehicle.address }`)">
                      <td class="text-primary">{{ contact.alias }}</td>
                      <td>{{ contact.address || contact.email }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
  import Component from './overview.ts';
  export default Component;
</script>

