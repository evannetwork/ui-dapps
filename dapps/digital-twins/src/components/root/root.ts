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

import EvanUIDigitalTwin from '../../digitaltwin';
import * as identitityUtils from '../../utils';
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
   * Watch for dispatcher updates
   */
  dispatcherWatcher: Function;

  /**
   * Was the component destroyed, before the hash change event was bind?
   */
  wasDestroyed: boolean;

  /**
   * Show left panel overview or is an detail is opened?
   */
  sideNav = 0;

  /**
   * Categories of the left navigation
   */
  navigation: any = [
    [
      {
        name: 'my-digitaltwins',
        active: true,
        emptyNav: 'lookup',
        children: [
          { name: 'digitaltwin-overview', path: 'overview', i18n: true },
        ]
      },
      {
        name: 'my-templates',
        active: false,
        children: [ ]
      }
    ],
    [ ]
  ];

  /**
   * Clear the hash change watcher
   */
  beforeDestroy() {
    this.wasDestroyed = true;

    // clear listeners
    this.hashChangeWatcher && window.removeEventListener('hashchange', this.hashChangeWatcher);
    this.dispatcherWatcher && this.dispatcherWatcher();
    this.$store.state.uiDT && this.$store.state.uiDT.destroy(this);
  }

  /**
   * Initialize when the user has logged in.
   */
  async initialize() {
    await this.updateIdentities();
    this.loading = false;

    await this.loadDigitalTwin();

    // set the hash change watcher, so we can detect digitaltwin change and loading
    const that = this;
    this.hashChangeWatcher = () => that.loadDigitalTwin();
    this.dispatcherWatcher = Dispatcher.watch(
      () => this.updateIdentities(),
      `digitaltwins.${ (<any>this).dapp.domainName }`
    );

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);

    // clear the watcher if the component was already destroyed
    if (this.wasDestroyed) {
      this.beforeDestroy();
    }
  }

  /**
   * Load users favorites and check for identities in creation or update process.
   */
  async updateIdentities() {
    await this.loadFavorites();
    await this.setLastOpenedTwins();
  }

  /**
   * Load the digitaltwin favorites for the current user.
   */
  async loadFavorites() {
    const runtime = identitityUtils.getRuntime(this);
    const favorites = this.$store.state.favorites =
      await bcc.DigitalTwin.getFavorites(<any>runtime);

    // load dispatchers and merge the favorites with the favorite dispatchers
    const add = await dispatchers.favoriteAddDispatcher.getInstances(runtime);
    const remove = await dispatchers.favoriteRemoveDispatcher.getInstances(runtime);

    // add favorites directly
    Object.keys(add).forEach(key => favorites.push(add[key].data.address));
    // remove favorites
    Object.keys(remove).forEach(key =>
      favorites.splice(favorites.indexOf(add[key].data.address), 1));
  }

  /**
   * Load digitaltwin data. Checks for digitaltwin changes and if a digitaltwin is opened.
   */
  async loadDigitalTwin() {
    const digitalTwinAddress = (<any>this).$route.params.digitalTwinAddress;
    let uiDT: EvanUIDigitalTwin = this.$store.state.uiDT;

    // load the digitaltwin
    if (digitalTwinAddress && (!uiDT || (uiDT && !uiDT.loading))) {
      if (!uiDT || digitalTwinAddress !== uiDT.address) {
        // if digitaltwin was set, destroy it
        uiDT && uiDT.destroy(this);

        // create new instance of the evan ui digitaltwin, that wraps general ui and navigation
        // functions
        this.$set(this.$store.state, 'uiDT', new EvanUIDigitalTwin(digitalTwinAddress));

        // load digitaltwin specific data
        await this.$store.state.uiDT.initialize(this, identitityUtils.getRuntime(this));

        // apply the container categories every time, when the digitaltwin was load, so the containers
        // and paths will be dynamic
        this.sideNav = 1;
        this.navigation[1] = this.$store.state.uiDT.navigation;

        // show latest digitaltwins
        await this.setLastOpenedTwins();
      } else {
        this.sideNav = 1;
      }

      // activate second navigation when a container is opened
      if ((<any>this).$route.name.startsWith('dt-container')) {
        this.navigation[1][0].active = false;
        this.navigation[1][1].active = true;
      }
    }
  }

  /**
   * Checks for localStorage, which addresses were opened before.
   */
  async setLastOpenedTwins() {
    const runtime = identitityUtils.getRuntime(this);
    let lastTwins = identitityUtils.getLastOpenedTwins();

    // if we hadn't opened 5 identites before, use favorites
    if (lastTwins.length < 5) {
      lastTwins = lastTwins.concat(this.$store.state.favorites.slice(0, 10));
      lastTwins = Array.from(new Set(lastTwins));
    }

    let create = await dispatchers.digitaltwinCreateDispatcher.getInstances(runtime);
    let save = await dispatchers.digitaltwinSaveDispatcher.getInstances(runtime);
    const loadingAddresses = [ ].concat(
      Object.keys(create).map(key => create[key].data.address),
      Object.keys(save).map(key => save[key].data.address),
    );

    // show everytime the overview entry and apply the last digitaltwins
    this.navigation[0][0].children = [ this.navigation[0][0].children[0] ]
      .concat(lastTwins.slice(0, 5).map((address) => {
        return {
          name: address,
          path: address,
          i18n: false,
          loading: loadingAddresses.indexOf(address) !== -1
        };
      }));

    this.$store.state.lastTwins = lastTwins;
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
