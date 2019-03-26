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

@Component({ })
export default class OverviewComponent extends mixins(EvanComponent) {
  /**
   * favorites of the current user
   */
  favorites: Array<any> = [ ];

  /**
   * show the loading symbol
   */
  loading = true;

  /**
   * Load the favorites and map the correct language keys.
   */
  async created() {
    const runtime = (<any>this).getRuntime();
    const favorites = await runtime.profile.getBookmarkDefinitions() || {};
    const locales = [ (<any>this).$i18n.locale(), 'en' ];

    // map the favorites to an array and check for the correct i18n keys
    this.favorites = Object.keys(favorites).map(address => {
      const favorite = favorites[address];
      favorite.address = address;

      // check for correct i18n keys
      for (let i = 0; i < locales.length; i++) {
        try {
          favorite.name = favorite.i18n.name[locales[i]];
          favorite.description = favorite.i18n.description[locales[i]];

          break;
        } catch (ex) { }
      }

      return favorite;
    });

    this.loading = false;
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
}
