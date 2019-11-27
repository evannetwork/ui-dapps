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

import Component, { mixins } from 'vue-class-component';
import { EvanComponent } from '@evan.network/ui-vue-core';

import { sendEveDispatcher } from '../../dispatchers/registry';

@Component({})
export default class WalletComponent extends mixins(EvanComponent) {
  /**
   * Current display mode in side panel.
   */
  activeMode = 0;

  /**
   * current window width
   */
  windowWidth = 0;

  /**
   * Show loading symbol
   */
  loading = false;

  /**
   * Watch for dispatcher updates
   */
  listeners: Array<any> = [];

  /**
   * is needed for the side panel footer interaction
   */
  buyEveComponent = null;

  /**
   * is needed for the side panel footer interaction
   */
  sendEveComponent = null;

  /**
   * Unbind window resize watcher
   */
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
    this.listeners.forEach(listener => listener());
  }

  /**
   * Bin window resize watcher to handle side panel state and handle send eve events.
   */
  created() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();

    // setup dispatcher watchers
    this.listeners.push(sendEveDispatcher.watch(async ($event: any) => {
      // if dispatcher was finished, reload data and reset formular
      if ($event.detail.status === 'finished' || $event.detail.status === 'deleted') {
        // force ui rerendering
        this.loading = true;
        this.$nextTick(() => this.loading = false);
      }
    }));
  }

  /**
   * Handle side panel opened state on wide screens
   */
  handleWindowResize() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth >= 1200) {
      (<any>this).$store.state.uiState.swipePanel = 'sharing';
    }
  }

  getSwipePanelTitle() {
    if (this.activeMode === 0) {
      return (this as any).$t('_profile.wallet.buy-eve.title');
    }

    if (this.activeMode === 1) {
      return (this as any).$t('_profile.wallet.send-eve.title');
    }

    return null;
  }
}
