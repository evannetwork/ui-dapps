import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/angular.js';


Given(/^I log in to evan.network( with )?(\w+)?$/, async (customPart, accountName) => {
  const evan = setupEvan(client);

  await client.url('https://dashboard.test.evan.network');
  if (customPart && !evan.accounts[accountName]) {
    throw new Error(`no account data found for account ${accountName}`);
  }
  const user = evan.accounts[accountName || 'default'] || evan.accounts.default;
  await evan.login(user.mnemonic, user.password);
});

Then(/^I can see the dashboard$/, async () => {
  console.warn('TODO: write a test for "/^I can see the dashboard$/"')
});

When(/^I log out$/, async () => {
  const evan = setupEvan(client);
  await evan.logout();
});

Then(/^I am no longer logged in$/, async () => {
  console.warn('TODO: write a test for "/^I am no longer logged in$/');
});
