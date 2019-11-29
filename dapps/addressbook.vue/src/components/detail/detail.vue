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
  <div>
    <evan-modal
      id="contact-modal"
      ref="contactModal"
      :maxWidth="'1000px'">
      <template v-slot:header v-if="!loading && accountId">
        <div class="modal-title">
          <h5>
            {{ contact.alias | translate }}
            <i class="mdi mdi-delete text-danger clickable ml-3"
              id="contact-remove-start"
              @click="$refs.contactRemoveModal.show()"
              v-if="isMyAccount">
              <evan-tooltip :placement="'bottom'">
                {{ '_addressbook.remove-contact.remove' | translate }}
              </evan-tooltip>
            </i>
          </h5>
          <span class="text-muted">
            {{ accountId || email }}
          </span>
          <evan-modal
            id="contact-remove-modal"
            ref="contactRemoveModal">
            <template v-slot:header>
              <h5 class="modal-title">
                {{ '_addressbook.remove-contact.title' | translate }}
              </h5>
            </template>
            <template v-slot:body>
              {{
                $t('_addressbook.remove-contact.description', {
                  alias: contact.alias,
                  accountId,
                  email
                })
              }}
            </template>
            <template v-slot:footer>
              <button type="submit"
                id="contact-remove"
                class="btn  btn-primary"
                @click="removeContact()">
                {{ '_addressbook.remove-contact.remove' | translate }}
                <i class="mdi mdi-arrow-right label"></i>
              </button>
            </template>
          </evan-modal>
        </div>
      </template>
      <template v-slot:body>
        <evan-loading v-if="loading"></evan-loading>
        <template v-else-if="accountId">
          <contact-form
            :form="contactForm"
            :disableAccountId="true">
          </contact-form>
        </template>
      </template>
      <template v-slot:footer v-if="!loading && accountId">
        <button type="submit" class="btn btn-primary "
          :disabled="!contactForm.isValid"
          @click="saveContact()">
          {{ `${ formI18nScope }.save` | translate }}
          <i class="mdi mdi-arrow-right label ml-3"></i>
        </button>
      </template>
    </evan-modal>
  </div>
</template>

<script lang="ts">
  import Component from './detail.ts';
  export default Component;
</script>

