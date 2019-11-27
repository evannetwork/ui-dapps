/* Copyright (C) 2018-present evan GmbH. This program is free software: you can
redistribute it and/or modify it under the terms of the GNU Affero General
Public License, version 3, as published by the Free Software Foundation. This
program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along
with this program. If not, see http://www.gnu.org/licenses/ or write to the Free
Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA,
02110-1301 USA, or download the license from the following URL:
https://evan.network/license/ */

<template>
  <div>
    <h2>{{ '_profile.wallet.send-eve.title' | translate }}</h2>

    <evan-loading v-if="loading" />
    <template v-else>
      <evan-form
        :disabled="sending"
        :form="form"
        :i18nScope="'_profile.wallet.send-eve.form'"
        :onlyForm="true"
        :stacked="true">
      </evan-form>

      <evan-modal
        ref="acceptModal"
        :maxWidth="'600px'">
        <template v-slot:header>
          <h5 class="modal-title">
            {{ `_profile.wallet.send-eve.accept.title` | translate }}
          </h5>
        </template>
        <template v-slot:body>
          <span v-html="
            $t(`_profile.wallet.send-eve.accept.description`, {
              amount: getReadableBalance(form.amount.value),
              name: getUserNameWithAddress(form.accountId.value)
            })
          " />
        </template>
        <template v-slot:footer>
          <evan-button
            @click="sendEve(); $refs.acceptModal.hide()"
            type="primary">
             {{ '_profile.wallet.send-eve.accept.send' | translate }}
          </evan-button>
        </template>
      </evan-modal>

      <evan-button
        :disabled="!form.isValid || sending"
        :isLoading="sending"
        :label="'_profile.wallet.send-eve.send' | translate"
        @click="$refs.acceptModal.show()"
        class="btn-block mt-t"
        type="primary">
      </evan-button>
    </template>
  </div>
</template>

<script lang="ts">
import Component from './SendEve';
export default Component;
</script>

<style lang="scss">
</style>
