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
import { EvanComponent } from '@evan.network/ui-vue-core';
import { EvanUIDigitalTwin, utils } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../dispatchers/registy';

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
   * Full reference url to the current twin
   */
  twinUrl = '';

  /**
   * Clear the hash change watcher
   */
  beforeDestroy() {
    this.wasDestroyed = true;

    // clear listeners
    this.hashChangeWatcher && window.removeEventListener('hashchange', this.hashChangeWatcher);
    this.$store.state.uiDT && this.$store.state.uiDT.destroy(this);
  }

  /**
   * Initialize when the user has logged in.
   */
  async initialize() {
    // set the hash change watcher, so we can detect digitaltwin change and loading
    const that = this;
    this.hashChangeWatcher = async () => await that.loadDigitalTwin();
    await this.loadDigitalTwin();
    this.loading = false;

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);

    // clear the watcher if the component was already destroyed
    if (this.wasDestroyed) {
      this.beforeDestroy();
    }
  }

  /**
   * Load digitaltwin data. Checks for digitaltwin changes and if a digitaltwin is opened.
   */
  async loadDigitalTwin() {
    const $route = (<any>this).$route;
    const digitalTwinAddress = $route.params.digitalTwinAddress;
    let uiDT: EvanUIDigitalTwin = this.$store.state.uiDT;

    // load the digitaltwin
    if (digitalTwinAddress) {
      if (!uiDT || (uiDT && digitalTwinAddress !== uiDT.address && !uiDT.loading)) {
        // if digitaltwin was set, destroy it
        uiDT && uiDT.destroy(this);

        // create new instance of the evan ui digitaltwin, that wraps general ui and navigation
        // functions
        this.$set(this.$store.state, 'uiDT', new EvanUIDigitalTwin(digitalTwinAddress));
        this.$store.state.uiDT.loading = true;

        // specify twin url for left tree root
        this.twinUrl = [
          (<any>this).dapp.fullUrl,
          this.$route.params.digitalTwinAddress,
        ].join('/');

        // load digitaltwin specific data
        await this.$store.state.uiDT.initialize(this, utils.getRuntime(this));
      }
    } else {
      // if digitaltwin was set, destroy it
      uiDT && uiDT.destroy(this);

      this.$set(this.$store.state, 'uiDT', null);
    }
  }

  /**
   * Activate a category and close all others.
   *
   * @param      {Arrayany}  categories  List of categories that should be closed
   * @param      {any}       category    Category that should be activated
   */
  toggleLeftCategory(categories: Array<any>, category: any) {
    categories.forEach(deactivateCat => deactivateCat.active = false);

    category.active = !category.active;

    // if the category is empty, navigate directly tho the empty nav point
    if (category.children.length === 0 && category.emptyNav) {
      (<any>this).evanNavigate(category.emptyNav);
    }

    if (category.children.length === 1) {
      (<any>this).evanNavigate(category.children[0].path);
    }
  }
}
