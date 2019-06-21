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
      :routes="[ ]"
      v-on:loggedin="loadContacts()">
      <template v-slot:content>
        <evan-loading v-if="loading"></evan-loading>
        <div class="container-wide overflow-y-auto flex-grow-1"
          v-else>
          <contact-add
            ref="contactAddModal">
          </contact-add>
          <div class="d-flex mb-5 align-items-center">
            <div style="width: 80%;">
              <h3 class="font-weight-bold mb-0 overflow-multiline line-1 bg-level-3">
                {{ '_addressbook.addressbook-desc' | translate }}
              </h3>
            </div>
            <span class="mx-auto"></span>
            <button type="button" class="btn btn-primary btn-circle"
              @click="$refs.contactAddModal.show();">
              <i class="mdi mdi-plus"></i>
              <evan-tooltip :placement="'bottom'">
                {{ '_addressbook.contact-form.submit' | translate }}
              </evan-tooltip>
            </button>
          </div>
          <div class="white-box border-smooth rounded"
            v-if="Object.keys(categories).length === 0">
            <div class="header">
              <h3 class="m-0 font-weight-semibold">
                {{ '_addressbook.no-contacts.title' | translate }}
              </h3>
            </div>
            <div class="content">
              <p v-html="$t('_addressbook.no-contacts.desc')"></p>

              <div class="text-center mt-3">
                <button type="button" class="btn btn-primary btn-rounded"
                  @click="$refs.contactAddModal.show();">
                  {{ '_addressbook.contact-form.submit' | translate }}
                  <i class="mdi mdi-arrow-right label ml-3"></i>
                </button>
              </div>
            </div>
          </div>
          <template v-else>
            <div class="white-box border-smooth rounded mt-3"
              v-for="(category, index) in Object.keys(categories).sort()">
              <div class="header">
                <h3 class="m-0 font-weight-semibold">
                 {{ category }}
                </h3>
              </div>
              <div class="table-scroll-container">
                <table class="evan-table w-100 no-wrap">
                  <thead>
                    <tr>
                      <th style="width: 300px">{{ '_addressbook.alias' | translate }}</th>
                      <th>{{ '_addressbook.identifier' | translate }}</th>
                      <th>{{ '_addressbook.tags' | translate }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="clickable"
                      v-for="(contact, index) in categories[category]"
                      @click="evanNavigate(`detail/${ contact.address }`);">
                      <td class="font-weight-semibold text-primary">{{ contact.alias }}</td>
                      <td class="small text-muted">{{ contact.address || contact.email }}</td>
                      <td class="small text-muted">{{ contact.tags.join(', ') }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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

