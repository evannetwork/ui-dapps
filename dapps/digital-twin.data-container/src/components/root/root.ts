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
import { EvanComponent } from '@evan.network/ui-vue-core';

import { utils } from '@evan.network/digitaltwin.lib';
import { getDtAddressFromUrl } from '../../utils';

@Component({ })
export default class RootComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address (save it from routes to this variable, so all beforeDestroy
   * listeners for template-handlers will work correctly and do not uses a new address that is
   * laoding)
   */
  containerAddress = '';

  /**
   * Watch for hash updates and load data container detail
   */
  hashChangeWatcher: any;

  /**
   * used to force reloading, when url is changing
   */
  loading = true;

  /**
   * digitalTwin address, where the container should be created for
   */
  digitalTwinAddress = '';

  /**
   * dc-create / plugin-create is opened
   */
  isCreate = false;

  /**
   * Starts the container address with 0x it's a container, else a plugin
   */
  isContainer = true;

  /**
   * description of the giben containerAddress / pluginName
   */
  description = null;

  async created() {
    // set the hash change watcher, so we can detect data container change and loading
    let previousContainer = this.$route.params.containerAddress;

    // force reload, when container address has changed
    this.hashChangeWatcher = (async () => {
      if (previousContainer !== this.$route.params.containerAddress) {
        previousContainer = this.$route.params.containerAddress;

        await this.initialize();
      }
    }).bind(this);

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);
  }

  /**
   * Remove the hash event listener
   */
  destroyed() {
    window.removeEventListener('hashchange', this.hashChangeWatcher);
  }

  /**
   * Check if a digital twin is opened, else check if plugin or container was loaded, to show the
   * correct left panel tree.
   */
  async initialize() {
    this.loading = true;

    // check if container / plugin is opened under a digital twin address
    const runtime = utils.getRuntime(this);
    this.digitalTwinAddress = getDtAddressFromUrl((<any>this).dapp);

    // if no digital twin was opened, check for container or plugin
    this.isCreate = this.$route.fullPath.indexOf('dc-create') !== -1 ||
      this.$route.fullPath.indexOf('plugin-create') !== -1;
    this.containerAddress = this.$route.params.containerAddress;
    if (!this.digitalTwinAddress && this.containerAddress) {
      this.isContainer = this.containerAddress.startsWith('0x');

      if (this.isContainer) {
        const container = utils.getContainer(<any>runtime, this.containerAddress);
        this.description = await container.getDescription();
      } else {
        const plugin = await bcc.Container.getContainerPlugin(runtime.profile, this.containerAddress);
        this.description = plugin.description;
      }
    }

    this.$nextTick(() => this.loading = false);
  }
}
