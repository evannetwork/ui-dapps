import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/test-utils.js';

export const WAIT_TIME = 15 * 1000;

Given(/^I open the path "([^"]+)"$/, async path => {
  const evan = setupEvan(client);

  await client.url(`${ evan.baseUrl }#/${ path }`);
});

When(/^I click the element with id "([^"]+)"$/, async id => {
  const evan = setupEvan(client);

  await client.waitForElementPresent(`#${id}`, WAIT_TIME);
  await client.click(`#${id}`);
});

When(/^I click the element with class "([^"]+)"$/, async className => {
  const evan = setupEvan(client);

  await client.waitForElementPresent(`.${className}`, WAIT_TIME);
  await client.click(`.${className}`);
});

When('I click the element with selector {string}', async selector => {
  const evan = setupEvan(client);

  await client.waitForElementPresent(`${selector}`, WAIT_TIME);
  await client.click(`${selector}`);
});

Then(/^I want to wait "([^"]+)"s$/, async timeout => {
  await client.pause(parseInt(timeout * 1000));
});

Then(/^I want to see a element with id "([^"]+)"$/, async id => {
  const evan = setupEvan(client);

  await client.waitForElementPresent(`.${id}`, WAIT_TIME);
});

Then(/^I want to see a element with class "([^"]+)"$/, async className => {
  const evan = setupEvan(client);

  await client.waitForElementPresent(`.${className}`, WAIT_TIME);
});

Then('I press the {string} key', async key => {
  await client.keys(client.Keys[key]);
});
