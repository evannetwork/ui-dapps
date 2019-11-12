import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/test-utils.js';
import { buttonSelector } from '../../step-definitions/standard-ui/button';

let loggedIn = false;

Given(/^I log in to evan.network using vue( with )?(\w+)?$/, async (customPart, accountName) => {
  const evan = setupEvan(client);

  if (customPart && !evan.accounts[accountName]) {
    throw new Error(`no account data found for account ${accountName}`);
  }
  const user = evan.accounts[accountName || 'default'] || evan.accounts.default;
  await client.url(`${ evan.baseUrl }#/dashboard.vue.evan`);
  client.execute(function() {
    window.localStorage.setItem('evan-vault', '');
    window.localStorage.setItem('evan-test-mode', true);
    window.localStorage.setItem('evan-warnings-disabled', '{"payment-channel":true}');
    window.localStorage.setItem('evan-language', 'en');
    window.localStorage.setItem('evan-test-recaptchaId', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
    return true;
  }, [], function(result) {
    this.assert.ok(result.value);
  });

  await client.url(`${ evan.baseUrl }#/dashboard.vue.evan`).refresh();
  await client.pause(5000);

  // vue, to define
  const split = user.mnemonic.split(' ');
  await client.click(`a[href*="#/dashboard.vue.evan/onboarding.vue.evan/sign-in"]`)
  await client.waitForElementVisible('#mnemonicInput0', 10 * 1000);
  for (let i = 0; i < split.length; i++) {
    await client.setValue(`#mnemonicInput${ i }`, [ split[i] ]);
  }
  await client.click('#sign-in');
  await client.waitForElementVisible('#password');
  await client.setValue('#password', [user.password]);
  await client.pause(1000);
  client.useXpath();
  await client.click(buttonSelector('Log in'));
  client.useCss();
  await client.pause(3000);

  loggedIn = true;
});


Given('I go to the evan.network startpage', async () => {
  const evan = setupEvan(client);

  await client.url(`${ evan.baseUrl }#/dashboard.vue.evan`);
  await client.execute(function() {
    window.localStorage.setItem('evan-language', 'en');
    window.localStorage.setItem('evan-test-mode', true);
    window.localStorage.setItem('evan-test-recaptchaId', '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
    return true;
  });
  await client.pause(5000);
});

When(/I log out from vue/, async () => {
  const evan = setupEvan(client);

  if (loggedIn) {
    loggedIn = false;

    await client.url(`${ evan.baseUrl }#/dashboard.vue.evan`)
    await client.waitForElementPresent('#dropdown-profile', 10 * 1000)
    await client.click('#dropdown-profile')
    await client.waitForElementPresent(`#evan-logout`, 10 * 1000)
    await client.click('#evan-logout')
    await client.waitForElementPresent(`.modal-content #submit-logout`, 10 * 1000)
    await client.click('#submit-logout');
  }
});

Then(/I am no longer logged in to vue/, async () => {
  await client.waitForElementPresent('#sign-in', 30 * 1000);
  await client.assert.visible('#sign-in');
});

When(/I switch to vue/, async () => {
  const evan = setupEvan(client);

  await client.url(`${ evan.baseUrl }#/dashboard.vue.evan`);
  await client.waitForElementPresent('#dapp-home', 10 * 1000);
  await client.pause(2000);
});
