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

import * as events from 'events';
import readline from 'readline';
import { client } from 'nightwatch-api';

import angularUtils from './angular';
import vueUtils from './vue';

export function backspaces(n) {
  [...Array(n)].map(() => '\ue003').join('');
}

/**
 * Sets the default evan configuration parameters for the test.
 *
 * @param      {any}  browser  the nightwatch browser instance.
 * @param      {any}  customs  custom properties that should be added to the evan context
 */
export function setupEvan(browser, customs) {
  // evan.url = 'https://dashboard.test.evan.network';
  const merged = {
    angular: angularUtils,
    ensRoot: 'evan',
    vue: vueUtils,
    ...customs,
  };

  /* define proxy for late binding
     maybe we rework this later to reduce obscurity */
  const handler = {
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
    },
  };

  const proxy = new Proxy(merged, handler);

  /* fix event listener maximum:
        MaxListenersExceededWarning: Possible EventEmitter memory leak
        detected. 11 error listeners added. Use emitter.setMaxListeners() to increase limit */
  events.EventEmitter.defaultMaxListeners = 100;

  return proxy;
}

/**
 * A better `clearValue` for inputs having a more complex interaction.
 *
 * @export
 * @param {string} selector
 * @returns
 */
export function betterClearValue(selector) {
  const { RIGHT_ARROW, BACK_SPACE, TAB } = client.Keys;
  return client.getValue(selector, (result) => {
    const chars = result.value.split('');
    // Make sure we are at the end of the input
    chars.forEach(() => client.setValue(selector, RIGHT_ARROW));
    // Delete all the existing characters
    chars.forEach(() => client.setValue(selector, BACK_SPACE));
    client.setValue(selector, TAB);
  });
}

export async function getElementIdByLabel(value) {
  let elementId;
  const xPathSelector = `//*/text()[normalize-space(.) = '${value}']/parent::*`;

  // Get id of select box from "for" attribute of the label
  await client.getAttribute('xpath', xPathSelector, 'for', (attr) => {
    elementId = attr.value;
  });

  return elementId;
}

export async function getElementsCount(selector, mode = 'xpath') {
  return new Promise((resolve) => {
    client.elements(mode, selector, (result) => {
      console.log('Length', result.value.length); // (if there are 3 li, here should be a count of 3)
      resolve(result.value.length);
    });
  });
}

/**
 * Allows using `process.env.MY_VARIABLE` in cucumber tests, when implemented in step function.
 *
 * @param {*} content
 */
export function parseEnvVar(content) {
  if (!content || (typeof content === 'string' && content.length === 0)) {
    return content;
  }

  let inputValue = content;
  try {
    const envVar = content.replace('process.env.', '');
    inputValue = typeof process.env[envVar] === 'string' ? process.env[envVar] : content;
  } catch (e) {
    console.error(`Env variable ${content} is not defined.`);
  }

  return inputValue;
}

export function getSelector(label, angular) {
  if (!angular) {
    // support also the .input-wrapper element around the input
    const inputSelectors = [
      'input',
      'select',
      'textarea',
    ];

    return inputSelectors
      .map((inputSelector) => `//label[contains(., "${label}")]/parent::*//${inputSelector}`)
      .join('|');
  }

  return [
    `//ion-label[normalize-space(text()) = "${label}"]/preceding-sibling::ion-input/input`,
    `//ion-label[normalize-space(text()) = "${label}"]/following-sibling::ion-input/input`,
    `//ion-label/*[normalize-space(text()) = "${label}"]/parent::*/preceding-sibling::ion-input/input`,
    `//ion-label/*[normalize-space(text()) = "${label}"]/parent::*/following-sibling::ion-input/input`,
  ].join('|');
}

export async function pauseHere() {
  console.log('/******************************************************************************/');
  console.log('test paused, enjoy your developer tools :3');
  console.log(' ---> press ENTER key to continue <---');
  console.log('/******************************************************************************/');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question('...', (ans) => {
    rl.close();
    resolve(ans);
  }));
}
