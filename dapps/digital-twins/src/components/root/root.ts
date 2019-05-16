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

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

import { EvanUIDigitalTwin, utils, dispatchers } from '@evan.network/digitaltwin';

@Component({ })
export default class TwinsRootComponent extends mixins(EvanComponent) {
  /**
   * show general loading
   */
  loading = true;

  /**
   * Watch for hash updates and load digitaltwin detail, if a digitaltwin was laod
   */
  hashChangeWatcher: any;

  /**
   * Was the component destroyed, before the hash change event was bind?
   */
  wasDestroyed: boolean;

  /**
   * Categories of the left navigation
   */
  twinNavigation: any = [ ];

  /**
   * List of available templates
   */
  templates: any = { };

  /**
   * Current activated tab (digital twins / templates)
   */
  activeTab = 0;

  /**
   * Clear the hash change watcher
   */
  beforeDestroy() {
    this.wasDestroyed = true;

    // clear listeners
    this.hashChangeWatcher && window.removeEventListener('hashchange', this.hashChangeWatcher);
  }

  /**
   * Initialize when the user has logged in.
   */
  async initialize() {
    this.loading = false;

    // set the hash change watcher, so we can detect digitaltwin change and loading
    const that = this;
    this.hashChangeWatcher = async () => that.setTabStatus();
    await this.hashChangeWatcher();

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);

    // clear the watcher if the component was already destroyed
    if (this.wasDestroyed) {
      this.beforeDestroy();
    }
  }

  /**
   * Check the active route and set the active tab status.
   */
  setTabStatus() {
    const tab1Routes = [ 'base-overview', 'base-lookup', 'base-container-link',
      'base-container-link2', ];
    const tab2Routes = [ 'base-templates', 'dt-template' ];

    if (tab1Routes.indexOf(this.$route.name) !== -1) {
      this.activeTab = 0;
    } else if (tab2Routes.indexOf(this.$route.name) !== -1) {
      this.activeTab = 1;
    }
  }
}
