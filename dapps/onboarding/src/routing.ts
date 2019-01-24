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
import Vue from 'vue';
import VueRouter from 'vue-router';
import { getDomainName } from 'dapp-browser';

import WelcomeComponent from './components/welcome.vue';

/**
 * export them, so they can be used everywhere
 */
export let router: any;
export let basePath: any;

/**
 * Start the routing for the current application.
 *
 * @param      {string}  dbcpName  current inserted dbcp name to map relative paths to it
 */
export function initializeRouting(dbcpName: string) {
  Vue.use(VueRouter);

  // get the correct base paths
  const baseDAppName = `${ dbcpName }.${ getDomainName() }`;
  const beforePath = window.location.hash.split(baseDAppName)[0];
  basePath = (beforePath + baseDAppName).replace('#', '');
  
  let routes = [
    { path: `${ basePath }`, name: 'welcome', component: WelcomeComponent },
  ];

  // initialize vue router using the provided routes
  router = new VueRouter({ base: basePath, routes: routes });

  // start up the router!
  router.push({ path: `${ basePath }` });
}
