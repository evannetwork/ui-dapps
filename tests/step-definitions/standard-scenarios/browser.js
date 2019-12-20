import { client } from 'nightwatch-api';
import { Given, When, Then, setDefinitionFunctionWrapper, Tag } from 'cucumber';

import { setupEvan } from '../../test-utils/test-utils.js';

const evan = setupEvan(client);

/**
 * Navigate to path in browser...
 */
Given("I am on the path {string}", async (path) => {
  client.useCss();
  await client.url(`${ evan.baseUrl }${path}`);
  await client.pause(1000)
})

When("I refresh the page", async () => {
  client.useCss();
  await client.pause(3000);
  await client.refresh();
})
