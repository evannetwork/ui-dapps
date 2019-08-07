import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/test-utils.js';

let loggedIn = false;
const selectors = {
  vueContinueNo: 'div.modal.fade.show > div > div > div.modal-footer > button.btn.btn-outline-secondary.btn-rounded',
  vueFreeInput: '#useTextArea ~ label',
  vueLogin1: '#sign-in',
  vueLogin2: '#sign-in',
  vuePassword: '#password',
  vueRecoveryKey: '#mnemonicInput0',
  vueSwitch: '.theme-evan',
  vueUnlock: 'div.evan-steps.border-top.p-3 > div.pt-3.pb-3 > div > form > div.text-center > button',
};

Given(/^I log in to evan.network using vue( with )?(\w+)?$/, async (customPart, accountName) => {
  const evan = setupEvan(client);

  await client.url(`${ evan.baseUrl }#/dashboard.vue.evan`);
  await client.pause(5000);
  if (customPart && !evan.accounts[accountName]) {
    throw new Error(`no account data found for account ${accountName}`);
  }
  const user = evan.accounts[accountName || 'default'] || evan.accounts.default;

  client.execute(function() {
    window.localStorage.setItem('evan-vault', '');
    window.localStorage.setItem('evan-test-mode', true);
    window.localStorage.setItem('evan-warnings-disabled', '{"payment-channel":true}');
    return true;
  }, [], function(result) {
    this.assert.ok(result.value);
  });

  // vue, to define
  await client.click(selectors.vueLogin1);
  await client.waitForElementVisible(selectors.vueFreeInput, 10 * 1000);
  await client.click(selectors.vueFreeInput);
  await client.waitForElementVisible(selectors.vueRecoveryKey);
  await client.setValue(selectors.vueRecoveryKey, [user.mnemonic]);
  await client.waitForElementVisible(selectors.vueLogin2);
  await client.click(selectors.vueLogin2);
  await client.waitForElementVisible(selectors.vuePassword);
  await client.setValue(selectors.vuePassword, [user.password]);
  await client.pause(1000);
  await client.click(selectors.vueUnlock);
  await client.pause(3000);
  const hasContinue = await new Promise((resolve) => {
    client.elements('css selector', selectors.vueContinueNo, result => resolve(!!result.value.length) ); } );
  if (hasContinue) {
    await client.click(selectors.vueContinueNo);
  }
  await client.pause(1000);

  loggedIn = true;
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

Then(/I can see the vue dashboard/, async () => {
  await client.waitForElementPresent('#dapp-home', 30 * 1000);
  await client.assert.visible('#dapp-home');
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
