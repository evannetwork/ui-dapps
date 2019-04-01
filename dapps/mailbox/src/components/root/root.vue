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
      v-on:loggedin="loadMails()">
      <template v-slot:content>
        <evan-dapp-wrapper-level-2>
          <template v-slot:content>
            <div class="w300">
              <div class="d-flex pl-2 pr-4 pt-3 pb-3 align-items-center justify-content-between border-bottom">
                <h5 class="font-weight-bolder text-nowrap ml-3">
                  {{ '_mailbox.mailbox' | translate }}
                </h5>
              </div>

              <ul class="nav font-medium in w-100 mb-3 mt-auto">
                <li class="w-100 p-4 clickable d-flex"
                  v-for="(category, key) in mailCategories"
                  :class="{ 'active': key === activeCategory }"
                  @click="evanNavigate(activeCategory); activateCategory(key)">
                  <i :class="category.icon"></i>
                  <h4 class="mb-0">{{ `_mailbox.${  key }` | translate }}</h4>
                  <span class="mx-auto"></span>
                  <i class="fas fa-chevron-right"></i>
                </li>
              </ul>
            </div>
          </template>
        </evan-dapp-wrapper-level-2>

        <evan-breadcrumbs
          :i18nScope="'_mailbox'"
          :enableReload="true"
          @reload="loadMails(true)">
          <template v-slot:content>
            <button type="button" class="btn btn-primary btn-circle"
              @click="evanNavigate('add');">
              <i class="fas fa-plus"></i>
            </button>
          </template>
        </evan-breadcrumbs>

        <div v-if="$route.name === 'mail-category'">
          <evan-loading v-if="loading"></evan-loading>

          <div class="p-3" v-if="!loading">
            <div class="bg-level-1 border pt-3 pb-3">
              <div class="evan-table table-responsive-md bg-level-2">
                <table>
                  <tbody>
                    <template v-for="(mail, index) in mailCategories[activeCategory].mails">
                      <tr v-if="index !== 0"><td></td></tr>
                      <tr class="clickable"
                        @click="openMailDetail(mail)">
                        <td class="text-primary"
                          v-if="activeCategory === 'sent'">
                          <span class="d-block font-weight-bold">
                            {{ addressBook[mail.to] ? addressBook[mail.to].alias : mail.to }}
                          </span>
                          <span class="text-truncate" v-if="addressBook[mail.to]">
                            {{ mail.to }}
                          </span>
                        </td>
                        <td class="text-primary" v-else>
                          <span class="d-block font-weight-bold">
                            {{ addressBook[mail.from] ? addressBook[mail.from].alias : mail.from }}
                          </span>
                          <span class="text-truncate" v-if="addressBook[mail.from]">
                            {{ mail.from }}
                          </span>
                        </td>
                        <td class="mail-body">
                          <span class="d-block font-weight-bold">{{ mail.title }}</span>
                          <span class="force-oneline"
                            style="max-width: 300px"
                            v-html="mail.body">
                          </span>
                        </td>
                        <td 
                          style="width: 30px; height: 70px">
                          <i class="fas fa-envelope text-secondary" 
                            v-if="readMails.indexOf(mail.address) === -1">
                          </i>
                        </td>
                        <td>
                          {{ mail.sent | moment('from') }}
                        </td>
                        <td
                          class="pt-4"
                          style="width: 30px; height: 70px">
                          <i class="fas fa-paperclip" 
                            v-if="mail.attachments">
                          </i>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="text-center mt-3 mb-3 p-3 w-100"
            v-if="!loading && mailCategories[activeCategory].offset <= mailCategories[activeCategory].totalResultCount">
            <button class="btn btn-rounded btn-primary"
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


