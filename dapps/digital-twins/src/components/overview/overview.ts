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
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import { getRuntime, getLastOpenedTwins, loadFavorites } from '@evan.network/digitaltwin';
import { dispatchers } from '@evan.network/digitaltwin';
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';

@Component({ })
export default class OverviewComponent extends mixins(EvanComponent) {
  /**
   * show loading symbol
   */
  loading = true;

  /**
   * mapped for better iteration
   */
  categories: any = {
    /**
     * favorite digitaltwins of the current user
     */
    favorites: [ ],

    /**
     * dbcp description of last digitaltwins
     */
    lastTwins: [ ]
  };

  /**
   * Loaded descriptions
   */
  descriptions: any = { };

  /**
   * Watch for dispatcher updates
   */
  dispatcherWatcher: Function;

  /**
   * Load dbcp descriptions for the last digitaltwins, so we can display more informations.
   */
  async created() {
    await this.initialize();

    this.dispatcherWatcher = Dispatcher.watch(
      () => this.initialize(),
      `digitaltwins.${ (<any>this).dapp.domainName }`
    );
  }

  /**
   * Clear the dispatcher watcher
   */
  beforeDestroy() {
    this.dispatcherWatcher && this.dispatcherWatcher();
  }

  /**
   * Load the favorites and last twins
   */
  async initialize() {
    const runtime = getRuntime(this);

    this.descriptions = { };
    this.categories.favorites = await loadFavorites(runtime);
    this.categories.lastTwins = getLastOpenedTwins();

    let create = await dispatchers.digitaltwinCreateDispatcher.getInstances(runtime);
    let save = await dispatchers.digitaltwinSaveDispatcher.getInstances(runtime);
    save = save.map(instance => instance.data.address);

    // add create dbcp's, so we can display all cards with loading symbol
    create.map(instance => {
      this.descriptions[instance.data.address] = JSON.parse(
        JSON.stringify(instance.data.dbcp));
      this.descriptions[instance.data.address].loading = true;
      this.descriptions[instance.data.address].creating = true;
    });

    const loadPromises = { };
    await Promise.all([ ]
      .concat(this.categories.favorites, this.categories.lastTwins)
      .map(async (ensAddress: string) => {
        if (!this.descriptions[ensAddress]) {
          try {
            // load the description only once
            loadPromises[ensAddress] = loadPromises[ensAddress] || runtime.description
              .getDescription(ensAddress, runtime.activeAccount);
            this.descriptions[ensAddress] = (await loadPromises[ensAddress]).public;

            this.descriptions.loading = save.indexOf(ensAddress) !== -1;
          } catch (ex) { }
        }
      })
    );

    // filter favorites, that could not be loaded
    this.categories.favorites = this.categories.favorites
      .filter(ensAddress => !!this.descriptions[ensAddress]);
    this.categories.lastTwins = this.categories.lastTwins
      .filter(ensAddress => !!this.descriptions[ensAddress]);

    this.loading = false;
  }
}
