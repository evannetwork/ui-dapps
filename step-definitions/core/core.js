import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/test-utils.js';

When(/^I click the element with id "([^"]+)"$/,
  async (id) => {
    const evan = setupEvan(client);

    await client.waitForElementPresent(`#${ id }`, 10 * 1000);
    await client.click(`#${ id }`);
  }
);

When(/^I click the element with class "([^"]+)"$/,
  async (className) => {
    const evan = setupEvan(client);

    await client.waitForElementPresent(`.${ className }`, 10 * 1000);
    await client.click(`.${ className }`);
  }
);

Then(/^I want to wait "([^"]+)"s$/,
  async (timeout) => {
    await client.pause(parseInt(timeout * 1000));
  }
);

Then(/^I want to see a element with id "([^"]+)"$/,
  async (id) => {
    const evan = setupEvan(client);

    await client.waitForElementPresent(`.${ id }`, 10 * 1000);
  }
);

Then(/^I want to see a element with class "([^"]+)"$/,
  async (className) => {
    const evan = setupEvan(client);

    await client.waitForElementPresent(`.${ className }`, 10 * 1000);
  }
);