import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

import * as testUtils from '../../test-utils/test-utils.js';

export const WAIT_TIME = 15 * 1000;

When(/^I click the element with id "([^"]+)"$/, async (id) => {
  client.useCss();
  testUtils.setupEvan(client);

  await client.waitForElementPresent(`#${id}`, WAIT_TIME);
  await client.click(`#${id}`);
});

When(/^I click the element with class "([^"]+)"$/, async (className) => {
  client.useCss();
  testUtils.setupEvan(client);

  await client.waitForElementPresent(`.${className}`, WAIT_TIME);
  await client.click(`.${className}`);
});

When('I click the element with selector {string}', async (selector) => {
  client.useCss();
  testUtils.setupEvan(client);

  await client.waitForElementPresent(`${selector}`, WAIT_TIME);
  await client.click(`${selector}`);
});

Then(/^I want to wait ([^"]+)s$/, async (timeout) => {
  client.useCss();
  await client.pause(parseInt(timeout * 1000, 10));
});

Then(/^I want to see a element with id "([^"]+)"$/, async (id) => {
  client.useCss();
  testUtils.setupEvan(client);

  await client.waitForElementPresent(`.${id}`, WAIT_TIME);
});

Then(/^I want to see an element with class "([^"]+)"$/, async (className) => {
  client.useCss();
  testUtils.setupEvan(client);

  await client.waitForElementPresent(`.${className}`, WAIT_TIME);
});

Then('I press the {string} key', async (key) => {
  client.useCss();
  await client.keys(client.Keys[key]);
});

/**
 * Waits til loading was finished or max n-seconds.
 */
Then('I wait {int} seconds until loading was finished', async (waitTime) => {
  client.useCss();
  await client.waitForElementNotPresent('.evan-loading', waitTime * 1000);
});
