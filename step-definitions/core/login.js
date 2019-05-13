import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/angular.js';
import { isVue, switchToVue } from '../../test-utils/test-utils.js';


const selectors = {
  vueContinueNo: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div.mx-auto.m-0 > div:nth-child(3) > div.modal.fade.show > div > div > div.modal-footer > button.btn.btn-outline-secondary.btn-rounded',
  vueFreeInput: 'div.dapp-wrapper-body.show-sidebar-2 > div > div.container.mx-auto.m-5.p-0.border.bg-level-1 > div.evan-steps.border-top.p-3 > div.pt-3.pb-3 > div > div:nth-child(2) > div > div > label',
  vueLogin1: 'div.dapp-wrapper-body.show-sidebar-2 > div > div.p-3 > div.d-md-flex.container.justify-content-center > div:nth-child(1)',
  vueLogin2: 'div.dapp-wrapper-body.show-sidebar-2 > div > div.container.mx-auto.m-5.p-0.border.bg-level-1 > div.evan-steps.border-top.p-3 > div.pt-3.pb-3 > div > div.text-center.mt-4 > button',
  vuePassword: '#password',
  vueRecoveryKey: 'div.dapp-wrapper-body.show-sidebar-2 > div > div.container.mx-auto.m-5.p-0.border.bg-level-1 > div.evan-steps.border-top.p-3 > div.pt-3.pb-3 > div > div:nth-child(2) > form > div > input',
  vueSwitch: '.theme-evan',
  vueUnlock: 'div.dapp-wrapper-body.show-sidebar-2 > div > div.container.mx-auto.m-5.p-0.border.bg-level-1 > div.evan-steps.border-top.p-3 > div.pt-3.pb-3 > div > form > div.text-center > button',
};

Given(/^I log in to evan.network( with )?(\w+)?$/, async (customPart, accountName) => {
  const evan = setupEvan(client);

  await client.url(evan.baseUrl);
  await client.pause(5000);
  if (customPart && !evan.accounts[accountName]) {
    throw new Error(`no account data found for account ${accountName}`);
  }
  const user = evan.accounts[accountName || 'default'] || evan.accounts.default;


  if (await isVue()) {
    // vue, to define
    await client.click(selectors.vueLogin1);
    await client.waitForElementVisible(selectors.vueFreeInput);
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
  } else {
    await evan.login(user.mnemonic, user.password);
  }
});



When(/^I log out$/, async () => {
  const evan = setupEvan(client);
  await evan.logout();
});


Then(/^I do nothing$/, async () => {
  // as the name says: do nothing
});


When(/^I switch to vue$/, async () => {
  const evan = setupEvan(client);
  const password = evan.accounts.default.password; // no custom user support for now
  await switchToVue({ client, evan, password });
});


Then(/^I can see the dashboard$/, async () => {
  console.warn('TODO: write a test for "/^I can see the dashboard$/"')
});

Then(/^I am no longer logged in$/, async () => {
  console.warn('TODO: write a test for "/^I am no longer logged in$/');
});
