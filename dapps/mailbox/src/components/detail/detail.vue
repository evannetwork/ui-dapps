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
  <div class="p-3 text-left">
    <div class="bg-level-1 border">
      <evan-loading v-if="loading"></evan-loading>
      <template v-if="!loading">
        <div class="d-flex pl-3 pr-3 pt-4 pb-4 border-bottom align-items-center">
          <h4 class="m-0">
            {{ mail.title }}
          </h4>
        </div>

        <div class="pl-3 pr-3 pt-4 pb-4">
          <div class="d-flex align-items-top">
            <div>
              <h5>
                {{ addressBook[mail.from] ? addressBook[mail.from].alias : mail.from }}
                <small v-if="addressBook[mail.from]"> ({{ mail.from }})</small>
              </h5>
              <p>
                {{ '_mailbox.to' | translate }}
                {{ addressBook[mail.to] ? addressBook[mail.to].alias : mail.to }}
                <span v-if="addressBook[mail.to]"> ({{ mail.to }})</span>
              </p>
            </div>
            <span class="mx-auto"></span>
            <span>{{ mail.sent | moment('from') }}</span>
          </div>

          <div class="mt-4 mb-4 p-3 border bg-level-2"
            v-html="mail.body">
          </div>

          <div v-if="mail.attachments" class="pt-3 text-center">
            <template
              v-for="(attachment, index) in mail.attachments"
              v-if="!attachment.unkown">
              <evan-modal ref="attachmentModal">
                <template v-slot:header>
                  <h5 class="modal-title">
                    {{ `_mailbox.attachments.${ attachment.type }.new` | translate }}
                  </h5>
                </template>
                <template v-slot:body>
                  <p class="text-left">
                    {{ `_mailbox.attachments.${ attachment.type }.modal-body`  | translate }}
                  </p>
                </template>
                <template v-slot:footer>
                  <button type="button" class="btn btn-primary btn-rounded font-weight-normal"
                    @click="acceptAttachment(attachment, $refs.attachmentModal[index]);">
                    {{ `_mailbox.attachments.continue` | translate }}
                  </button>
                </template>
              </evan-modal>
              <button class="btn btn-rounded btn-primary"
                :disabled="acceptingAttachment || attachment.disabled"
                @click="openAttachment(attachment, $refs.attachmentModal[index])">
                <div class="spinner-border spinner-border-sm text-light mr-3"
                  v-if="acceptingAttachment">
                </div>
                {{ `_mailbox.attachments.${ attachment.type }.${ attachment.status }` | translate }}
              </button>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from './detail.ts';
  export default Component;
</script>

