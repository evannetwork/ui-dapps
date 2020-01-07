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

import VueRouter, { Route } from 'vue-router';

// !IMPORTANT!: Import this d.ts file within your vue tsconfig to fix "cannot find module" errors
// while importing vue files
declare module '*.vue' {
  import { EvanComponent, } from '@evan.network/ui-vue-core';
  export default EvanComponent;
}

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
