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

Then(/^I want to wait "([^"]+)"s$/,
  async (timeout) => {
    await client.pause(parseInt(timeout * 1000));
  }
);