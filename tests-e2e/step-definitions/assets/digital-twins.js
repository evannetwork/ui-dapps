import { client } from 'nightwatch-api';
import { When } from 'cucumber';

import { setupEvan } from '../../../test-utils/test-utils.js';

When(/I go to My Assets tab/, async () => {
  const evan = setupEvan(client);
  await client.url(`${evan.baseUrl}#/dashboard.vue.evan/assets.evan  `);
  await client.waitForElementPresent('.digital-twins', 10 * 1000);
});

When(/I go to Digital Twins tab/, async () => {
  const evan = setupEvan(client);
  await client.url(`${evan.baseUrl}#/dashboard.vue.evan/assets.evan/digitaltwins  `);
  await client.waitForElementPresent('.digital-twins', 10 * 1000);
});

When(/I go to Contacts tab/, async () => {
  const evan = setupEvan(client);
  await client.url(`${evan.baseUrl}#/dashboard.vue.evan/assets.evan/contacts  `);
  await client.waitForElementPresent('.contacts', 10 * 1000);
});

When(/I search in assets for "([^"]+)"/, async (searchText) => {
  setupEvan(client);
  await client.click('#twin-enable-search');
  await client.pause(1000);
  await client.setValue('#searchInput', searchText);
  await client.pause(2000);
});
