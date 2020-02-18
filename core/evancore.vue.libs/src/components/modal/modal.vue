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
    <template v-if="isRendered">
      <div
        class="modal fade"
        tabindex="-1"
        :class="{ 'show': isShown }"
        @click="!disableBackdrop && (closeAction ? closeAction() : hide())"
      >
        <div
          class="modal-dialog"
          :class="{'full-page' : fullPage}"
          role="document"
          :style="{ 'max-width': maxWidth && !fullPage ? maxWidth : null }"
          @mousedown="preventHide=true;"
          @mouseup="preventHide=false;"
        >
          <div
            class="modal-content"
            @click.stop
          >
            <template v-if="!customModal">
              <div :class="{ 'modal-header d-flex align-items-center': modalClasses.indexOf('modal-header') !== -1 }">
                <slot name="header" />
                <evan-button
                  v-if="!hideCloseButton"
                  type="icon"
                  @click="closeAction ? closeAction() : hide()"
                >
                  <i class="mdi mdi-close" />
                </evan-button>
              </div>
              <div :class="{ 'modal-body': modalClasses.indexOf('modal-body') !== -1 }">
                <slot name="body" />
              </div>
              <div :class="{ 'modal-footer': modalClasses.indexOf('modal-footer') !== -1 }">
                <evan-button
                  v-if="!hideFooterButton"
                  id="modal-cancel"
                  type="secondary"
                  @click="closeAction ? closeAction() : hide()"
                >
                  {{ '_evan.cancel' | translate }}
                </evan-button>
                <slot name="footer" />
              </div>
            </template>
            <slot
              v-if="customModal"
              name="content"
            />
          </div>
        </div>
      </div>
      <div
        class="modal-backdrop fade"
        :class="{ 'show': isShown }"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Component from './modal';

export default Component;
</script>

<style lang="scss" scoped>
  @import './modal.scss';
</style>
