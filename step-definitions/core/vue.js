import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/angular.js';
import { isVue, } from '../../test-utils/test-utils.js';


When(/^I switch to vue$/, async () => {
  const evan = setupEvan(client);

  if (await isVue()) {
    return;
  }

  await client.url(`${ evan.baseUrl }#/dashboard.vue.evan`);
  await client.waitForElementPresent('#dapp-home', 10 * 1000);
  await client.pause(2000);
});
