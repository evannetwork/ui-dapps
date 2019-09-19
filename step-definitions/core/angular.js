import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/test-utils.js';

let loggedIn = false;

Given(/^I log in to evan.network using angular( with )?(\w+)?$/, async (customPart, accountName) => {
  const evan = setupEvan(client);

  await client.url(evan.baseUrl);
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
      .pause(3 * 1000);
  }
});

Then(/^I can see the angular dashboard$/, async () => {
  await client.waitForElementPresent('#dashboard', 30 * 1000);
  await client.assert.visible('#dashboard');
});

Then(/^I am no longer logged in to angular$/, async () => {
  await client.waitForElementPresent('onboarding-root', 30 * 1000);
  await client.assert.visible('onboarding-root');
});

When(/I go to EVE payments tab/, async () => {
  const evan = setupEvan(client);

  await client.url(`${ evan.baseUrl }#/dashboard.evan/profile.evan/buy-eve`);
  await client.waitForElementPresent('.buy-eve', 10 * 1000);
});

When('I select the country {string}', async (country) => {
  client.useXpath();

  const countryDropdown = '//ion-label/*[normalize-space(text()) = \'Country *\']/parent::*/following-sibling::ion-select'
  await client.expect.element(countryDropdown).to.be.visible;
  await client.click(countryDropdown);

  await client.waitForElementPresent('//h2[normalize-space(text()) = \'Country *\']', 20e3);
  client.pause(1e3);
  
  const selectedCountry = `//button[@ion-button='alert-radio-button']/*/*[normalize-space(text()) = '${country}']/parent::*/parent::*`;
  const radioButton = await client.element('xpath', selectedCountry);

  await client.execute(function (country) {
    const radioButtons = Array.from(document.querySelectorAll('ion-alert button.alert-radio-button'));
    const matches = radioButtons.filter(function (radioButton) {
      return radioButton.querySelector('.alert-radio-label').innerText === country });
    if (matches.length) {
      matches[0].scrollIntoView();
    }
  }, [ country ]);

  client.pause(1e3);
  await client.click(selectedCountry);
  
  const okButton = '//button[@ion-button=\'alert-button\']/*[normalize-space(text()) = \'OK\']/parent::*';
  await client.click(okButton);

  client.useCss();
});

Then('amount to pay is shown as {string}', async (amount) => {
  client.useXpath();

  const selector = `//h1[normalize-space(text()) = \'Total amount\']/parent::*/following-sibling::div/h1[normalize-space(text()) = \'${amount}\']`;
  await client.waitForElementPresent(selector, 30 * 1000);

  client.useCss();
});