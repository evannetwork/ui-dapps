import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/test-utils.js';

When(/I go to My Assets tab/, async () => {
  const evan = setupEvan(client);

  await client.url(`${ evan.baseUrl }#/dashboard.vue.evan/assets.evan  `);
  await client.waitForElementPresent('.digital-twins', 10 * 1000);
});

When(/I go to Digital Twins tab/, async () => {
  const evan = setupEvan(client);

  await client.url(`${ evan.baseUrl }#/dashboard.vue.evan/assets.evan/digitaltwins  `);
  await client.waitForElementPresent('.digital-twins', 10 * 1000);
});

When(/I go to Contacts tab/, async () => {
  const evan = setupEvan(client);

  await client.url(`${ evan.baseUrl }#/dashboard.vue.evan/assets.evan/contacts  `);
  await client.waitForElementPresent('.contacts', 10 * 1000);
});
