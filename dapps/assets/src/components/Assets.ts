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
import Component, { mixins } from 'vue-class-component';
import VueRouter, { Route } from 'vue-router';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';

declare module 'vue/types/vue' {
  interface Vue {
    $i18n: any;
    $router: VueRouter;
    $route: Route;
    $store: any;
    $t: Function;
    dapp: Dapp;
    getRuntime: Function;
  }

  interface Dapp {
    baseHash: string;
    baseUrl: string;
    contractAddress: string;
    domainName: string;
    ens: string;
    fullUrl: string;
    rootEns: string;
  }
}

@Component
export default class AssetsComponent extends mixins(EvanComponent) {
  searchQuery: string;

  navItems = [
    {
      key: 'digitaltwins',
      icon: 'mdi mdi-account-outline'
    },
    {
      key: 'contacts',
      icon: 'mdi mdi-wallet-outline'
    }
    // { key: `others`, icon: 'mdi mdi-check-decagram' }
  ].map(entry => {
    return {
      label: `_assets.${entry.key}.${entry.key}-title`,
      icon: entry.icon,
      to: { name: entry.key }
    };
  });

  /**
   * Handle user search query
   */
  handleSearchEnter() {
    this.$router.push({ name: 'search', params: { query: this.searchQuery } });
    this.searchQuery = '';
  }
}
