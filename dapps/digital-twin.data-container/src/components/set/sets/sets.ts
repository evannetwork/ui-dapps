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
import { EvanUIDigitalTwink, utils } from '@evan.network/digitaltwin.lib';

import * as dcUtils from '../../../utils';
import ContainerCache from '../../../container-cache';

@Component({ })
export default class DataSetsComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address (save it from routes to this variable, so all beforeDestroy
   * listeners for template-handlers will work correctly and do not uses a new address that is
   * laoding)
   */
  containerAddress = '';

  /**
   * digitalTwin address, where the container should be created for
   */
  digitalTwinAddress = '';

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Data container could not be loaded, e.g. no permissions.
   */
  error = false;

  /**
   * Currents container template definition.
   */
  template: bcc.ContainerTemplate = null;

  /**
   * List of Container properties.
   */
  properties = [ ];

  /**
   * Container cache for loading last template changes
   */
  containerCache: ContainerCache = null;

  /**
   * Watch for container template updates
   */
  cacheWatcher: any;

  /**
   * Set button classes
   */
  async created() {
    const runtime = utils.getRuntime(this);
    this.containerAddress = this.$route.params.containerAddress;
    this.digitalTwinAddress = dcUtils.getDtAddressFromUrl((<any>this).dapp);

    //  watch for updates and load initial data
    this.cacheWatcher = dcUtils.watchForUpdates(runtime, this.containerAddress,
      () => this.initialize());
    await this.initialize();

    this.loading = false;
  }

  /**
   * Clear container cache updates
   */
  beforeDestroy() {
    this.cacheWatcher();
  }

  /**
   * Load the plugin definition for the opened container / plugin.
   */
  async initialize() {
    const runtime = utils.getRuntime(this);

    try {
      let plugin = await dcUtils.getContainerOrPlugin(runtime, this.containerAddress, false);

      this.template = plugin.template;
      this.properties = Object.keys(this.template.properties);
    } catch (ex) {
      runtime.logger.log(`Could not load DataContainer detail: ${ ex.message }`, 'error');
      this.error = true;

      return;
    }
  }
}
