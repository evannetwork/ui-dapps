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

import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { utils } from '@evan.network/digitaltwin.lib';

import * as dcUtils from '../../utils';

@Component({ })
export default class DataContainerTreeComponent extends mixins(EvanComponent) {
  /**
   * Container address / plugin name
   */
  @Prop() address;

  /**
   * optional digital twin address
   */
  @Prop() digitalTwinAddress;

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
   * Watch for container template updates
   */
  cacheWatcher: any;

  /**
   * base window url for checking for active urls
   */
  windowLocation = window.location.origin + window.location.pathname;

  /**
   * Currents container / plugin exported plugin definition
   */
  plugin: any = null;

  /**
   * Initially loading
   */
  initializing = true;

  async created() {
    const runtime = utils.getRuntime(this);

    //  watch for updates and load initial data
    this.cacheWatcher = dcUtils.watchForUpdates(runtime, this.address,
      async () => this.plugin = await dcUtils.getContainerOrPlugin(runtime, this.address, false)
    );

    // load the plugin
    this.plugin = await dcUtils.getContainerOrPlugin(runtime, this.address, false);

    this.initializing = false;
  }

  /**
   * Clear watchers
   */
  beforeDestroy() {
    this.cacheWatcher();
  }
}
