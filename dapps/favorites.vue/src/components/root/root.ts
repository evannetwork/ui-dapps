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
*/

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import addFavoriteDispatcher from '../../dispatchers/add';
import removeFavoriteDispatcher from '../../dispatchers/remove';

@Component({ })
export default class OverviewComponent extends mixins(EvanComponent) {
  /**
   * favorites of the current user
   */
  favorites: Array<any> = [ ];

  /**
   * Current favorite dispatchers
   */
  dispatcherInstances = { };

  /**
   * show the loading symbol
   */
  loading = true;

  /**
   * Remove dispatcher watcher
   */
  dispatcherWatcher: Function;

  /**
   * Setup dispatcher watchers and load bookmark
   */
  async initialize() {
    this.loading = true;

    // load bookmark entries
    await this.loadBookmarks();

    this.loading = false;

    // watch for updates
    this.dispatcherWatcher = Dispatcher.watch(
      ($event: Event) => this.loadBookmarks(),
      `favorites.vue.${ dappBrowser.getDomainName() }`
    );
  }

  /**
   * Remove watchers
   */
  beforeDestroy() {
    if (this.dispatcherWatcher) {
      this.dispatcherWatcher();
    }
  }

  /**
   * Load the favorites and map the correct language keys.
   */
  async loadBookmarks(reload?: boolean) {
    const runtime = (<any>this).getRuntime();

    // force bookmarks reload on clicking reloading button
    if (reload) {
      delete runtime.profile.trees[runtime.profile.treeLabels.bookmarkedDapps];
    }

    // load favorites
    const favorites = JSON.parse(JSON.stringify(await runtime.profile.getBookmarkDefinitions() ||
      {}));
    const addInstances = await addFavoriteDispatcher.getInstances(runtime);
    const removeInstances = await removeFavoriteDispatcher.getInstances(runtime);
    const locales = [ (<any>this).$i18n.locale(), 'en' ];

    // merge the favorites with the dispatcher instances
    addInstances.forEach((instance: any) => {
      favorites[instance.data.address] = JSON.parse(JSON.stringify(instance.data));
      favorites[instance.data.address].loading = true;
    });
    removeInstances.forEach((instance: any) => {
      if (favorites[instance.data.address]) {
        favorites[instance.data.address].loading = true;
      }
    });

    // map the favorites to an array and check for the correct i18n keys
    this.favorites = Object.keys(favorites).map(address => {
      const favorite = favorites[address];
      const i18n = favorite.i18n;
      favorite.address = address;

      // check for correct i18n keys
      favorite.name = i18n.name[locales[0]] || i18n.name[locales[1]];
      favorite.description = i18n.description[locales[0]] || i18n.description[locales[1]];

      return favorite;
    });
  }

  /**
   * Checks if the favorite should be opened as fullscreen application or not.
   */
  openFavorite(favorite: any) {
    if (favorite.standalone) {
      window.location.hash = `#/${ favorite.address }`;
    } else {
      const favoritesDApp = (<any>this).dapp;
      const parentDApp = favoritesDApp.baseHash.split('/');
      // remove the favorites dapp from the base hash, so the new app will be openend within the
      // parent context
      parentDApp.pop();

      window.location.hash = `#${ parentDApp.join('/') }/${ favorite.address }`;
    }
  }

  /**
   * Remove a favorite from the current user.
   *
   * @param      {any}  favorite  The favorite
   */
  async removeFavorite(favorite: any) {
    await removeFavoriteDispatcher.start((<any>this).getRuntime(), { address: favorite.address });
  }
}
