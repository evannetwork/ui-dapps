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

module.exports = {
  /**
   * Small wrapper around browser visible and set value, to be sure that a element is visbile and we
   * can directly set an value.
   *
   * @param      {any}     browser   nightwatch browser instance
   * @param      {string}  selector  element selector
   * @param      {any}     setValue  set value args
   * @return     {any}     nightwatch browser result chain
   */
  selectContractMember: function(browser, compSelector, menuSelector, contactName) {
    return browser
      .click(`${ compSelector } input`)
      .waitForElementVisible(`${ menuSelector }`, 10 * 1000)
      // search for contract members
      .setValue(`${ menuSelector } input[placeholder="Suche Kontakte, um sie hinzuzufügen..."]`, contactName)
      .waitForElementVisible(`${ menuSelector } ion-list ion-item`, 10 * 1000)
      // select the searched user
      .click(`${ menuSelector } ion-list ion-item`)
      // close the contract members
      .click(`${ menuSelector } ion-header ion-buttons.bar-buttons button`);
  },

  /**
   * Wait for the queue to be finished.
   *
   * @param      {any}  browser  nightwatch browser instance
   * @return     {any}  nightwatch browser result chain
   */
  syncFinished: function(browser) {
    return browser
      .waitForElementVisible('.toast-message', 120 * 1000)
      .assert.containsText('.toast-message', 'Synchronization finished')
      .waitForElementNotPresent('.toast-message', 10 * 1000)
  },
  /**
   * Wait for an element to be visible and 
   *
   * @param      {<type>}  browser  The browser
   */
  waitForElementVisible: function(browser, selector, wait) {
    return browser
      .waitForElementVisible(selector, wait)
      .waitForElementNotPresent('.click-block click-block-enabled click-block-active', 10 * 1000)
  }
};

