import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import * as testUtils from '../../test-utils/test-utils.js';
import * as buttons from '../standard-ui/button.js';


let loggedIn = false;

Given(/^I log in to evan.network using vue( with )?(\w+)?$/, async (customPart, accountName) => {
  client.useCss();
  const evan = testUtils.setupEvan(client);

  if (customPart && !evan.accounts[accountName]) {
    throw new Error(`no account data found for account ${accountName}`);
  }
  const user = evan.accounts[accountName || 'default'] || evan.accounts.default;
  await client.url(`${evan.baseUrl}#/dashboard.vue.evan`);
  // eslint-disable-next-line
  client.execute(function () {
    window.localStorage.setItem('evan-vault', '');
    window.localStorage.setItem('evan-test-mode', true);
    window.localStorage.setItem('evan-warnings-disabled', '{"payment-channel":true}');
    window.localStorage.setItem('evan-language', 'en');
    window.localStorage.setItem('evan-test-recaptchaId', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
    return true;
  }, [], function (result) {
    this.assert.ok(result.value);
  });

  await client.url(`${evan.baseUrl}#/dashboard.vue.evan`).refresh();
  await client.waitForElementNotPresent('#evan-initial-loading', 60 * 1000);
  await client.waitForElementVisible('#onboarding\\.vue\\.evan', 60 * 1000);

  // vue, to define
  const split = user.mnemonic.split(' ');
  await client.click('a[href*="#/dashboard.vue.evan/onboarding.vue.evan/sign-in"]');
  await client.waitForElementVisible('#mnemonicInput0', 60 * 1000);
  await Promise.race(split.map((_, index) => client.setValue(`#mnemonicInput${index}`, [split[index]])));
  await client.click('#sign-in');
  await client.waitForElementVisible('#password');
  await client.setValue('#password', [user.password]);
  await client.pause(1000);
  client.useXpath();
  await client.click(buttons.buttonSelector('Log in'));
  client.useCss();
  await client.pause(3000);

  loggedIn = true;
});


Given('I go to the evan.network startpage', async () => {
  client.useCss();
  const evan = testUtils.setupEvan(client);

  await client.url(`${evan.baseUrl}#/dashboard.vue.evan`);
  await client.execute(function setDefaults() { // eslint-disable-line prefer-arrow-callback
    window.localStorage.setItem('evan-language', 'en');
    window.localStorage.setItem('evan-test-mode', true);
    window.localStorage.setItem('evan-test-recaptchaId', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
    return true;
  });
  await client.waitForElementNotPresent('#evan-initial-loading', 60 * 1000);
  await client.waitForElementVisible('#onboarding\\.vue\\.evan', 60 * 1000);
});

When(/I log out from vue/, async () => {
  client.useCss();
  const evan = testUtils.setupEvan(client);

  if (loggedIn) {
    loggedIn = false;

    await client.url(`${evan.baseUrl}#/dashboard.vue.evan`);
    await client.waitForElementPresent('#evan-dapp-profile', 10 * 1000);
    await client.click('#evan-dapp-profile');
    await client.waitForElementPresent('#evan-logout', 10 * 1000);
    await client.click('#evan-logout');
    await client.waitForElementPresent('.modal-content #submit-logout', 10 * 1000);
    await client.click('#submit-logout');
  }
});

Then(/I am no longer logged in to vue/, async () => {
  client.useCss();
  await client.waitForElementNotPresent('#evan-initial-loading', 60 * 1000);
  await client.waitForElementVisible('#onboarding\\.vue\\.evan', 60 * 1000);
});

When(/I switch to vue/, async () => {
  client.useCss();
  const evan = testUtils.setupEvan(client);

  await client.url(`${evan.baseUrl}#/dashboard.vue.evan`);
  await client.waitForElementPresent('#dapp-home', 10 * 1000);
  await client.pause(2000);
});
