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

const setupEvan = require('../../test-utils/angular.js').setupEvan;
const twinAddress = 'DEV';

const elements = {
  dt: {
    ordersContainer: 'digital-twin > div:nth-child(2)',
    newOrder: 'table tr:first-child'
  },
  order: {
    create: {
      container: 'transport-order-create taskboard-task-create',
      form: 'transport-order-create taskboard-task-create > div:nth-child(1)',
      tasks: 'transport-order-create taskboard-task-create > div:nth-child(2)',
    },
    detail: {
      metadata: 'transport-order-detail taskboard-task-detail > div:nth-child(1)',
      tasks: 'transport-order-detail taskboard-task-detail > div:nth-child(2)',
      todo: (number) => `transport-order-detail taskboard-task-detail > div:nth-child(2) > div:nth-child(${ number })`
    }
  },
};

const wait = {
  loading: 30 * 1000,
  element: 10 * 1000,
};

const rentalFuncs = {
  /**
   * Return the rental root url
   *
   * @param      {browser instance}  browser  nightwatch instance
   * @return     {string}            root url
   */
  getRentalRoot: (browser) => `${ browser.evan.url }#/lindig.${ browser.evan.ensRoot }`,

  /**
   * Open digital twin
   *
   * @param      {browser instance}  browser    nightwatch instance
   * @param      {string}            dtAddress  digital twin to open
   * @return     {string}            nightwatch browser result chain
   */
  openDigitalTwin: (browser, dtAddress) => {
    return browser
      .waitForElementVisible('lindig-dashboard-component', wait.element)
      .waitForElementVisible('digital-twin-select', wait.element)
      .setValue('digital-twin-select ion-input[type="text"] input', [twinAddress, browser.Keys.ENTER])
      // check if twin is loading
      .waitForElementVisible(elements.dt.ordersContainer, wait.element)
      .assert.containsText(`${ elements.dt.ordersContainer } .content-heading h3.content-header`, 'Übersicht Aufträge')
  },
};

/**
 * Test the transport order creation.
 *
 * @param      {any}  browser  nightwatch browser instance
 */
const createTransportOrder = function (browser) {
  // use it for setting into the form and checking up the list entries
  const orderName = ` Test - ${ (new Date().toString()) }`;
  const dispo = browser.evan.accounts.rental.dispo;

  browser
    .evan.login(dispo.mnemonic, dispo.password)
    // navigate to dashboard
    .url(browser.evan.getRentalRoot())
    // check if the dashboard is loading and the correct dapp is started and open the dev twin
    .evan.openDigitalTwin(twinAddress)
    // start creating transport order
    .click(`${ elements.dt.ordersContainer } .content-heading button.button-md`)
      .waitForElementVisible('ion-popover ion-list ion-item:first-child', wait.element)
      .click('ion-popover ion-list ion-item:first-child')

    // check if transport order is loading and set values
    .waitForElementVisible(`${ elements.order.create.form } input[placeholder="Geben Sie den Titel des Auftrags"]`, wait.element)
      .setValue(`${ elements.order.create.form } input[placeholder="Geben Sie den Titel des Auftrags"]`, orderName)
      // select contract members
      .evan.selectContractMember(`${ elements.order.create.form } contract-members`, `ion-menu.member-add-menu`, 'Demo Fahrer DEV')
      // set date and time
      .click(`${ elements.order.create.form } ion-datetime button`)
        .waitForElementVisible('ion-picker-cmp .picker-toolbar div:nth-child(2) button', wait.element)
        .click('ion-picker-cmp .picker-toolbar div:nth-child(2) button')
      // customer
      .setValue(`${ elements.order.create.form } input[placeholder="Kunde"]`, `Test Kunde`).pause(500)
      .setValue(`${ elements.order.create.form } input[placeholder="Telefonnummer"]`, `Test Telefonnummer`).pause(500)
      .setValue(`${ elements.order.create.form } input[placeholder="E-Mail Addresse"]`, `test@test.de`).pause(500)
      .setValue(`${ elements.order.create.form } input[placeholder="Straße"]`, `Test Straße`).pause(500)
      .setValue(`${ elements.order.create.form } input[placeholder="Hausnummer"]`, `Test Hausnummer`).pause(500)
      .setValue(`${ elements.order.create.form } input[placeholder="PLZ"]`, `00000`).pause(500)
      .setValue(`${ elements.order.create.form } input[placeholder="Stadt"]`, `Test Stadt`).pause(500)
      // description
      .setValue(`${ elements.order.create.form } textarea[placeholder="z.B. spezifische Beschreibung der Lage"]`, `Test Beschreibung Test Beschreibung Test Beschreibung Test Beschreibung`).pause(500)
      // start creating
      .click(`${ elements.order.create.container } button[color="transparency"]`)

    // wait for creation finished and check if it is available
    .evan.syncFinished()
      // wait until the loading button is gone, and the new list was loaded
      .waitForElementNotPresent(`${ elements.dt.ordersContainer } ${ elements.dt.newOrder } button.loading-button`, wait.element)
      .click(`.refresh-icon`)
      .waitForElementPresent(`${ elements.dt.ordersContainer } ${ elements.dt.newOrder } td:first-child`, wait.loading)
      .assert.containsText(`${ elements.dt.ordersContainer } ${ elements.dt.newOrder } td:first-child`, orderName)

    // check if the order can be loaded
    .click(`${ elements.dt.ordersContainer } ${ elements.dt.newOrder } button`)
      .waitForElementVisible(`${ elements.order.detail.metadata } ion-grid h2.content-header`, wait.element)
      .assert.containsText(`${ elements.order.detail.metadata } ion-grid h2.content-header`, orderName)
      // check if the task are available
      .assert.containsText(`${ elements.order.detail.todo(2) } .todo-header-container h2.content-header`, 'Maschine für Transport anmelden')
      .assert.containsText(`${ elements.order.detail.todo(3) } .todo-header-container h2.content-header`, 'Maschine transportieren und abmelden')
      .assert.containsText(`${ elements.order.detail.todo(4) } .todo-header-container h2.content-header`, 'Schadensreport')
      .assert.containsText(`${ elements.order.detail.todo(5) } .todo-header-container h2.content-header`, 'Unterschrift des Kunden')
};

/**
 * Test the transport order solving.
 *
 * @param      {any}  browser  nightwatch browser instance
 */
const solveTransportOrder = function(browser) {
  const driver = browser.evan.accounts.rental.driver;

  browser
    .evan.login(driver.mnemonic, driver.password)
    // navigate to dashboard
    .url(browser.evan.getRentalRoot())
    // check if the dashboard is loading and the correct dapp is started and open the dev twin
    .evan.openDigitalTwin(twinAddress)

    // check if the order can be loaded
    .waitForElementPresent(`${ elements.dt.ordersContainer } ${ elements.dt.newOrder }`, wait.loading)
    .click(`${ elements.dt.ordersContainer } ${ elements.dt.newOrder } button`)
      .waitForElementVisible(`${ elements.order.detail.metadata } ion-grid ion-col:nth-child(2) button:nth-child(2)`, wait.element)

    // accept the contract
    .click(`${ elements.order.detail.metadata } ion-grid ion-col:nth-child(2) button:nth-child(2)`)
    .evan.syncFinished()

    // finish 1. task
    .waitForElementPresent(`${ elements.order.detail.todo(2) } .todo-header-container button`, wait.element)
      // activate todo
      .click(`${ elements.order.detail.todo(2) } .todo-header-container button`)
      // activate todo
      .waitForElementPresent(`ion-alert .alert-button-group button:nth-child(2)`, wait.element)
      .click(`ion-alert .alert-button-group button:nth-child(2)`)
      .evan.syncFinished()

    // finish 2. task
    .waitForElementPresent(`${ elements.order.detail.todo(3) } .todo-header-container button`)
      // activate todo
      .click(`${ elements.order.detail.todo(3) } .todo-header-container button`)
      // submit alert
      .waitForElementPresent(`ion-alert .alert-button-group button:nth-child(2)`, wait.element)
      .click(`ion-alert .alert-button-group button:nth-child(2)`)
      .evan.syncFinished()

    // finish 3. task
    .waitForElementPresent(`${ elements.order.detail.todo(4) } .todo-header-container button`, wait.element)
      // open todo
      .click(`${ elements.order.detail.todo(4) } .todo-header-container button`)
      .waitForElementPresent(`${ elements.order.detail.todo(4) } .todo-data`, wait.element)
      // select first radio checkbox
      .click(`${ elements.order.detail.todo(4) } .todo-data button#rb-0-0`)

      // make pictures
      .click(`${ elements.order.detail.todo(4) } .todo-data > ion-item .picture-container > button`)
        .waitForElementPresent(`snapshot-dialog .button-container button:nth-child(2)`, wait.element)
        .pause(1000)
        .click(`snapshot-dialog .button-container button:nth-child(2)`)
        .waitForElementNotPresent(`snapshot-dialog .button-container button:nth-child(2)`, wait.element)
      .click(`${ elements.order.detail.todo(4) } .todo-data > ion-item .picture-container > button`)
        .waitForElementPresent(`snapshot-dialog .button-container button:nth-child(2)`, wait.element)
        .pause(1000)
        .click(`snapshot-dialog .button-container button:nth-child(2)`)
        .waitForElementNotPresent(`snapshot-dialog .button-container button:nth-child(2)`, wait.element)
      .click(`${ elements.order.detail.todo(4) } .todo-data > ion-item .picture-container > button`)
        .waitForElementPresent(`snapshot-dialog .button-container button:nth-child(2)`, wait.element)
        .pause(1000)
        .click(`snapshot-dialog .button-container button:nth-child(2)`)
        .waitForElementNotPresent(`snapshot-dialog .button-container button:nth-child(2)`, wait.element)

      // set textarea value
      .setValue(`${ elements.order.detail.todo(4) } .todo-data textarea`, 'Test Schadensreport')

      // finish the todo
      .click(`${ elements.order.detail.todo(4) } .todo-data .todo-solve-container button`)
      .evan.syncFinished()

    // finish 4. task
    .waitForElementPresent(`${ elements.order.detail.todo(5) } .todo-header-container button`, wait.element)
      // open todo
      .click(`${ elements.order.detail.todo(5) } .todo-header-container button`)
      .waitForElementPresent(`${ elements.order.detail.todo(5) } .todo-data input`, wait.element)

      // set input value
      .setValue(`${ elements.order.detail.todo(5) } .todo-data input`, 'Test Schadensreport Signatur')

      // // draw to canvas
      .moveToElement('canvas', 10, 10)
      .mouseButtonClick(0)

      // finish the todo
      .click(`${ elements.order.detail.todo(5) } .todo-data .todo-solve-container button`)
      .evan.syncFinished()

    // finish the task
    .waitForElementPresent(`${ elements.order.detail.tasks } > div > button`, wait.element)
      .click(`${ elements.order.detail.tasks } > div > button`)
      // accept the popup
      .waitForElementPresent(`ion-alert .alert-button-group button:nth-child(2)`, wait.element)
      .click(`ion-alert .alert-button-group button:nth-child(2)`)
      .evan.syncFinished()
}

/**
 * Test the transport order finishing.
 *
 * @param      {any}  browser  nightwatch browser instance
 */
const finishTransportOrder = function(browser) {
  const dispo = browser.evan.accounts.rental.dispo;

  browser
    .evan.login(dispo.mnemonic, dispo.password)
    // navigate to dashboard
    .url(browser.evan.getRentalRoot())
    // check if the dashboard is loading and the correct dapp is started and open the dev twin
    .evan.openDigitalTwin(twinAddress)

    // check if the order can be loaded
    .waitForElementPresent(`${ elements.dt.ordersContainer } ${ elements.dt.newOrder }`, wait.loading)
    .click(`${ elements.dt.ordersContainer } ${ elements.dt.newOrder } button`)
      .waitForElementVisible(`${ elements.order.detail.metadata } ion-grid ion-col:nth-child(2) button:nth-child(1)`, wait.element)
      .click(`${ elements.order.detail.metadata } ion-grid ion-col:nth-child(2) button:nth-child(1)`)
      .evan.syncFinished()
};

module.exports = {
  'before': (browser) => setupEvan(browser, rentalFuncs),
  'create-transport-order': createTransportOrder,
  'solve-transport-order': solveTransportOrder,
  'finish-transport-order': finishTransportOrder,
  'afterEach': (browser) => browser.evan.logout(),
  'after': (browser) => browser.end(),
};
