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
  <div class="evan theme-evan">
    <evan-dapp-wrapper
      v-on:loggedin="loadContacts()">
      <template v-slot:content>
        <evan-dapp-wrapper-level-2>
          <template v-slot:content>
            <div class="w300">
              <div class="d-flex flex-wrap pl-4 pr-4 pt-4 pb-3 align-items-center ">
                <a :href="`${ dapp.fullUrl }`">
                  <h5 class="font-weight-semibold text-uppercase text-nowrap">
                    {{ '_addressbook.addressbook' | translate }}
                  </h5>
                </a>
              </div>

              <evan-loading v-if="loading"></evan-loading>

              <ul class="nav font-medium in w-100 mb-3 mt-auto"
                v-if="!loading">
                <li class="w-100 p-3 clickable d-flex align-items-center"
                  v-for="(category, key) in contacts"
                  :class="{ 'active': key === activeCategory }"
                  @click="evanNavigate(''); activeCategory = key">
                  <h6 class="mb-0" v-if="key !== 'all'">{{ key }}</h6>
                  <h6 class="mb-0" v-if="key === 'all'">{{ '_addressbook.all' | translate }}</h6>
                  <span class="mx-auto"></span>
                  <i class="mdi mdi-chevron-right"></i>
                </li>
              </ul>
            </div>
          </template>
        </evan-dapp-wrapper-level-2>

        <evan-breadcrumbs
          :i18nScope="'_addressbook'"
          :enableReload="true"
          @reload="loadContacts(true)">
          <template v-slot:content>
            <button type="button" class="btn btn-primary btn-circle"
              @click="evanNavigate('add');">
              <i class="mdi mdi-plus"></i>
            </button>
          </template>
        </evan-breadcrumbs>

        <div v-if="$route.name !== 'add' && $route.name !== 'detail'">
          <evan-loading v-if="loading"></evan-loading>

          <div class="p-3" v-if="!loading">
            <div class="bg-level-1 border">
              <div class="d-flex p-5 border-bottom border-sm align-items-center">
                <h3 class="m-0 font-weight-semibold">
                  {{ '_addressbook.category' | translate }}: 

                  <template v-if="activeCategory !== 'all'">{{ activeCategory }}</template>
                  <template v-if="activeCategory === 'all'">{{ '_addressbook.all' | translate }}</template>
                </h3>
              </div>


              <table class="evan-flex-table">
                <thead>
                  <tr>
                    <th>{{ '_addressbook.alias' | translate }}</th>
                    <th>{{ '_addressbook.identifier' | translate }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="clickable"
                    v-for="(contact, index) in contacts[activeCategory]"
                    @click="evanNavigate(`detail/${ contact.address }`);">
                    <td class="text-primary">{{ contact.alias }}</td>
                    <td>{{ contact.address || contact.email }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <transition name="fade" mode="out-in"
          v-else>
          <router-view></router-view>
        </transition>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
  import addressbookRootComponent from './root.ts';
  export default addressbookRootComponent;
</script>

