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
import { getMyTemplates, getRuntime } from '../../utils';

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
   * Watch for template updates.
   */
  templatesWatcher: Function;

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
    this.dispatcherWatcher && this.dispatcherWatcher();
    this.templatesWatcher && this.templatesWatcher();
    this.$store.state.uiDT && this.$store.state.uiDT.destroy(this);
  }

  /**
   * Initialize when the user has logged in.
   */
  async initialize() {
    this.loading = false;

    // set the hash change watcher, so we can detect digitaltwin change and loading
    const that = this;
    this.hashChangeWatcher = async () => {
      that.setTabStatus();
      await that.loadDigitalTwin();
    };

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

  /**
   * Load digitaltwin data. Checks for digitaltwin changes and if a digitaltwin is opened.
   */
  async loadDigitalTwin() {
    const digitalTwinAddress = (<any>this).$route.params.digitalTwinAddress;
    let uiDT: EvanUIDigitalTwin = this.$store.state.uiDT;

    // load the digitaltwin
    if (digitalTwinAddress) {
      if (!uiDT || (uiDT && digitalTwinAddress !== uiDT.address && !uiDT.loading)) {
        // if digitaltwin was set, destroy it
        uiDT && uiDT.destroy(this);

        // create new instance of the evan ui digitaltwin, that wraps general ui and navigation
        // functions
        this.$set(this.$store.state, 'uiDT', new EvanUIDigitalTwin(digitalTwinAddress));

        // load digitaltwin specific data
        await this.$store.state.uiDT.initialize(this, identitityUtils.getRuntime(this));

        // apply the container categories every time, when the digitaltwin was load, so the containers
        // and paths will be dynamic
        this.twinNavigation = this.$store.state.uiDT.navigation;

        // activate second navigation when a container is opened
        if ((<any>this).$route.name.startsWith('dt-container')) {
          this.twinNavigation[0].active = false;
          this.twinNavigation[1].active = true;
        }
      }
    } else {
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
