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

import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { utils } from '@evan.network/digitaltwin.lib';

import * as dcUtils from '../../utils';
import UiContainer from '../../UiContainer';

@Component({ })
export default class DataContainerTreeComponent extends mixins(EvanComponent) {
  /**
   * Container address / plugin name
   */
  @Prop() containerAddress;

  /**
   * optional digital twin address
   */
  @Prop() digitalTwinAddress;

  /**
   * provide description for fast initial displaying
   */
  @Prop() description;

  /**
   * Full Url to the currently selected twin
   */
  @Prop() dcUrl;

  /**
   * Hide the container name and show only the corresponding data sets
   */
  @Prop() onlySets;

  /**
   * show loading symbol
   */
  @Prop() loading;

  /**
   * disable open
   */
  @Prop() creating;

  /**
   * Show the entries
   */
  isOpen = false;

  /**
   * base window url for checking for active urls
   */
  windowLocation = window.location.origin + window.location.pathname;

  /**
   * Currents container / plugin exported plugin definition
   */
  plugin: any = null;

  /**
   * Status information
   */
  initializing = true;
  error = false;

  /**
   * Map decode uri component to scope, so it can be used in template
   */
  decodeURIComponent = (<any>window).decodeURIComponent;

  /**
   * ref handlers
   */
  reactiveRefs: any = {
    setActions: [ ]
  };

  async created() {
    const runtime = utils.getRuntime(this);

    try {
      await UiContainer.watch(this, async (uiContainer: UiContainer, dispatcherData: any) => {
        this.plugin = uiContainer.plugin;
        this.error = uiContainer.error;

        if (!this.initializing) {
          this.initializing = true;
          this.$nextTick(() => this.initializing = false);
        }
      });
    } catch (ex) {
      this.error = ex;

      if (ex.message.indexOf('No container address applied!') === -1) {
        runtime.logger.log(ex.message, 'error');
      }
    }

    this.initializing = false;
  }

  /**
   * Sends the hide sidebar event.
   */
  hideSidebar2() {
    window.dispatchEvent(new CustomEvent('dapp-wrapper-sidebar-close'));
  }
}
