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

import { dapp, routing } from '@evan.network/ui-dapp-browser';

import * as utils from './utils';
import evanGlobals from './evanGlobals';

/**
 * small navigation library Navigo is used to handle comfortable url route writing
 */
let lastRootENS: string;

export let router: any = routing.router;
export let defaultDAppENS: string;

function getHistory(): string[] {
  // load history from cache
  if (window.performance.navigation.type === 1 && !window.sessionStorage['evan-route-reloaded']) {
    return [];
  }
  try {
    return JSON.parse(window.sessionStorage['evan-route-history']);
  } catch (ex) { }


  // setup history functions
  return [];
}

export let history: string[] = getHistory();

/**
 * Go to onboarding. (#/onboarding.evan)
 */
export function goToOnboarding() {
  const hashOrigin = window.location.hash.replace(/#\/|#/g, '');
  const activeRoute = hashOrigin.split('?')[0];
  const queryParams = hashOrigin.split('?')[1];

  router.navigate(`/dashboard.vue.evan/onboarding.vue.${utils.getDomainName()}`
    + `?origin=${activeRoute}${queryParams ? `&${queryParams}` : ''}`);
}

/**
 * Go to dashboard.  (#/dashboard.evan)
 */
export function goToDashboard() {
  router.navigate(`/dashboard.vue.${utils.getDomainName()}`);
}

/**
 * Determines if the user is on the onboarding page.
 *
 * @return     {boolean}  True if onboarding, False otherwise.
 */
export function isOnboarding(): boolean {
  return [`/onboarding.${utils.getDomainName()}`, `/onboarding.vue.${utils.getDomainName()}`]
    .filter((onboardingUrl) => window.location.hash.indexOf(onboardingUrl) !== -1)
    .length !== 0;
}

/**
 * Gets the active root ens.
 *
 * @return     {string}  The active root ens.
 */
export function getActiveRootENS(): string {
  const splitted = window.location.hash.replace(/#\/|#/g, '').split('?')[0].split('/');

  if (splitted.length > 0) {
    return splitted[0];
  }

  return '';
}

/**
 * Gets the default DApp ens.
 *
 * @return     {string}  default DApp ens path
 */
export async function getDefaultDAppENS(): Promise<string> {
  const { host } = window.location;

  if (!host.startsWith('ipfs') && !host.startsWith('localhost')) {
    if (host !== 'dashboard.evan.network' && host !== 'dashboard.test.evan.network') {
      const hostDApp = host.replace('evan.network', 'evan');

      try {
        const definition = await evanGlobals.System.import(`${hostDApp}!ens`);

        if (definition && definition.dapp && definition.dapp.origin) {
          return hostDApp;
        }
      } catch (ex) { }
    }
  }

  return `dashboard.vue.${utils.getDomainName()}`;
}

/**
 * Prerouting checks to handle if the user was logged in and onboared. Navigates to onboarding /
 * default dapp ens when necessary.
 */
export async function beforeRoute(): Promise<void> {
  if (!getActiveRootENS()) {
    router.navigate(`/${defaultDAppENS}`);
  }
}

/**
 * Function to check if the route DApp hash changed => run beforeRoute and set
 * the route active
 *
 * @return     {void}  resolved when routed
 */
export async function onRouteChange(): Promise<void> {
  let activeRootENS = getActiveRootENS();

  if (lastRootENS !== activeRootENS) {
    lastRootENS = activeRootENS;

    // route to onboardin or dashboard
    try {
      await beforeRoute();

      activeRootENS = getActiveRootENS();
      lastRootENS = activeRootENS;

      await dapp.startDApp(activeRootENS);
    } catch (ex) {
      utils.log(`Error while onRouteChange and startDApp (${activeRootENS})`);
      console.error(ex);
    }
  }
}

/**
 * Initialize the whole routing mechanism.
 *
 * @param      {string}  initialRoute  initial route that should replace the default ens url paths
 *                                     (eg. dashboard.evan => my-initial-route.evan)
 * @return     {void}    resolved when routing was created
 */
export async function initialize(initialRoute?: string): Promise<void> {
  // create Navigo with angular # routing
  defaultDAppENS = await getDefaultDAppENS();

  // was already done by original ui-dapp-browser router
}

/**
 * Takes the current url, removes #, /#, #/ and returns the original hash value
 * without query params
 *
 * @return     {string}  transforms #/dapp/dapp1?param1=est to dapp/dapps
 */
export function getRouteFromUrl(): string {
  return window.location.hash
    .replace('#!', '')
    .replace(/#\/|\/#/g, '')
    .split('?')[0];
}

/**
 * Takes the current navigation history and writes it to the sessionStorage if the user navigates to
 * another page and navigates back
 */
export function updateHistory() {
  window.sessionStorage['evan-route-history'] = JSON.stringify(history);
}

/**
 * Parse the url queryParams and return a specific parameter from it
 *
 * @param      {string}  name    name of the parameter
 * @param      {string}  url     url to parse, detail is window.location.href
 * @return     {string}  value of the parameter / null if not defined
 */
export function getQueryParameterValue(name: string, url = window.location.href) {
  // parse out the parameters
  const regex = new RegExp(`[?&]${name.replace(/[\[\]]/g, '\\$&')}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);

  if (!results || !results[2]) {
    return null;
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Returns a bare object of the URL's query parameters.
 * You can pass just a query string rather than a complete URL.
 * The default URL is the current page.
 *
 * @return     {any}  all parameters with its values
 */
export function getQueryParameters(url: string = window.location.search.split('#')[0]): { [key: string]: any} {
  // http://stackoverflow.com/a/23946023/2407309
  const urlParams: any = {};
  const queryString = url.split('?')[1];

  if (queryString) {
    const keyValuePairs = queryString.split('&');

    for (let i = 0; i < keyValuePairs.length; i++) {
      const keyValuePair = keyValuePairs[i].split('=');
      const paramName = keyValuePair[0];
      const paramValue = keyValuePair[1] || '';
      urlParams[paramName] = decodeURIComponent(paramValue.replace(/\+/g, ' '));
    }
  }

  return urlParams;
}
