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

import { getRuntime } from '../../utils'

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
     * favorite identities of the current user
     */
    favorites: [ ],

    /**
     * dbcp description of last identities
     */
    lastIdentities: [ ]
  };

  /**
   * Loaded descriptions
   */
  descriptions: any = { };

  /**
   * Load dbcp descriptions for the last identities, so we can display more informations.
   */
  async created() {
    const runtime = getRuntime(this);

    this.categories.favorites = this.$store.state.favorites;
    this.categories.lastIdentities = this.$store.state.lastIdentities;

    const loadPromises = { };
    await Promise.all([ ].concat(this.categories.favorites, this.categories.lastIdentities)
      .map(async (ensAddress: string) => {
        try {
          // load the description only once
          loadPromises[ensAddress] = loadPromises[ensAddress] || runtime.description
            .getDescription(ensAddress, runtime.activeAccount);

          this.descriptions[ensAddress] = (await loadPromises[ensAddress]).public;
        } catch (ex) {
          console.log(ex);
        }
      })
    );

    // filter favorites, that could not be loaded
    this.categories.favorites = this.categories.favorites
      .filter(ensAddress => !!this.descriptions[ensAddress]);
    this.categories.lastIdentities = this.categories.lastIdentities
      .filter(ensAddress => !!this.descriptions[ensAddress]);

    this.loading = false;
  }
}
