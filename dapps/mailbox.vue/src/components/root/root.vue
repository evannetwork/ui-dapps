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
  <div class="evan theme-evan evan-mailbox">
    <evan-dapp-wrapper
      :routes="[ ]"
      v-on:loggedin="loadMails()">
      <template v-slot:content>
        <evan-nav-tabs class="flex-shrink-0"
          :tabs="tabs"
          ref="navTabs">
        </evan-nav-tabs>

        <div v-if="$route.name === 'mail-category'">
          <evan-loading v-if="loading"></evan-loading>

          <div class="container-wide" v-if="!loading">
            <div class="white-box border-smooth rounded">
              <div class="table-scroll-container">
                <table class="evan-table no-wrap hover w-100">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="clickable"
                      v-for="(mail, index) in mailCategories[activeCategory].mails"
                      @click="openMailDetail(mail)">
                      <td class="text-primary" style="min-width: 200px"
                        v-if="activeCategory === 'sent'">
                        <span class="font-weight-bold text-truncate">
                          {{ addressBook[mail.to] ? addressBook[mail.to].alias : '---' }}
                        </span>
                        <span class="d-block text-truncate" v-if="addressBook[mail.to]">
                          {{ mail.to }}
                        </span>
                      </td>
                      <td class="text-primary text-truncate" style="min-width: 200px" v-else>
                        <span class="font-weight-bold">
                          {{ addressBook[mail.from] ? addressBook[mail.from].alias : mail.from }}
                        </span>
                        <span class="d-block text-truncate" v-if="addressBook[mail.from]">
                          {{ mail.from }}
                        </span>
                      </td>
                      <td class="mail-body" style="min-width: 200px">
                        <span class="font-weight-bold">{{ mail.title }}</span>
                        <span class="force-oneline"
                          style="max-width: 500px"
                          v-html="mail.body">
                        </span>
                      </td>
                      <td style="min-width: 200px">
                        {{ mail.sent | moment('from') }}
                      </td>
                      <td>
                        <i class="mdi mdi-email text-secondary" 
                          v-if="readMails.indexOf(mail.address) === -1">
                        </i>
                      </td>
                      <td style="min-width: 200px">
                        <i class="mdi mdi-attachment" 
                          v-if="mail.attachments">
                        </i>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="text-center mt-3 mb-3 p-3 w-100"
            v-if="!loading && mailCategories[activeCategory].offset <= mailCategories[activeCategory].totalResultCount">
            <button class="btn  btn-primary"
              :disabled="mailCategories[activeCategory].loading"
              @click="loadMails()">
              <div class="spinner-border spinner-border-sm text-light mr-3"
                v-if="mailCategories[activeCategory].loading">
              </div>
              {{ `_mailbox.load-more` | translate }}
            </button>
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


