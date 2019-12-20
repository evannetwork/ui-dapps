import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/test-utils.js';

let loggedIn = false;

Given(/^I log in to evan.network using angular( with )?(\w+)?$/, async (customPart, accountName) => {
  client.useCss();
  const evan = setupEvan(client);

  await client.url(`${ evan.baseUrl }#/onboarding.evan?origin=dashboard.evan`);
  await client.pause(5000);
  const user = evan.accounts[accountName || 'default'] || evan.accounts.default;
  if (!user || !user.mnemonic) {
    throw new Error(`no account data found for account ${accountName || 'default'}`);
  }

  await client.execute(function() {
    window.localStorage.setItem('evan-vault', '');
    window.localStorage.setItem('evan-test-mode', true);
    window.localStorage.setItem('evan-warnings-disabled', '{"payment-channel":true}');
    return true;
  }, [], function(result) {
    this.assert.ok(result.value);
  })

  loggedIn = true;
  await client
    .execute(function() {
      window.localStorage['bc-dev-logs'] = 'debug';
      window.localStorage['angular-dev-logs'] = 'debug';
    }, [], function(result) {})
    .waitForElementVisible('onboarding-welcome', 30 * 1000)
    .assert.elementPresent('.slide-zoom > h3')
    .pause(3 * 1000)
    .click('.start-buttons > button:nth-child(2)')
    .waitForElementVisible('mnemonic-display', 10 * 1000)
    .click('mnemonic-display ion-toggle')
    .setValue('.direct-input ion-textarea > textarea', [user.mnemonic, client.Keys.ENTER])
    .waitForElementVisible('.password-dialog', 10 * 1000)
    .setValue('.password-dialog ion-input > input', [user.password, client.Keys.ENTER])
    .pause(3 * 1000);
});

When(/^I log out from angular$/, async () => {
  client.useCss();
  const evan = setupEvan(client);

  if (loggedIn) {
    loggedIn = false;

    await client
      .url(`${ evan.baseUrl }#/profile.evan`)
      .waitForElementPresent('evan-profile-detail .evan-content button.button-outline-md-alert', 10 * 1000)
      .click('evan-profile-detail .evan-content button.button-outline-md-alert')
      .waitForElementPresent(`ion-alert .alert-button-group button:nth-child(2)`, 10 * 1000)
      .pause(3 * 1000)
      .click(`ion-alert .alert-button-group button:nth-child(2)`)
      .pause(100)
      .url(`${ evan.baseUrl }#/onboarding.evan?origin=dashboard.evan`)
      .pause(3 * 1000);
  }
});

Then(/^I can see the angular dashboard$/, async () => {
  client.useCss();
  await client.waitForElementPresent('#dashboard', 30 * 1000);
  await client.assert.visible('#dashboard');
});

Then(/^I am no longer logged in to angular$/, async () => {
  client.useCss();
  await client.waitForElementPresent('onboarding-root', 30 * 1000);
  await client.assert.visible('onboarding-root');
});
 