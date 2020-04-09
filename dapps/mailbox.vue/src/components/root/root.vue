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
  <div class="evan theme-evan evan-mailbox">
    <evan-dapp-wrapper
      @loggedin="initialize()"
    >
      <template v-slot:content>
        <div>
          <evan-loading v-if="!initialized" />
          <template v-else>
            <evan-dapp-wrapper-level-2>
              <div>
                <evan-nav-list
                  :entries="navEntries"
                  header-icon="bell-outline"
                  header-text="_mailbox.mailbox"
                />
              </div>
            </evan-dapp-wrapper-level-2>

            <div v-if="$route.name === 'mail-category'">
              <evan-loading v-if="loading" />

              <div
                v-if="!loading"
                class="container-wide"
              >
                <div class="white-box">
                  <div class="table-scroll-container">
                    <table class="evan-table no-wrap hover w-100">
                      <thead>
                        <tr>
                          <th />
                          <th />
                          <th />
                          <th />
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(mail, index) in mailCategories[activeCategory].mails"
                          :key="index"
                          class="clickable"
                          @click="openMailDetail(mail)"
                        >
                          <td
                            v-if="activeCategory === 'sent'"
                            class="text-primary"
                            style="min-width: 200px"
                          >
                            <span class="font-weight-bold text-truncate">
                              {{ addressBook[mail.to] ? addressBook[mail.to].alias : '---' }}
                            </span>
                            <span
                              v-if="addressBook[mail.to]"
                              class="d-block text-truncate"
                            >
                              {{ mail.to }}
                            </span>
                          </td>
                          <td
                            v-else
                            class="text-primary text-truncate"
                            style="min-width: 200px"
                          >
                            <span class="font-weight-bold">
                              {{ addressBook[mail.from] ? addressBook[mail.from].alias : mail.from }}
                            </span>
                            <span
                              v-if="addressBook[mail.from]"
                              class="d-block text-truncate"
                            >
                              {{ mail.from }}
                            </span>
                          </td>
                          <td
                            class="mail-body"
                            style="min-width: 200px"
                          >
                            <span class="font-weight-bold">{{ mail.title }}</span>
                            <span
                              class="force-oneline"
                              style="max-width: 500px"
                              v-html="mail.body"
                            />
                          </td>
                          <td style="min-width: 200px">
                            {{ mail.sent | moment('from') }}
                          </td>
                          <td>
                            <i
                              v-if="readMails.indexOf(mail.address) === -1"
                              class="mdi mdi-email text-secondary"
                            />
                          </td>
                          <td style="min-width: 200px">
                            <i
                              v-if="mail.attachments"
                              class="mdi mdi-attachment"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div
                v-if="!loading && mailCategories[activeCategory].offset <= mailCategories[activeCategory].totalResultCount"
                class="text-center mt-3 mb-3 p-3 w-100"
              >
                <button
                  class="btn  btn-primary"
                  :disabled="mailCategories[activeCategory].loading"
                  @click="loadMails()"
                >
                  <div
                    v-if="mailCategories[activeCategory].loading"
                    class="spinner-border spinner-border-sm text-light mr-3"
                  />
                  {{ `_mailbox.load-more` | translate }}
                </button>
              </div>
            </div>
            <transition
              v-else
              name="fade"
              mode="out-in"
            >
              <router-view />
            </transition>
          </template>
        </div>
      </template>
    </evan-dapp-wrapper>
  </div>
</template>

<script lang="ts">
import addressbookRootComponent from './root.ts';

export default addressbookRootComponent;
</script>
