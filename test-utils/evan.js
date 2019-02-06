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

const evan = {
  /**
   * Login to the browser using an mnemonic and password.
   *
   * @param      {string}  mnemonic  12 word mnemonic seeed
   * @param      {string}  password  password th unlock the account
   * @return     {any}     nightwatch browser result chain
   */
  login: function(browser, mnemonic, password) {
    return browser
      .url(this.url)
      .waitForElementVisible('onboarding-welcome', 30000)
      .assert.elementPresent('.slide-zoom > h3')
      .click('.start-buttons > button:nth-child(2)')
      .waitForElementVisible('mnemonic-display', 10000)
      .click('mnemonic-display ion-toggle')
      .setValue('.direct-input ion-textarea > textarea', [mnemonic, browser.Keys.ENTER])
      .waitForElementVisible('.password-dialog', 10000)
      .setValue('.password-dialog ion-input > input', [password, browser.Keys.ENTER])
  }
};

/**
 * Sets the default evan configuration parameters for the test.
 *
 * @param      {any}  browser  the nightwatch browser instance.
 */
exports.setupEvan = function(browser) {
  browser.evan = evan;

  // bind all the functions to the browser context
  Object.keys(browser.evan).forEach(funcName => {
    if (typeof browser.evan[funcName] === 'function') {
      browser.evan[funcName] = browser.evan[funcName].bind(evan, browser);
    }
  });

  // setup specific option variables
  browser.evan.url = browser.options.globals.url;
}
