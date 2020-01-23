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

import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import * as testUtils from '../../test-utils/test-utils.js';

const twinAddress = 'DEV';

const elements = {
  dt: {
    ordersContainer: 'digital-twin > div:nth-child(2)',
    newOrder: 'table tr:first-child',
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
      todo: (number) => `transport-order-detail taskboard-task-detail > div:nth-child(2) > div:nth-child(${number})`,
    },
  },
};

const wait = {
  loading: 30 * 1000,
  element: 20 * 1000,
};

let evan;
const rentalFuncs = {
  /**
   * Return the rental root url
   *
   * @param      {browser instance}  browser  nightwatch instance
   * @return     {string}            root url
   */
  getRentalRoot: (browser) => `${evan.baseUrl}#/lindig.evan`,

  /**
   * Open digital twin
   *
   * @param      {browser instance}  browser    nightwatch instance
   * @param      {string}            dtAddress  digital twin to open
   * @return     {string}            nightwatch browser result chain
   */
  openDigitalTwin: async (browser, dtAddress) => {
    await browser.waitForElementVisible('lindig-dashboard-component', wait.element);
    await browser.waitForElementVisible('digital-twin-select', wait.element);
    await browser.setValue('digital-twin-select ion-input[type="text"] input', [twinAddress, browser.Keys.ENTER]);
    // check if twin is loading
    await browser.waitForElementVisible(elements.dt.ordersContainer, wait.loading);
    await browser.assert.containsText(`${elements.dt.ordersContainer} .content-heading h3.content-header`, 'Übersicht Aufträge');
  },
};

evan = testUtils.setupEvan(client, rentalFuncs);

/**
 * Test the transport order creation.
 *
 * @param      {any}  browser  nightwatch browser instance
 */
const createTransportOrder = async function (browser) {
  // use it for setting into the form and checking up the list entries
  const orderName = ` Test - ${browser.options.desiredCapabilities.browserName} - ${(new Date().toString())}`;
  // navigate to dashboard
  await browser.url(evan.getRentalRoot());
  await browser.waitForElementVisible('#lindig', wait.element);
  // check if the dashboard is loading and the correct dapp is started and open the dev twin
  await evan.openDigitalTwin(twinAddress);
  // start creating transport order
  await evan.angularClick(`${elements.dt.ordersContainer} .content-heading button.button-md`);
  await browser.waitForElementVisible('ion-popover ion-list ion-item:first-child', wait.element);
  await evan.angularClick('ion-popover ion-list ion-item:first-child');

  // check if transport order is loading and set values
  await browser.waitForElementVisible(`${elements.order.create.form} input[placeholder="Geben Sie den Titel des Auftrags"]`, wait.element);
  await browser.setValue(`${elements.order.create.form} input[placeholder="Geben Sie den Titel des Auftrags"]`, orderName);
  // select contract members
  await evan.selectContractMember(`${elements.order.create.form} contract-members`, 'ion-menu.member-add-menu', 'Demo Fahrer DEV');
  // set date and time
  await evan.angularClick(`${elements.order.create.form} ion-datetime button`);
  await browser.waitForElementVisible('ion-picker-cmp .picker-toolbar div:nth-child(2) button', wait.element);
  await evan.angularClick('ion-picker-cmp .picker-toolbar div:nth-child(2) button');
  // customer
  await browser.setValue(`${elements.order.create.form} input[placeholder="Kunde"]`, 'Test Kunde').pause(500);
  await browser.setValue(`${elements.order.create.form} input[placeholder="Telefonnummer"]`, 'Test Telefonnummer').pause(500);
  await browser.setValue(`${elements.order.create.form} input[placeholder="E-Mail Addresse"]`, 'test@test.de').pause(500);
  await browser.setValue(`${elements.order.create.form} input[placeholder="Straße"]`, 'Test Straße').pause(500);
  await browser.setValue(`${elements.order.create.form} input[placeholder="Hausnummer"]`, 'Test Hausnummer').pause(500);
  await browser.setValue(`${elements.order.create.form} input[placeholder="PLZ"]`, '00000').pause(500);
  await browser.setValue(`${elements.order.create.form} input[placeholder="Stadt"]`, 'Test Stadt').pause(500);
  // description
  await browser.setValue(`${elements.order.create.form} textarea[placeholder="z.B. spezifische Beschreibung der Lage"]`, 'Test Beschreibung Test Beschreibung Test Beschreibung Test Beschreibung').pause(500);
  // start creating
  await evan.angularClick(`${elements.order.create.container} button[color="transparency"]`);

  // wait for creation finished and check if it is available
  await evan.syncFinished();
  // wait until the loading button is gone, and the new list was loaded
  await browser.waitForElementNotPresent(`${elements.dt.ordersContainer} ${elements.dt.newOrder} button.loading-button`, wait.element);
  await evan.angularClick('.refresh-icon');
  await browser.waitForElementVisible(`${elements.dt.ordersContainer} ${elements.dt.newOrder} td:first-child`, wait.loading);
  await browser.assert.containsText(`${elements.dt.ordersContainer} ${elements.dt.newOrder} td:first-child`, orderName);

  // check if the order can be loaded
  await evan.angularClick(`${elements.dt.ordersContainer} ${elements.dt.newOrder} button`);
  await browser.waitForElementVisible(`${elements.order.detail.metadata} ion-grid h2.content-header`, wait.loading);
  await browser.assert.containsText(`${elements.order.detail.metadata} ion-grid h2.content-header`, orderName);
  // check if the task are available
  await browser.assert.containsText(`${elements.order.detail.todo(2)} .todo-header-container h2.content-header`, 'Maschine für Transport anmelden');
  await browser.assert.containsText(`${elements.order.detail.todo(3)} .todo-header-container h2.content-header`, 'Maschine transportieren und abmelden');
  await browser.assert.containsText(`${elements.order.detail.todo(4)} .todo-header-container h2.content-header`, 'Schadensreport');
  await browser.assert.containsText(`${elements.order.detail.todo(5)} .todo-header-container h2.content-header`, 'Unterschrift des Kunden');
};

/**
 * Test the transport order solving.
 *
 * @param      {any}  browser  nightwatch browser instance
 */
const solveTransportOrder = async function (browser) {
  // navigate to dashboard
  await browser.url(evan.getRentalRoot());
  await browser.waitForElementVisible('#lindig', wait.element);
  // check if the dashboard is loading and the correct dapp is started and open the dev twin
  await evan.openDigitalTwin(twinAddress);

  // check if the order can be loaded
  await browser.waitForElementVisible(`${elements.dt.ordersContainer} ${elements.dt.newOrder} button`, wait.loading);
  await evan.angularClick(`${elements.dt.ordersContainer} ${elements.dt.newOrder} button`);

  // accept the contract
  await evan.angularClick(`${elements.order.detail.metadata} ion-grid ion-col:nth-child(2) button:nth-child(2)`);
  await evan.syncFinished();

  /* finish 1. task
     activate todo */
  await evan.angularClick(`${elements.order.detail.todo(2)} .todo-header-container button`);
  // activate todo
  await browser.waitForElementVisible('ion-alert .alert-button-group button:nth-child(2)', wait.element);
  await browser.pause(1000);
  await evan.angularClick('ion-alert .alert-button-group button:nth-child(2)');
  await evan.syncFinished();

  /* finish 2. task
     activate todo */
  await evan.angularClick(`${elements.order.detail.todo(3)} .todo-header-container button`);
  // submit alert
  await browser.waitForElementVisible('ion-alert .alert-button-group button:nth-child(2)', wait.element);
  await browser.pause(1000);
  await evan.angularClick('ion-alert .alert-button-group button:nth-child(2)');
  await evan.syncFinished();

  // do not test picture taking in other browsers than chrome
  if (browser.options.desiredCapabilities.browserName === 'chrome') {
    /* finish 3. task
       open todo */
    await evan.angularClick(`${elements.order.detail.todo(4)} .todo-header-container button`);
    // select first radio checkbox
    await evan.angularClick(`${elements.order.detail.todo(4)} .todo-data button#rb-0-0`);

    // make pictures
    await evan.angularClick(`${elements.order.detail.todo(4)} .todo-data > ion-item .picture-container > button`);
    await browser.waitForElementVisible('snapshot-dialog .button-container button:nth-child(2)', wait.element);
    await browser.pause(1000);
    await evan.angularClick('snapshot-dialog .button-container button:nth-child(2)');
    await browser.waitForElementNotPresent('snapshot-dialog .button-container button:nth-child(2)', wait.element);
    await evan.angularClick(`${elements.order.detail.todo(4)} .todo-data > ion-item .picture-container > button`);
    await browser.waitForElementVisible('snapshot-dialog .button-container button:nth-child(2)', wait.element);
    await browser.pause(1000);
    await evan.angularClick('snapshot-dialog .button-container button:nth-child(2)');
    await browser.waitForElementNotPresent('snapshot-dialog .button-container button:nth-child(2)', wait.element);
    await evan.angularClick(`${elements.order.detail.todo(4)} .todo-data > ion-item .picture-container > button`);
    await browser.waitForElementVisible('snapshot-dialog .button-container button:nth-child(2)', wait.element);
    await browser.pause(1000);
    await evan.angularClick('snapshot-dialog .button-container button:nth-child(2)');
    await browser.waitForElementNotPresent('snapshot-dialog .button-container button:nth-child(2)', wait.element);

    // set textarea value
    await browser.setValue(`${elements.order.detail.todo(4)} .todo-data textarea`, 'Test Schadensreport');

    // finish the todo
    await evan.angularClick(`${elements.order.detail.todo(4)} .todo-data .todo-solve-container button`);
    await evan.syncFinished();

    // finish 4. task
    await browser.waitForElementVisible(`${elements.order.detail.todo(5)} .todo-header-container button`, wait.element);
    // open todo
    await evan.angularClick(`${elements.order.detail.todo(5)} .todo-header-container button`);
    await browser.waitForElementVisible(`${elements.order.detail.todo(5)} .todo-data input`, wait.element);

    // set input value
    await browser.setValue(`${elements.order.detail.todo(5)} .todo-data input`, 'Test Schadensreport Signatur');

    // draw to canvas
    await browser.pause(2000);
    await browser.moveToElement('canvas', 10, 10);
    await browser.mouseButtonClick(0);

    // finish the todo
    await evan.angularClick(`${elements.order.detail.todo(5)} .todo-data .todo-solve-container button`);
    await evan.syncFinished();

    // finish the task
    await browser.waitForElementVisible(`${elements.order.detail.tasks} > div > button`, wait.element);
    await evan.angularClick(`${elements.order.detail.tasks} > div > button`);
    // accept the popup
    await browser.waitForElementVisible('ion-alert .alert-button-group button:nth-child(2)', wait.element);
    await browser.pause(1000);
    await evan.angularClick('ion-alert .alert-button-group button:nth-child(2)');
    await evan.syncFinished();
  }
};

/**
 * Test the transport order finishing.
 *
 * @param      {any}  browser  nightwatch browser instance
 */
const finishTransportOrder = async function (browser) {
  // pictures were not tested within other browsers than chrome, break this tests
  if (browser.options.desiredCapabilities.browserName === 'chrome') {
    // navigate to dashboard
    await browser.url(evan.getRentalRoot());
    await browser.waitForElementVisible('#lindig', wait.element);
    // check if the dashboard is loading and the correct dapp is started and open the dev twin
    await evan.openDigitalTwin(twinAddress);

    // check if the order can be loaded
    await browser.waitForElementVisible(`${elements.dt.ordersContainer} ${elements.dt.newOrder}`, wait.loading);
    await evan.angularClick(`${elements.dt.ordersContainer} ${elements.dt.newOrder} button`);
    await browser.waitForElementVisible(`${elements.order.detail.metadata} ion-grid ion-col:nth-child(2) button:nth-child(1)`, wait.element);
    await evan.angularClick(`${elements.order.detail.metadata} ion-grid ion-col:nth-child(2) button:nth-child(1)`);
    await evan.syncFinished();
  }
};


Given(/^I start the rental demo$/, async () => {
  // no actions here
});

Then(/^the disponent can create a transport order$/, async () => {
  client.useCss();
  await createTransportOrder(client);
});

Then(/^the driver can resolve a transport order$/, async () => {
  client.useCss();
  await solveTransportOrder(client);
});

Then(/^the disponent can finish the transport order$/, async () => {
  client.useCss();
  await finishTransportOrder(client);
});
