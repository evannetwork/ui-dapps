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
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { utils } from '@evan.network/digitaltwin.lib';

import UiContainer from '../../../UiContainer';


interface ShareFormInterface extends EvanForm {
  subject: EvanFormControl;
}

@Component({ })
export default class ContainerComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address
   */
  containerAddress = '';

  /**
   * Opened digital twin
   */
  digitalTwinAddress = null;

  /**
   * Ui container instance
   */
  uiContainer: UiContainer = null;

  /**
   * Tabs for top navigation
   */
  tabs: Array<any> = [ ];

  /**
   * Show loading symbol
   */
  loading = true;

  /**
   * Error during load
   */
  error = true;

  /**
   * Containers description
   */
  description = null;

  /**
   * ref handlers
   */
  reactiveRefs: any = { };

  /**
   * Watch for hash updates and load digitaltwin detail, if a digitaltwin was laod
   */
  hashChangeWatcher: any;

  /**
   * Load the container data
   */
  async created() {
    this.containerAddress = this.$route.params.containerAddress;

    // watch for saving updates
    this.hashChangeWatcher = (async () => {
      if (this.containerAddress !== this.$route.params.containerAddress) {
        this.containerAddress = this.$route.params.containerAddress;

        await this.setupContainer();
      }
    }).bind(this);

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);

    await this.setupContainer();

    this.loading = false;
  }

  /**
   * Clear location change watchers
   */
  beforeDestroy() {
    this.hashChangeWatcher && window.removeEventListener('hashchange', this.hashChangeWatcher);
  }

  /**
   * Load the plugin data
   */
  async setupContainer() {
    this.loading = true;

    this.tabs = [ 'dc-sets', 'dc-technical', 'dc-permissions', ]
      .map(urlKey => ({
        id: `tab-${ urlKey }`,
        href: `${ (<any>this).dapp.fullUrl }/${ this.containerAddress }/${ urlKey }`,
        text: `_digitaltwins.breadcrumbs.${ urlKey }`
      }));

    // load ui container data
    const uiContainer = new UiContainer(this);
    (await uiContainer.loadPlugin(false, true));

    // set local data
    this.error = uiContainer.error;
    this.description = uiContainer.description;
    this.digitalTwinAddress = uiContainer.digitalTwinAddress;

    this.loading = false;
  }
}
