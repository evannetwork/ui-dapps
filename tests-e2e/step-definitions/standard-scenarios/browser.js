import { client } from 'nightwatch-api';
import { Given, When } from 'cucumber';

import * as testUtils from '../../test-utils/test-utils.js';

const evan = testUtils.setupEvan(client);

/**
 * Navigate to path in browser...
 */
Given('I am on the path {string}', async (path) => {
  await client.url(`${evan.baseUrl}${path}`);

  await client.pause(1000);
});

When('I refresh the page', async () => {
  client.useCss();
  await client.pause(3000);
  await client.refresh();
});
