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

@Component({ })
export default class IdentitiesRootComponent extends mixins(EvanComponent) {
  /**
   * Watch for hash updates and load identity detail, if a identity was laod
   */
  hashChangeWatcher: any;

  /**
   * Was the component destroyed, before the hash change event was bind?
   */
  wasDestroyed: boolean;

  /**
   * is currently identity data loading?
   */
  loadingIdentity: false;

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
        children: [ ]
      },
      {
        name: 'my-templates',
        active: false,
        children: [ ]
      }
    ],
    [ ]
  ]

  /**
   * current identity instance
   */
  uiIdentity: EvanUIIdentity = null;

  /**
   * Initialize when the user has logged in.
   */
  async initialize() {
    await this.loadIdentity();

    // set the hash change watcher, so we can detect identity change
    const that = this;
    this.hashChangeWatcher = function() {
      that.initialize();
    };

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);

    // clear the watcher if the component was already destroyed
    if (this.wasDestroyed) {
      this.beforeDestroy();
    }
  }

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
  }

  /**
   * Load identity data. Checks for identity changes and if a identity is opened.
   */
  async loadIdentity() {
    this.uiIdentity = this.$store.state.uiIdentity;
    const identityAddress = (<any>this).$route.params.identityAddress;

    // load the identity
    if (identityAddress) {
      if (!this.uiIdentity || identityAddress !== this.uiIdentity.address) {
        // create new instance of the evan ui identity, that wraps general ui and navigation
        // functions
        this.uiIdentity = new EvanUIIdentity((<any>this).getRuntime(), this, identityAddress);
        this.$store.state.uiIdentity = this.uiIdentity;

        // load identity specific data
        await this.uiIdentity.initialize();

        // apply the container categories every time, when the identity was load, so the containers
        // and paths will be dynamic
        this.sideNav = 1;
        this.navigation[1] = this.uiIdentity.navigation;
      }
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
  }
}
