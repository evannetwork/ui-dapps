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

import readline from 'readline';
import { client } from 'nightwatch-api';
import angularUtils from './angular';
import vueUtils from './vue';

const backspaces = (n) => [...Array(n)].map(() => '\ue003').join('');

/**
 * Sets the default evan configuration parameters for the test.
 *
 * @param      {any}  browser  the nightwatch browser instance.
 * @param      {any}  customs  custom properties that should be added to the evan context
 */
const setupEvan = function(browser, customs) {
  // evan.url = 'https://dashboard.test.evan.network';
  const merged = Object.assign(
    {
      angular: angularUtils,
      ensRoot: 'evan',
      vue: vueUtils,
    },
    customs,
  );

  // define proxy for late binding
  // maybe we rework this later to reduce obscurity
  var handler = {
    get: (obj, prop) => {
      let toReturn;
      if (browser.options.globals[prop]) {
        toReturn = browser.options.globals[prop];
      } else if (customs && customs[prop]) {
        toReturn = customs[prop];
      } else {
        toReturn = angularUtils[prop] || vueUtils[prop];
      }
      return typeof toReturn === 'function' ? toReturn.bind(obj, browser) : toReturn;
    }
  };

  var proxy = new Proxy(merged, handler);

  // fix event listener maximum:
  //    MaxListenersExceededWarning: Possible EventEmitter memory leak
  //    detected. 11 error listeners added. Use emitter.setMaxListeners() to increase limit
  require('events').EventEmitter.defaultMaxListeners = 100;

  return proxy;
}

module.exports = {
  backspaces,
  setupEvan,
  pauseHere: async () => {
    console.log('/******************************************************************************/');
    console.log('test paused, enjoy your developer tools :3');
    console.log(' ---> press ENTER key to continue <---');
    console.log('/******************************************************************************/');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise(resolve => rl.question('...', ans => {
      rl.close();
      resolve(ans);
    }))
  },
};
