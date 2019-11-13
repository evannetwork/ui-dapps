import { client } from 'nightwatch-api';
import { Given, When, Then, setDefinitionFunctionWrapper, Tag } from 'cucumber';

import { setupEvan } from '../../test-utils/test-utils.js';

const evan = setupEvan(client);

/**
 * Navigate to path in browser...
 */
Given("I am on the path {string}", async (path) => {
  await client.url(`${ evan.baseUrl }${path}`);
  await client.pause(1000)
})

When("I refresh the page", async () => {
  await client.refresh();
})
