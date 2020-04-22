import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import * as testUtils from '../../test-utils/test-utils.js';

let loggedIn = false;

Given(/^I log in to evan.network using vue( with )?(\w+)?$/, async (customPart, accountName) => {
  const evan = testUtils.setupEvan(client);

  if (customPart && !evan.accounts[accountName]) {
    throw new Error(`no account data found for account ${accountName}`);
  }
  const user = evan.accounts[accountName || 'default'] || evan.accounts.default;
  await client.url(`${evan.baseUrl}#/dashboard.vue.evan`);

  // login using german language when tagged with '@german'
  const language = global.tags && global.tags.includes('@german') ? 'de' : 'en';

  client.execute(function setDefaults(lang) { // eslint-disable-line prefer-arrow-callback
    window.localStorage.setItem('evan-vault', '');
    window.localStorage.setItem('evan-test-mode', true);
    window.localStorage.setItem('evan-warnings-disabled', '{"payment-channel":true}');
    window.localStorage.setItem('evan-language', lang);
    window.localStorage.setItem('evan-test-recaptchaId', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
    return true;
  }, [language], function (result) {
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
  await client.waitForElementVisible('.btn.btn-primary:not([disabled])');
  await client.click('.btn.btn-primary:not([disabled])');

  await client.waitForElementNotPresent('.evan-loading', 3 * 1000);

  loggedIn = true;
});

Given('I go to the evan.network startpage', async () => {
  client.useCss();
  const evan = testUtils.setupEvan(client);

  // login using german language when tagged with '@german'
  const language = global.tags && global.tags.includes('@german') ? 'de' : 'en';

  await client.url(`${evan.baseUrl}#/dashboard.vue.evan`);
  await client.execute(function setDefaults(lang) { // eslint-disable-line prefer-arrow-callback
    window.localStorage.setItem('evan-language', lang);
    window.localStorage.setItem('evan-test-mode', true);
    window.localStorage.setItem('evan-test-recaptchaId', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
    return true;
  }, [language]);
  await client.waitForElementNotPresent('#evan-initial-loading', 60 * 1000);
  await client.waitForElementVisible('#onboarding\\.vue\\.evan', 60 * 1000);
});

When(/I log out from vue/, async () => {
  loggedIn = false;

  const evan = testUtils.setupEvan(client);
  const language = global.tags && global.tags.includes('@german') ? 'de' : 'en';
  await client.execute(function setDefaults(lang) { // eslint-disable-line prefer-arrow-callback
    window.localStorage.clear();
    window.localStorage.setItem('evan-language', lang);
    window.localStorage.setItem('evan-test-mode', true);
    window.localStorage.setItem('evan-test-recaptchaId', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
    return true;
  }, [language]);
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
