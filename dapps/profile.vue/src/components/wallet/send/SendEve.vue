/*
  Copyright (C) 2018-present evan GmbH. This program is free software: you can
  redistribute it and/or modify it under the terms of the GNU Affero General
  Public License, version 3, as published by the Free Software Foundation. This
  program is distributed in the hope that it will be useful, but WITHOUT ANY
  WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
  PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
  You should have received a copy of the GNU Affero General Public License along
  with this program. If not, see http://www.gnu.org/licenses/ or write to the Free
  Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA,
  02110-1301 USA, or download the license from the following URL:
  https://evan.network/license/
*/

<template>
  <div>
    <evan-swipe-panel
      :hideCloseButton="windowWidth >= 1200"
      :isOpen="true"
      :mountId="windowWidth < 1200 ? null : 'dapp-wrapper-sidebar-right'"
      :showBackdrop="windowWidth < 1200"
      :title="'_profile.wallet.send-eve.title' | translate"
      @hide="$store.state.uiState.swipePanel = ''"
      alignment="right"
      class="light"
    >
      <evan-loading v-if="loading" />
      <!-- start content -->
      <template v-else>
        <evan-form
          :disabled="sending"
          :form="form"
          :i18nScope="'_profile.wallet.send-eve.form'"
          :onlyForm="true"
          :stacked="true"
        >
        </evan-form>

        <evan-modal ref="acceptModal" :maxWidth="'600px'">
          <template v-slot:header>
            <h5 class="modal-title">
              {{ `_profile.wallet.send-eve.accept.title` | translate }}
            </h5>
          </template>
          <template v-slot:body>
            <span
              v-html="
                $t(`_profile.wallet.send-eve.accept.description`, {
                  amount: getReadableBalance(form.amount.value),
                  name: userNameWithAddress
                })
              "
            />
          </template>
          <template v-slot:footer>
            <evan-button
              @click="
                sendEve();
                $refs.acceptModal.hide();
              "
              id="evan-eve-send-submit"
              type="primary"
            >
              {{ '_profile.wallet.send-eve.accept.send' | translate }}
            </evan-button>
          </template>
        </evan-modal>
      </template>
      <!-- content -->

      <template slot="footer" v-if="!loading">
        <evan-button
          :disabled="!form.isValid || sending"
          :isLoading="sending"
          :label="'_profile.wallet.send-eve.send' | translate"
          @click="showModal"
          id="evan-eve-send"
          class="w-100"
          type="primary"
        >
        </evan-button>
      </template>
    </evan-swipe-panel>
  </div>
</template>

<script lang="ts">
import Component from './SendEve';
export default Component;
</script>

<style lang="scss"></style>
