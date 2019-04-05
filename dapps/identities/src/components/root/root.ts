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

import EvanUIIdentity from '../../identity';
import * as identitityUtils from '../../utils';

@Component({ })
export default class IdentitiesRootComponent extends mixins(EvanComponent) {
  /**
   * show general loading
   */
  loading = true;

  /**
   * Watch for hash updates and load identity detail, if a identity was laod
   */
  hashChangeWatcher: any;

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
        name: 'my-identities',
        active: false,
        emptyNav: 'lookup',
        children: [
          { name: 'identity-overview', path: 'overview', i18n: true },
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

    // only remove the hashChangeWatcher, when it was already bind (asynchronious call can take
    // longer and the dapp was switched before)
    if (this.hashChangeWatcher) {
      // remove the hash change listener
      window.removeEventListener('hashchange', this.hashChangeWatcher);
    }

    // clear listeners
    this.$store.state.uiDI && this.$store.state.uiDI.destroy(this);
  }

  /**
   * Initialize when the user has logged in.
   */
  async initialize() {
    if ((<any>this).$route.name) {
      this.navigation[0][0].active = true;
    }

    await this.loadFavorites();
    this.setLastOpenedIdentities();
    this.loading = false;

    await this.loadIdentity();

    // set the hash change watcher, so we can detect identity change
    const that = this;
    this.hashChangeWatcher = () => that.loadIdentity();

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);

    // clear the watcher if the component was already destroyed
    if (this.wasDestroyed) {
      this.beforeDestroy();
    }
  }

  /**
   * Load the identity favorites for the current user.
   */
  async loadFavorites() {
    const runtime = identitityUtils.getRuntime(this);
    this.$store.state.favorites = await bcc.DigitalIdentity.getFavorites(<any>runtime);
  }

  /**
   * Load identity data. Checks for identity changes and if a identity is opened.
   */
  async loadIdentity() {
    const identityAddress = (<any>this).$route.params.identityAddress;
    let uiDI: EvanUIIdentity = this.$store.state.uiDI;

    // load the identity
    if (identityAddress && (!uiDI || (uiDI && !uiDI.loading))) {
      if (!uiDI || identityAddress !== uiDI.address) {
        // if identity was set, destroy it
        uiDI && uiDI.destroy(this);

        // create new instance of the evan ui identity, that wraps general ui and navigation
        // functions
        this.$set(this.$store.state, 'uiDI', new EvanUIIdentity(identityAddress));

        // load identity specific data
        await this.$store.state.uiDI.initialize(this, identitityUtils.getRuntime(this));

        // apply the container categories every time, when the identity was load, so the containers
        // and paths will be dynamic
        this.sideNav = 1;
        this.navigation[1] = this.$store.state.uiDI.navigation;

        // show latest identities
        this.setLastOpenedIdentities();
      }
    }
  }

  /**
   * Checks for localStorage, which addresses were opened before.
   */
  setLastOpenedIdentities() {
    let lastIdentities = identitityUtils.getLastOpenedIdentities();

    // if we hadn't opened 5 identites before, use favorites
    if (lastIdentities.length < 5) {
      lastIdentities = lastIdentities.concat(this.$store.state.favorites.slice(0, 10));
      lastIdentities = Array.from(new Set(lastIdentities));
    }

    // show everytime the overview entry and apply the last identities
    this.navigation[0][0].children = [ this.navigation[0][0].children[0] ]
      .concat(lastIdentities.slice(0, 5).map((address) => {
        return { name: address, path: address, i18n: false };
      }));

    this.$store.state.lastIdentities = lastIdentities;
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
